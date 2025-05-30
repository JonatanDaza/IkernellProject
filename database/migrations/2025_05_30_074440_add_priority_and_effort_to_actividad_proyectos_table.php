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
            $table->string('priority')->default('medium')->after('developer_notes'); // O después de la columna que prefieras
            $table->integer('effort_estimation')->nullable()->after('priority'); // Estimación en horas
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('actividad_proyectos', function (Blueprint $table) {
            $table->dropColumn('priority');
            $table->dropColumn('effort_estimation');
        });
    }
};
