<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Coordinator\ProjectManagementController as CoordinatorProjectManagementController;
use App\Http\Controllers\ProjectManagementController;
use App\Models\User; // Import the User model
use Illuminate\Support\Facades\Auth; // Import Auth facade

class TestController extends Controller
{
    public function admin(): Response
    {
        // Fetch users, excluding those with the 'interested' role,
        $manageableRoles = ['developer', 'admin', 'superadmin', 'leader', 'coordinator', 'interested'];
        $users = User::select('id', 'name', 'email', 'role', 'is_active') // Start the query here
            ->whereIn('role', $manageableRoles) // Filter for manageable roles
            ->orderBy('name')
            ->get()
            ->map(function ($user) {
                $user->is_active = (bool) $user->is_active; // Ensure boolean type
                return $user;
            });
        $availableRoles = $manageableRoles;

        return Inertia::render('Admin/Manage', [
            'initialUsers' => $users,
            'availableRoles' => $availableRoles,
        ]);
    }

    public function superadmin(): Response
    {
        return Inertia::render('Superadmin/Remanage');
    }

    public function developer(): Response
    {
        return Inertia::render('Developer/Develop');
    }

    public function coordinator(): Response
    {
        // Delegate to the actual controller that fetches data for the coordinator view
        return app(CoordinatorProjectManagementController::class)->coordinatePage(); // Correct delegation
    }

    public function leader(): Response
    {
        // Delegate to the actual controller that fetches data for the leader/project manager view.
        return app(ProjectManagementController::class)->manageProjectsPage();
    }
}