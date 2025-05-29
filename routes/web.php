<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\ProjectManagementController; // Ensure this is the correct one for leaders
use App\Http\Controllers\DesarrolladorController; // Added for developer creation by coordinator
use App\Http\Controllers\TestController;
use App\Http\Controllers\Coordinator\ProjectManagementController as CoordinatorProjectManagementController; // Aliased import


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/admin/manage', [TestController::class,'admin'])->name('admin');
    Route::put('/admin/users/{user}/update-role', [UserManagementController::class, 'updateRole'])->name('admin.users.update-role');

    Route::put('/admin/users/{user}/update-status', [UserManagementController::class, 'updateStatus'])->name('admin.users.update-status');
});

Route::middleware(['auth', 'verified', 'role:developer'])->group(function () {
    Route::get('/developer/develop', [TestController::class,'developer'])->name('developer');
});

// Coordinator Routes - Using the dedicated CoordinatorProjectManagementController
Route::middleware(['auth', 'verified', 'role:coordinator'])->prefix('coordinator')
    ->name('coordinator.')->group(function () {
    Route::get('/coordinate', [CoordinatorProjectManagementController::class, 'coordinatePage'])
    ->name('coordinate'); // Changed path and name

    Route::put('/projects/{project}/users/{user}/toggle-status', [CoordinatorProjectManagementController::class, 'toggleUserProjectStatus'])
    ->name('projects.users.toggle-status');
    Route::post('/projects/{project}/users/link', [CoordinatorProjectManagementController::class, 'linkUserToProject'])
    ->name('projects.users.link');
    Route::delete('/projects/{project}/users/{user}/unlink', [CoordinatorProjectManagementController::class, 'unlinkUserFromProject'])
    ->name('projects.users.unlink');

    // Routes for Coordinator to manage Developers
    Route::get('/developers', [DesarrolladorController::class, 'index'])
    ->name('developers.index');
    Route::get('/developers/create', [DesarrolladorController::class, 'create'])
    ->name('developers.create');
    Route::post('/developers', [DesarrolladorController::class, 'store'])
    ->name('developers.store');
    Route::get('/developers/{developer}/edit', [DesarrolladorController::class, 'edit']) // This route is correct for showing the edit form
    ->name('developers.edit');
    Route::put('/developers/{developer}', [DesarrolladorController::class, 'update']) // Changed GET to PUT for the update action
    ->name('developers.update');
});

// Project Manager (Leader) Routes
Route::middleware(['auth', 'verified', 'role:leader'])
    ->prefix('project-manager')
    ->name('project-manager.')
    ->group(function () {
        // This is the route that should match 'project-manager.projects.manage'
        Route::get('/projects', [ProjectManagementController::class, 'manageProjectsPage'])
            ->name('projects.manage');

        Route::get('/projects/create', [ProjectManagementController::class, 'createProjectForm'])
            ->name('projects.create');
        Route::post('/projects', [ProjectManagementController::class, 'storeProject'])
            ->name('projects.store');
        Route::get('/projects/{project}/edit', [ProjectManagementController::class, 'editProjectForm'])
            ->name('projects.edit');
        Route::put('/projects/{project}', [ProjectManagementController::class, 'updateProject'])
            ->name('projects.update');
        Route::put('/projects/{project}/status', [ProjectManagementController::class, 'updateProjectStatus'])
            ->name('projects.update-status');
        Route::get('/projects/{project}/team', [ProjectManagementController::class, 'showProjectTeamForm'])
            ->name('projects.team.manage');

        // Routes for user actions within a project
        Route::put('/projects/{project}/users/{user}/toggle-status', [ProjectManagementController::class, 'toggleUserProjectStatus'])
            ->name('projects.users.toggle-status');
        Route::post('/projects/{project}/users/link', [ProjectManagementController::class, 'linkUserToProject'])
            ->name('projects.users.link');
        Route::delete('/projects/{project}/users/{user}/unlink', [ProjectManagementController::class, 'unlinkUserFromProject'])
            ->name('projects.users.unlink');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
