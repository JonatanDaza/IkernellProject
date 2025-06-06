<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('project_user', function (Blueprint $table) {
            $table->timestamps(); // This adds created_at and updated_at
        });
    }

    public function down(): void
    {
        Schema::table('project_user', function (Blueprint $table) {
            $table->dropTimestamps();
        });
    }
};
