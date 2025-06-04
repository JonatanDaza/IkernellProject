<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

class ProjectManagementController extends Controller
{
    /**
     * Show the project management page for Project Managers (leaders).
      */
    // Define allowed project statuses if not already globally available
    protected $projectStatuses = ['active', 'inactive', 'finished'];

    public function manageProjectsPage(): Response
    {
        // Fetch projects, eager load leader details
        $projects = Project::with('leader:id,name,lastname') // Eager load leader details including lastname
        ->select('id', 'name', 'description', 'status', 'stage', 'start_date', 'end_date', 'leader_id') // Added 'stage'
        ->orderBy('name') // Order projects by name
        ->get()->map(function ($project) {
            $project->stage = $project->stage ?: Project::STAGE_PENDIENTE; // Ensure stage has a default
            return $project;
        });

        // Fetch users who can be assigned.
        // Fetch users who are leaders to populate the leader filter dropdown
        $potentialLeaders = User::where('role', 'leader') // Or your specific criteria for leaders
            ->select('id', 'name', 'lastname') // Include lastname for the leader filter
            ->get();

        // Define the list of possible project statuses
        // This could also come from a config file or a dedicated table if statuses are dynamic

        return Inertia::render('ProjectManager/ManageProjects', [
            'initialProjects' => $projects,
            'potentialLeaders' => $potentialLeaders,
            'projectStatusList' => $this->projectStatuses,
            'projectStageList' => Project::getStages(), // Pass the list of stages
        ]);
    }

    /**
     * Show the form for creating a new project.
     */
    public function createProjectForm(): Response
    {
        // Get users who can be leaders (e.g., users with 'leader' role, including the current user if they are a leader)
        $potentialLeaders = User::where('role', 'leader') // Or any other criteria for leaders
            ->select('id', 'name', 'lastname', 'email') // Select lastname
            ->orderBy('name')
            ->get();

         return Inertia::render('ProjectManager/CreateProject', [
             'potentialLeaders' => $potentialLeaders,
            'projectStatusList' => $this->projectStatuses,
            'projectStageList' => Project::getStages(),
             'currentUserId' => Auth::id(), // Pass current user's ID to pre-select if desired
        ]);
    }

