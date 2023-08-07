<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('data_weather_forecast', function (Blueprint $table) {
            $table->id();
            $table->integer('location_id');
            $table->float('temp_max');
            $table->float('temp_min');
            // $table->string('description');
            $table->integer('icon_code');
            $table->string('icon_link');
            $table->string('description');
            $table->integer('rain_percentage');
            $table->date('date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('data_weather_forecast');
    }
};
