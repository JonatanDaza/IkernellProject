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
        Schema::table('actividad_proyectos', function (Blueprint $table) {
            // Añade la columna 'name' como string y hazla requerida (not nullable)
            // Si permites que sea nullable, usa ->nullable()
            $table->string('name')->after('id'); // O después de cualquier otra columna existente
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('actividad_proyectos', function (Blueprint $table) {
            // Para revertir la migración, elimina la columna 'name'
            $table->dropColumn('name');
        });
    }
};