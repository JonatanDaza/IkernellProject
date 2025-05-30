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
            // Añade la columna 'project_id' como un UNSIGNED BIGINT
            // que es el tipo de dato que Laravel usa por defecto para los IDs.
            // Es importante que el tipo de dato coincida con la clave primaria de la tabla `projects`.
            $table->foreignId('project_id')
                  ->constrained('projects') // Referencia a la tabla 'projects'
                  ->onDelete('cascade');    // Opcional: define el comportamiento al eliminar un proyecto.
                                           // 'cascade' significa que si se borra un proyecto,
                                           // también se borrarán las actividades asociadas.
                                           // Puedes usar ->nullable() si una actividad puede no tener un proyecto asignado
                                           // (aunque tu validación actual lo hace requerido, 'required|exists:projects,id').
                                           // Si fuera nullable, sería $table->foreignId('project_id')->nullable()->constrained('projects');
            $table->index('project_id'); // Crea un índice para mejorar el rendimiento de las consultas.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('actividad_proyectos', function (Blueprint $table) {
            // Para revertir la migración:
            // 1. Elimina la restricción de clave foránea.
            $table->dropForeign(['project_id']); // El argumento debe ser un array con el nombre de la columna.
            // 2. Elimina la columna.
            $table->dropColumn('project_id');
        });
    }
};