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

class ProjectManagementController extends Controller
{
    /**
     * Show the project management page for Project Managers (leaders).
      */
    public function manageProjectsPage(): Response
    {
        // Fetch projects, eager load leader details
        $projects = Project::with('leader:id,name,lastname') // Eager load leader details including lastname
        ->select('id', 'name', 'description', 'status', 'start_date', 'end_date', 'leader_id') // Select specific project fields
        ->orderBy('name') // Order projects by name
        ->get();

        // Fetch users who can be assigned.
        // Fetch users who are leaders to populate the leader filter dropdown
        $potentialLeaders = User::where('role', 'leader') // Or your specific criteria for leaders
            ->select('id', 'name')
            ->select('id', 'name', 'lastname') // Include lastname for the leader filter
            ->get();

        // Define the list of possible project statuses
        // This could also come from a config file or a dedicated table if statuses are dynamic
        $projectStatusList = ['active', 'inactive', 'finished'];


        return Inertia::render('ProjectManager/ManageProjects', [
            'initialProjects' => $projects,
            'potentialLeaders' => $potentialLeaders,
            'projectStatusList' => $projectStatusList,
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
        ]);

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

        $projectStatusList = ['active', 'inactive', 'finished']; // Consistent with manageProjectsPage

        // Load the leader relationship if it's not already loaded
        $project->loadMissing('leader');

        return Inertia::render('ProjectManager/EditProject', [
            'project' => $project,
            'potentialLeaders' => $potentialLeaders,
            'projectStatusList' => $projectStatusList,
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
        ]);

        $project->update($validatedData);

        return redirect()->route('project-manager.projects.manage')->with('success', 'Project updated successfully.');
    }

    /**
     * Update the status of the specified project.
     */
    public function updateProjectStatus(Request $request, Project $project): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            // Allow 'active', 'inactive'. 'finished' might be set via a different process or edit form.
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);

        // Prevent changing status if project is already 'finished' via this simple toggle
        if ($project->status === 'finished' && in_array($validated['status'], ['active', 'inactive'])) {
            return redirect()->back()->with('error', 'Cannot change status of a finished project via this action.');
        }

        $project->status = $validated['status'];
        $project->save();

        return redirect()->route('project-manager.projects.manage')->with('success', 'Project status updated successfully.');
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
}