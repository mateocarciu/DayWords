<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEntriesTable extends Migration
{
    public function up()
    {
        Schema::create('entries', function (Blueprint $table) {
            $table->id();
            $table->text('text');
            $table->time('time');
            $table->date('date');
            $table->string('location')->nullable();
            $table->enum('emotion', ['HAPPY', 'SAD', 'ANGRY', 'EXCITED', 'RELAXED', 'OTHER'])->nullable();
            $table->string('media_url')->nullable();
            $table->boolean('public')->default(true);
            $table->foreignId('parent_entry_id')->nullable()->constrained('entries')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('entries');
    }
}
