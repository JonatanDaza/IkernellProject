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
        Schema::create('desarrolladores', function (Blueprint $table) {
            $table->increments('id_desarrollador');
            $table->unsignedInteger('id_trabajador')->unique(); // Unique because a worker can only be one type of specialized role
            $table->string('especialidad_desarrollo')->nullable();
            $table->timestamps();

            $table->foreign('id_trabajador')->references('id_trabajador')->on('trabajadores')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('desarrolladores');
    }
};