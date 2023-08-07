<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataWeather extends Model
{
    use HasFactory;
    protected $table = 'data_weather';
    protected $fillable = [
        'location_id',
        'temp_current',
        'weather_current',
        'temp_day',
        'temp_night',
        'theme_current',
        'icon_link',
        'feel_temp_current',
        'time_sunrise',
        'time_sunset',
        'temp_min',
        'temp_max',
        'humidity',
        'pressure',
        'visibility',
        'wind_speed',
        'wind_degree',
        'rain_percentage'
    ];
}
