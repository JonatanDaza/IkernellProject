<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('actividad_proyectos', function (Blueprint $table) {
            // Verifica si la columna ya existe antes de intentar añadirla
            if (!Schema::hasColumn('actividad_proyectos', 'status')) {
                // Añade la columna status como ENUM o string
                $table->enum('status', ['pending', 'in_progress', 'completed', 'on_hold', 'cancelled']) // Ejemplo de ENUM
                      ->default('pending')
                      ->after('stage'); // O la posición que prefieras, o quita after()
                // O como string:
                // $table->string('status')->default('pending')->after('stage');
            }
        });
    }

    public function down(): void
    {
        Schema::table('actividad_proyectos', function (Blueprint $table) {
            if (Schema::hasColumn('actividad_proyectos', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
};
