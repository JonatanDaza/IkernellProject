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
        Schema::table('users', function (Blueprint $table) {
            // Assuming 'address' should be a string (VARCHAR)
            $table->string('address')->nullable()->after('identification_number'); // Adjust position as needed

            // If addresses can be very long, consider using text() instead of string()
            // $table->text('address')->nullable()->after('identification_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('address');
        });
    }
};