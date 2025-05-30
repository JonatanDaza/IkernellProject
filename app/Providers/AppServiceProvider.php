<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate; // Import the Gate facade
use App\Models\User; // Import your User model (make sure this path is correct)

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Add the superadmin logic here
        Gate::before(function (User $user, string $ability) {
            // Assuming 'role' is the column in your users table that stores the role string
            // For example, if a user has a 'role' column with 'superadmin' as value
            if ($user->role === 'superadmin') {
                return true; // Superadmin has access to everything
            }
            // If the user is not a superadmin, return null to let other authorization
            // checks (like your RoleMiddleware) handle the request.
            return null;
        });
    }
}