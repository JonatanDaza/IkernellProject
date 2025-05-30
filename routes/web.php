<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\ProjectManagementController;
use App\Http\Controllers\Developer\ErrorReportController;
use App\Http\Controllers\Developer\InterruptionReportController;
use App\Http\Controllers\DesarrolladorController; // Added for developer creation by coordinator
use App\Http\Controllers\ReportController; // Importar el controlador de reportes
use App\Http\Controllers\TestController;
use App\Http\Controllers\Coordinator\ProjectManagementController as CoordinatorProjectManagementController; // Aliased import
use App\Http\Controllers\ContactController; // Importar el nuevo controlador
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log; // Import the Log facade


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::post('/contact/send', [ContactController::class, 'send'])->name('contact.send');

Route::middleware(['auth', 'verified'])->group(function () {
    // Corregir la ruta para que apunte al DashboardController y su método mainDashboard
    Route::get('/dashboard', [DashboardController::class, 'mainDashboard'])->name('dashboard');
});

Route::get('/test-email', function () {
    try {
        Mail::raw('This is a test email body.', function ($message) {
            $message->to('ikernell.suport@gmail.com') // Asegúrate que este es el correo donde quieres recibir la prueba
                    ->subject('Test Email from Laravel');
        });
        return "Test email sent (check Mailtrap or your inbox)!";
    } catch (\Exception $e) {
        Log::error("Test email error: " . $e->getMessage());
        return "Error sending test email: " . $e->getMessage();
    }
});

Route::middleware(['auth', 'verified', 'role:superadmin'])->prefix('superadmin')->name('superadmin.')->group(function () {
    Route::get('/superadmin/remanage', [TestController::class,'superadmin'])->name('superadmin');
});

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/admin/manage', [TestController::class,'admin'])->name('admin');
    Route::put('/admin/users/{user}/update-role', [UserManagementController::class, 'updateRole'])->name('admin.users.update-role');

    Route::put('/admin/users/{user}/update-status', [UserManagementController::class, 'updateStatus'])->name('admin.users.update-status');
});

Route::middleware(['auth', 'verified', 'role:developer'])->group(function () {
    Route::get('/developer/develop', [TestController::class,'developer'])->name('developer');

    // Ruta para mostrar el formulario de creación (ya existente)
    Route::get('/developer/activities/create', [DesarrolladorController::class, 'createActivity'])->name('developer.create');

    // ¡AÑADE ESTA RUTA PARA SOLUCIONAR EL ERROR!
    // Esta ruta POST se encargará de recibir los datos del formulario.
    Route::post('/developer/activities', [DesarrolladorController::class, 'storeActivity'])->name('developer.activities.store');

    // Route for the Program Library Dashboard (accessible to developers, but will be made general)
    // This route will be moved or made more generic below.
    // For now, we assume the new general route will handle this.
    // Route::get('/developer/dashboard', [DesarrolladorController::class, 'developerDashboard'])->name('developer.dashboard');

    // Rutas para Reporte de Errores
    Route::get('/developer/error-reports/create', [ErrorReportController::class, 'create'])->name('developer.error-reports.create');
    Route::post('/developer/error-reports', [ErrorReportController::class, 'store'])->name('developer.error-reports.store');

    // Rutas para Registro de Interrupciones
    Route::get('/developer/interruption-reports/create', [InterruptionReportController::class, 'create'])->name('developer.interruption-reports.create');
    Route::post('/developer/interruption-reports', [InterruptionReportController::class, 'store'])->name('developer.interruption-reports.store');

    Route::get('/developer/my-activities', [DesarrolladorController::class, 'myActivities'])->name('developer.activities');
    Route::post('/developer/activities/{actividadProyecto}/start', [DesarrolladorController::class, 'startActivity'])->name('developer.activities.start');
    Route::post('/developer/activities/{actividadProyecto}/complete', [DesarrolladorController::class, 'completeActivity'])->name('developer.activities.complete');
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
    ->group(function () { // ProjectManagementController for leaders
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
        Route::put('/projects/{project}/stage', [ProjectManagementController::class, 'updateProjectStage'])
            ->name('projects.update-stage'); // Add this route
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

// The '/program-library' route is now handled by '/dashboard'.
// You can remove it or, if you want to keep the old URL working for a while, redirect it.
// Example of redirecting (optional):
// Route::redirect('/program-library', '/dashboard', 301);

// Rutas para Reportes (accesibles por roles apropiados, ej. coordinator, leader, admin)
Route::middleware(['auth', 'verified', 'role:coordinator|leader|admin'])->prefix('reports')->name('reports.')->group(function () {
    Route::get('/interruption-form', [ReportController::class, 'interruptionReportForm'])->name('interruption.form');
    Route::post('/interruption-generate', [ReportController::class, 'generateInterruptionReport'])->name('interruption.generate');

    Route::get('/activity-form', [ReportController::class, 'activityReportForm'])->name('activity.form');
    Route::post('/activity-generate', [ReportController::class, 'generateActivityReport'])->name('activity.generate');

    Route::get('/brazilian-company-form', [ReportController::class, 'brazilianCompanyReportForm'])->name('brazilian.form');
    Route::post('/brazilian-company-generate', [ReportController::class, 'generateBrazilianCompanyReport'])->name('brazilian.generate');
});




require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
