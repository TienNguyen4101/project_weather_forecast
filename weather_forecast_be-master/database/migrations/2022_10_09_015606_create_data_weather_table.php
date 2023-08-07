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
        Schema::create('data_weather', function (Blueprint $table) {
            $table->id();
            $table->integer('location_id');
            $table->float('temp_current');
            $table->string('weather_current');
            $table->float('temp_day');
            $table->float('temp_night');
            $table->string('theme_current');
            $table->string('icon_link');
            $table->float('feel_temp_current');
            $table->time('time_sunrise');
            $table->time('time_sunset');
            $table->float('temp_min');
            $table->float('temp_max');
            $table->float('humidity');
            $table->float('pressure');
            $table->float('visibility');
            $table->float('wind_speed');
            $table->float('wind_degree');
            $table->float('rain_percentage');
            
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
        Schema::dropIfExists('data_weather');
    }
};
