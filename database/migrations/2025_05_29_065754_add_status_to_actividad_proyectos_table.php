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
            if (!Schema::hasColumn('actividad_proyectos', 'status')) {
                // Añade la columna status como ENUM si no existe
                $table->enum('status', ['pending', 'in_progress', 'completed', 'on_hold', 'cancelled'])
                      ->default('pending')
                      ->after('stage'); // Ajusta la posición según sea necesario, o elimínalo si no es importante
            }
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('actividad_proyectos', function (Blueprint $table) {
            if (Schema::hasColumn('actividad_proyectos', 'status')) {
                $table->dropColumn('status');
                // En PostgreSQL, si el ENUM fue creado como un tipo separado,
                // podrías necesitar eliminar el tipo también, pero Laravel
                // a menudo maneja esto creando un constraint CHECK para ENUMs en PG.
            }
        });
    }
};
