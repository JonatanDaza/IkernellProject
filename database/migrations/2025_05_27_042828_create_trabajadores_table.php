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
        Schema::create('trabajadores', function (Blueprint $table) {
            $table->increments('id_trabajador'); // Primary key
            $table->unsignedBigInteger('id'); // Foreign key to User table
            $table->string('identificacion')->unique();
            $table->date('fecha_nacimiento')->nullable();
            $table->string('direccion')->nullable();
            $table->string('profesion')->nullable();
            $table->string('tipo_trabajador')->nullable();
            $table->string('foto_perfil')->nullable();
            $table->timestamps();

            // Foreign key constraint
            // Corrected "Usuario" to "users" to match the actual table name
            $table->foreign('id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trabajadores');
    }
};