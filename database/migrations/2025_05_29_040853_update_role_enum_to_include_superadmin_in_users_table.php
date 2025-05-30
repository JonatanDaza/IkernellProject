<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // No es estrictamente necesario para este enfoque con Schema builder

return new class extends Migration
{
    /**
     * Run the migrations.
     * ADVERTENCIA: Este método eliminará la columna 'role' existente y todos sus datos,
     * luego la recreará con la nueva definición ENUM.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }
        });

        Schema::table('users', function (Blueprint $table) {
            // Añade la nueva columna 'role' como un ENUM, incluyendo 'superadmin'
            $table->enum('role', ['interested', 'admin', 'coordinator', 'leader', 'developer', 'superadmin'])
                  ->default('interested')
                  ->after('lastname'); // Ajusta la posición según sea necesario
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
            // Opcionalmente, si tenías una columna 'role' de tipo string antes, podrías volver a añadirla aquí.
            // $table->string('role')->nullable()->after('lastname');
        });
    }
};