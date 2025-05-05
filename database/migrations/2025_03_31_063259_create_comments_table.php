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
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('post_id')->nullable(); // still keep for top-level comments
            $table->unsignedBigInteger('parent_id')->nullable(); // for replies
            $table->unsignedBigInteger('user_id');
            $table->text('comment');
            $table->timestamps();
        
            // Foreign Keys
            $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
            $table->foreign('parent_id')->references('id')->on('comments')->onDelete('cascade'); // self-reference
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