    /**
     * Store a newly created project in storage.
     */
    public function storeProject(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:projects,name',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'leader_id' => 'nullable|exists:users,id',
            // Add validation for status and stage if they are part of the creation form
            'status' => ['sometimes', 'required', Rule::in($this->projectStatuses)],
            'stage' => ['sometimes', 'required', Rule::in(Project::getStages())],
        ]);

        // Set default status and stage if not provided
        $validatedData['status'] = $validatedData['status'] ?? 'active';
        $validatedData['stage'] = $validatedData['stage'] ?? Project::STAGE_PENDIENTE;

        // Sync stage if status is inactive
        if ($validatedData['status'] === 'inactive') {
            $validatedData['stage'] = Project::STAGE_CIERRE;
        }

        $project = Project::create($validatedData);
        return redirect()->route('project-manager.projects.manage')->with('success', 'Project created successfully.');
    }

    /**
     * Show the form for editing the specified project.
     */
    public function editProjectForm(Project $project): Response
    {
        $potentialLeaders = User::where('role', 'leader')
                                ->select('id', 'name', 'lastname', 'email')
                                ->orderBy('name')
                                ->get();

        // Load the leader relationship if it's not already loaded
        $project->loadMissing('leader');

        return Inertia::render('ProjectManager/EditProject', [
            'project' => $project,
            'potentialLeaders' => $potentialLeaders,
            'projectStatusList' => $this->projectStatuses,
            'projectStageList' => Project::getStages(),
            'currentUserId' => Auth::id(),
        ]);
    }

    /**
     * Update the specified project in storage.
     */
    public function updateProject(Request $request, Project $project): \Illuminate\Http\RedirectResponse
    {
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('projects')->ignore($project->id)],
            'description' => 'nullable|string',
            'status' => ['required', Rule::in(['active', 'inactive', 'finished'])],
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'leader_id' => 'nullable|exists:users,id',
            'stage' => ['required', Rule::in(Project::getStages())], // Add stage validation
        ]);

        // Sync logic for status and stage
        $newStatus = $validatedData['status'];
        $newStage = $validatedData['stage'];

        if ($newStatus === 'inactive' && $newStage !== Project::STAGE_CIERRE) {
            $validatedData['stage'] = Project::STAGE_CIERRE;
        } elseif ($newStatus === 'active' && $newStage === Project::STAGE_CIERRE) {
            $validatedData['stage'] = Project::STAGE_SEGUIMIENTO; // Or another appropriate active stage
        }

        if ($newStage === Project::STAGE_CIERRE && $newStatus !== 'finished' && $newStatus !== 'inactive') {
            $validatedData['status'] = 'inactive';
        } elseif ($newStage !== Project::STAGE_CIERRE && $newStatus === 'inactive' && $project->stage === Project::STAGE_CIERRE) {
            // If moving out of Cierre and status was inactive (due to Cierre), make it active
            $validatedData['status'] = 'active';
        }

        $project->update($validatedData);

        return redirect()->route('project-manager.projects.manage')->with('successMessage', 'Project updated successfully.');
    }

    /**
     * Update the status of the specified project.
     */
    public function updateProjectStatus(Request $request, Project $project): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            // Allow 'active', 'inactive'. 'finished' might be set via a different process or edit form.
            'status' => ['required', Rule::in(['active', 'inactive', 'finished'])], // Allow finished as well if button can set it
        ]);

        $newStatus = $validated['status'];

        // Prevent changing status if project is already 'finished' via this simple toggle
        // Allow changing from 'finished' to 'active' or 'inactive' if needed by business logic
        // if ($project->status === 'finished' && in_array($newStatus, ['active', 'inactive'])) {
        //     return redirect()->back()->with('error', 'Cannot change status of a finished project via this action.');
        // }

        $project->status = $newStatus;

        // Sync stage with status
        if ($newStatus === 'inactive') {
            $project->stage = Project::STAGE_CIERRE;
        } elseif ($newStatus === 'active') {
            if ($project->stage === Project::STAGE_CIERRE) { // If it was 'Cierre' and now 'active'
                $project->stage = Project::STAGE_SEGUIMIENTO; // Or another default active stage
            }
        } elseif ($newStatus === 'finished') {
            $project->stage = Project::STAGE_CIERRE;
        }

        $project->save();

        return redirect()->route('project-manager.projects.manage')->with('successMessage', 'Project status and stage updated successfully.');
    }

    /**
     * Update the stage of the specified project.
     */
    public function updateProjectStage(Request $request, Project $project): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'stage' => ['required', Rule::in(Project::getStages())],
        ]);

        if ($project->status === 'finished') {
            return redirect()->back()->with('error', 'Cannot change status of a finished project via this action.');
        }
        $newStage = $validated['stage'];
        $project->stage = $newStage;

        // Sync status with stage
        if ($newStage === Project::STAGE_CIERRE) {
            if ($project->status !== 'finished') { // Don't change status if already 'finished'
                 $project->status = 'inactive';
            }
        } elseif ($project->status === 'inactive' && $project->status !== 'finished') {
            // If moving out of 'Cierre' stage and project was 'inactive' (and not 'finished')
            // set it back to 'active'.
            $project->status = 'active';
        }

        $project->save();
        return redirect()->route('project-manager.projects.manage')->with('successMessage', 'Project stage and status updated successfully.');
    }

    /**
     * Show the form for managing the team of a specific project.
     */
    public function showProjectTeamForm(Project $project): Response
    {
        // Load the project with its currently assigned users (including pivot data)
        $project->load(['users' => function ($query) {
            $query->orderBy('name');
        }]);

        // Get users who are developers and can be assigned to this project
        // Exclude users already assigned to this project
        $assignedUserIds = $project->users->pluck('id')->toArray();

        $availableDevelopers = User::where('role', 'developer') // Assuming 'developer' is the role
                                ->whereNotIn('id', $assignedUserIds)
                                ->where('is_active', true) // Optionally, only globally active developers
                                ->select('id', 'name', 'lastname', 'email', 'specialty')
                                ->orderBy('name')
                                ->get();

        return Inertia::render('ProjectManager/ManageProjectTeam', [
            'project' => $project,
            'assignedUsers' => $project->users, // Users currently on the project
            'availableDevelopers' => $availableDevelopers, // Developers available to be added
        ]);
    }

    /**
     * Link a user to a specific project.
     */
    public function linkUserToProject(Request $request, Project $project): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id', Rule::unique('project_user')->where(fn ($query) => $query->where('project_id', $project->id))]
        ]);

        // Attach the user to the project, setting default status in project
        $project->users()->attach($validated['user_id'], ['is_active_in_project' => true]);

        return redirect()->back()->with('success', 'User linked to project successfully.');
    }

    /**
     * Unlink a user from a specific project.
     */
    public function unlinkUserFromProject(Project $project, User $user): \Illuminate\Http\RedirectResponse
    {
        // Detach the user from the project
        $project->users()->detach($user->id);

        return redirect()->back()->with('success', 'User unlinked from project successfully.');
    }

    /**
     * Toggle the active status of a user within a specific project.
     */
    public function toggleUserProjectStatus(Request $request, Project $project, User $user): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'is_active_in_project' => 'required|boolean',
        ]);

        // Ensure the user is actually assigned to the project before attempting to update
        if ($project->users()->where('user_id', $user->id)->exists()) {
             $project->users()->updateExistingPivot($user->id, [
                'is_active_in_project' => $validated['is_active_in_project'],
            ]);
             return redirect()->back()->with('success', 'User status in project updated successfully.');
        }

        return redirect()->back()->with('error', 'User is not assigned to this project.');
    }
    public function listProjectsForSelect(): JsonResponse
    {
        // Aquí puedes añadir lógica de autorización más específica si es necesario,
        // aunque la ruta ya está protegida por roles.
        $projects = Project::select('id', 'name')
                            ->orderBy('name')
                            ->get();

        return response()->json($projects);
    }
}