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
        Schema::table('reporte_proyectos', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->after('id');
            $table->string('error_type', 255)->after('user_id');
            $table->text('description')->after('error_type');
            $table->string('project_phase', 255)->after('description');
            $table->string('severity', 50)->after('project_phase');

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reporte_proyectos', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'error_type', 'description', 'project_phase', 'severity']);
        });
    }
};