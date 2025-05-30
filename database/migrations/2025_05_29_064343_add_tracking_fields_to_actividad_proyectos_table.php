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
            $table->timestamp('started_at')->nullable()->after('status');
            $table->timestamp('completed_at')->nullable()->after('started_at');
            $table->unsignedInteger('time_spent_seconds')->nullable()->default(0)->after('completed_at');
            $table->text('developer_notes')->nullable()->after('time_spent_seconds');
            // Si quieres un campo de progreso numérico:
            // $table->unsignedTinyInteger('progress_percentage')->default(0)->after('developer_notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('actividad_proyectos', function (Blueprint $table) {
            $table->dropColumn(['started_at', 'completed_at', 'time_spent_seconds', 'developer_notes']);
            // $table->dropColumn('progress_percentage');
        });
    }
};
