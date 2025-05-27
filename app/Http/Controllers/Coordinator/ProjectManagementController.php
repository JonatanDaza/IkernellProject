<?php

namespace App\Http\Controllers\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProjectManagementController extends Controller
{
    /**
     * Show the project management page for coordinators.
     */
    public function coordinatePage(): Response
    {
        $projects = Project::with(['users' => function ($query) {
            $query->select('users.id', 'users.name', 'users.email', 'users.specialty', 'users.role')
                  ->orderBy('users.name'); // Order users within each project
        }])
        ->orderBy('name') // Order projects by name
        ->get();

        // Fetch users who can be assigned.
        $assignableUsers = User::whereIn('role', ['developer', 'interested', 'leader']) // Adjust roles as needed
            ->where('is_active', true) // Only globally active users can be assigned
            ->select('id', 'name', 'email', 'specialty', 'role')
            ->orderBy('name')
            ->get();

        $specialties = User::whereNotNull('specialty')
            ->where('specialty', '!=', '')
            ->distinct()
            ->pluck('specialty')
            ->sort()
            ->values();

        return Inertia::render('Coordinator/Coordinate', [
            'initialProjects' => $projects,
            'assignableUsersList' => $assignableUsers,
            'specialtiesList' => $specialties,
        ]);
    }

    /**
     * Toggle the active status of a user within a specific project.
     */
    public function toggleUserProjectStatus(Request $request, Project $project, User $user): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'is_active_in_project' => 'required|boolean',
        ]);

        if ($project->users()->where('user_id', $user->id)->exists()) {
            $project->users()->updateExistingPivot($user->id, [
                'is_active_in_project' => $validated['is_active_in_project'],
            ]);
            return redirect()->back()->with('success', 'User status in project updated successfully.');
        }
        return redirect()->back()->with('error', 'User is not assigned to this project.');
    }

    /**
     * Link a user to a specific project.
     */
    public function linkUserToProject(Request $request, Project $project): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        if ($project->users()->where('user_id', $validated['user_id'])->exists()) {
            return redirect()->back()->with('error', 'User is already linked to this project.');
        }

        $project->users()->attach($validated['user_id'], ['is_active_in_project' => true]);
        return redirect()->back()->with('success', 'User linked to project successfully.');
    }

    /**
     * Unlink a user from a specific project.
     */
    public function unlinkUserFromProject(Project $project, User $user): \Illuminate\Http\RedirectResponse
    {
        $project->users()->detach($user->id);
        return redirect()->back()->with('success', 'User unlinked from project successfully.');
    }
}