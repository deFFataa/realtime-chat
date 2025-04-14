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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('title')->nullable();
            $table->string('first_name');
            $table->string('middle_name');
            $table->string('last_name');
            $table->string('extension_name')->nullable();
            $table->text('avatar')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('civil_status', ['single', 'married', 'widowed', 'separated', 'divorced'])->nullable();
            $table->enum('sex', ['male', 'female'])->nullable();
            $table->string('citizenship')->default('Filipino');
            $table->string('mobile')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['user','admin', 'super-admin'])->default('user');
            $table->enum('position', ['President', 'Vice President', 'Corporate Secretary', 'Treasurer', 'Assisstant Corporate Secretary', 'Assisstant Treasurer', 'Member', 'Member-At-Large', 'DOST Representative'])->nullable()->default('Member');
            $table->boolean('is_loggedin')->default(false);
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('address', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->text('country')->nullable()->default('Philippines');
            $table->text('region')->nullable();
            $table->text('province')->nullable();
            $table->text('town_city')->nullable();
            $table->text('barangay')->nullable();
            $table->text('state_street_subdivision')->nullable();
            $table->text('zip_code')->nullable();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('address');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
