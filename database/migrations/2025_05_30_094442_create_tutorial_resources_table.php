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
        Schema::create('tutorial_resources', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('category')->nullable(); // E.g., 'Backend', 'Frontend', 'DevOps', 'Database'
            $table->string('source')->default('Interno'); // E.g., 'Interno', 'Externo'
            $table->string('link'); // URL to internal doc or external resource
            $table->json('tags')->nullable();
            $table->string('difficulty')->nullable(); // E.g., 'Principiante', 'Intermedio', 'Avanzado'
            $table->string('status')->default('Publicado'); // E.g., 'Publicado', 'Borrador'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tutorial_resources');
    }
};