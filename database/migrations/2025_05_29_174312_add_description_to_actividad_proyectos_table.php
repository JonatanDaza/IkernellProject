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
            // Añade la columna 'description' como texto largo (text) y hazla nullable
            // porque en tu validación del controlador es 'nullable|string'
            $table->text('description')->nullable()->after('name'); // O después de cualquier otra columna existente, en este caso 'name'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('actividad_proyectos', function (Blueprint $table) {
            // Para revertir la migración, elimina la columna 'description'
            $table->dropColumn('description');
        });
    }
};