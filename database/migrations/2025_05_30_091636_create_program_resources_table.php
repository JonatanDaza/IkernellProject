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

        // Schema::create('program_resources', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('name');
        //     $table->string('type'); // e.g., 'Software', 'Herramienta', 'Licencia', 'Librería', 'Framework', 'Documentación'
        //     $table->string('version')->nullable();
        //     $table->text('description');
        //     $table->string('link')->nullable();
        //     $table->json('tags')->nullable(); // For storing tags as a JSON array
        //     $table->string('status')->default('En Revisión'); // e.g., 'Aprobado', 'En Revisión', 'Obsoleto'
        //     $table->string('category')->nullable();
        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('program_resources');
    }
};