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
            $table->date('due_date')->nullable(); // Or timestamp if you need time
            // If you want it not nullable and with a default, consider:
            // $table->date('due_date')->default(now());
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('actividad_proyectos', function (Blueprint $table) {
            $table->dropColumn('due_date');
        });
    }
};

?>