<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // Add this line

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // First, drop the old 'role' column if it exists and is not an enum
            // Be careful with existing data if you don't handle it
            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }
        });

        Schema::table('users', function (Blueprint $table) {
            // Add the new 'role' column as an enum
            $table->enum('role', ['interested', 'admin', 'coordinator', 'leader', 'developer'])
                  ->default('interested')
                  ->after('lastname'); // Adjust position as needed
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Reverse the changes: drop the enum role and optionally re-add as string if needed
            $table->dropColumn('role');
            // If you had a 'role' string column before, you might want to re-add it here
            // $table->string('role')->nullable()->after('lastname');
        });
    }
};