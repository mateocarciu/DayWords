<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEntriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('entries', function (Blueprint $table) {
            $table->id();
            $table->text('text');
            $table->string('location')->nullable();
            $table->enum('emotion', ['HAPPY', 'SAD', 'ANGRY', 'EXCITED', 'RELAXED', 'OTHER'])->nullable();
            $table->string('mediaUrl')->nullable();
            $table->boolean('public')->default(false)->nullable();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('parent_entry_id')->nullable(); // Pour les sous-entrées
            $table->timestamps();

            // Clés étrangères
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('parent_entry_id')->references('id')->on('entries')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('entries');
    }
}
