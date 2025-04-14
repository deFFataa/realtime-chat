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
        Schema::create('board_resolutions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('mom_id');
            $table->foreign('mom_id')->references('id')->on('minutes_of_meetings')->onDelete('cascade');
            $table->string('resolution_file_loc');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('board_resolutions');
    }
};
