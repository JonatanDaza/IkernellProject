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
            // Añade la columna user_id después de project_id (o donde prefieras)
            // Asegúrate de que la tabla 'users' y la columna 'id' existan.
            $table->foreignId('user_id')->nullable()->after('project_id')->constrained('users')->onDelete('set null');
            // 'nullable()' permite que una actividad no esté asignada o que el usuario sea eliminado sin eliminar la actividad.
            // 'onDelete('set null')' hará que user_id sea null si el usuario referenciado es eliminado.
            // Puedes cambiar onDelete('cascade') si prefieres que la actividad se elimine si el usuario es eliminado.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('actividad_proyectos', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};