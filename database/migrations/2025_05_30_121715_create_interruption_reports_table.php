<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('interruption_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Asume que el usuario que reporta es obligatorio
            $table->foreignId('project_id')->nullable()->constrained()->onDelete('cascade'); // Permite que project_id sea nulo si una interrupción no está ligada a un proyecto
            $table->string('interruption_type');
            $table->string('interruption_type_other')->nullable();
            $table->date('date');
            $table->string('estimated_duration', 50);
            $table->string('affected_project_phase');
            $table->string('affected_project_phase_other')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interruption_reports');
    }
};