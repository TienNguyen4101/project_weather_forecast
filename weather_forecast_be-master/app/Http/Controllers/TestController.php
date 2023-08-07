<?php

namespace App\Http\Controllers;

use App\Models\DataWeather;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TestController extends Controller
{
    // Disable for unsed
    // public function getAPI() {
    //     $curl = curl_init();
    //     curl_setopt_array($curl, array(
    //     CURLOPT_URL => 'http://api.openweathermap.org/data/2.5/weather?q=Thai%20Binh&appid=41089654792f2c0849980e9e96ac2605&lang=vi',
    //     CURLOPT_RETURNTRANSFER => true,
    //     CURLOPT_ENCODING => '',
    //     CURLOPT_MAXREDIRS => 10,
    //     CURLOPT_TIMEOUT => 0,
    //     CURLOPT_FOLLOWLOCATION => true,
    //     CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    //     CURLOPT_CUSTOMREQUEST => 'GET',
    //     ));

    //     $response = curl_exec($curl);

    //     curl_close($curl);
    //     $res = json_decode($response, false);
    //     $a = $res->sys->sunset;
    //     // dd(gmdate("H:i",));
    //     $data_insert = new DataWeather();
    //     $data_insert->location_id = 1;
    //     $data_insert->temp_current = $res->main->temp - 273;
    //     $data_insert->weather_current = $res->weather[0]->description;
    //     $data_insert->temp_day  = $res->main->temp_max - 273;
    //     $data_insert->temp_night = $res->main->temp_min - 273;
    //     $data_insert->theme_current = $res->weather[0]->main;
    //     $data_insert->feel_temp_current = $res->main->feels_like - 273;
    //     $data_insert->time_sunrise = gmdate("H:i",$res->sys->sunrise + 25200);
    //     $data_insert->time_sunset = gmdate("H:i",$res->sys->sunset + 25200);
    //     $data_insert->temp_min = $res->main->temp_min - 273;
    //     $data_insert->temp_max = $res->main->temp_max - 273;
    //     $data_insert->humidity = $res->main->humidity;
    //     $data_insert->pressure = $res->main->pressure;;
    //     $data_insert->visibility = $res->visibility / 1000;
    //     $data_insert->wind_speed = $res->wind->speed;
    //     $data_insert->wind_degree = $res->wind->deg;
    //     $data_insert->save();
    // }


    public function getAPINew() {
        $res_HN = $this->callAPI(1);
        $this->insertDataWeather($res_HN, 1);
        $this->insertDataWeatherForecast($res_HN, 1);
        $this->insertDataWeatherHistory($res_HN, 1);

        $res_HCM = $this->callAPI(2);
        $this->insertDataWeather($res_HCM, 2);
        $this->insertDataWeatherForecast($res_HCM, 2);
        $this->insertDataWeatherHistory($res_HCM, 2);
    }

    public function callAPI ($location_id) {

        if($location_id == 2) {
            $city = "Ho%20Chi%20Minh";
        }
        else{
            $city = "Ha%20Noi";
        }
        $key = env('API_KEY', 'khongbiet');
        $curl = curl_init();
        $url_req = 'https://api.weatherapi.com/v1/forecast.json?key='.$key.'&q='.$city.'&days=10&aqi=no&alerts=no&lang=vi';
        curl_setopt_array($curl, array(
        CURLOPT_URL => $url_req,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        ));
        $response = curl_exec($curl);
        curl_close($curl);
        $res = json_decode($response, false);
        // dd($res); //for debugging
        return $res;
    }

    public function insertDataWeather($res, $location_id) {
        // Insert data_weather table
        DataWeather::where('location_id', $location_id)->delete(); //Delete data after insert
        $data_insert = new DataWeather();
        $data_insert->location_id = $location_id;
        $data_insert->temp_current = $res->current->temp_c;
        $data_insert->weather_current = $res->current->condition->text;
        $data_insert->temp_day  = $res->forecast->forecastday[0]->day->maxtemp_c;
        $data_insert->temp_night = $res->forecast->forecastday[0]->day->mintemp_c;
        $data_insert->theme_current = $res->current->condition->code;
        $data_insert->icon_link = 'https:'.$res->current->condition->icon;
        $data_insert->feel_temp_current = $res->current->feelslike_c;
        $data_insert->time_sunrise = date("H:i", strtotime($res->forecast->forecastday[0]->astro->sunrise));
        $data_insert->time_sunset = date("H:i",strtotime($res->forecast->forecastday[0]->astro->sunset));
        $data_insert->temp_min = $res->forecast->forecastday[0]->day->mintemp_c;
        $data_insert->temp_max = $res->forecast->forecastday[0]->day->maxtemp_c;
        $data_insert->humidity = $res->current->humidity;
        $data_insert->pressure = $res->current->pressure_mb;
        $data_insert->visibility = $res->current->vis_km;
        $data_insert->wind_speed = $res->current->wind_kph;
        $data_insert->wind_degree = $res->current->wind_degree;
        $data_insert->rain_percentage = $res->forecast->forecastday[0]->day->daily_chance_of_rain;
        $data_insert->save();

    }

    public function insertDataWeatherForecast($res, $location_id) {
        // Insert data_weather_forecast table
        DB::table('data_weather_forecast')->where('location_id', $location_id)->delete();
        for ($i=1; $i < 10 ; $i++) {
            DB::table('data_weather_forecast')->insert([
                'location_id' => $location_id,
                'temp_max' => $res->forecast->forecastday[$i]->day->maxtemp_c,
                'temp_min' => $res->forecast->forecastday[$i]->day->mintemp_c,
                'icon_code' => $res->current->condition->code,
                'icon_link' => 'https:'.$res->current->condition->icon,
                'description' => $res->current->condition->text,
                'rain_percentage' => $res->forecast->forecastday[$i]->day->daily_chance_of_rain,
                'date' => $res->forecast->forecastday[$i]->date,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }
    }

    public function insertDataWeatherHistory($res, $location_id) {
        // Insert data_weather_history table
        $latest_history = DB::table('data_weather_history')->where('location_id', $location_id)->latest()->first();
        // dd();
        if(!$latest_history || $latest_history->date < Carbon::now()->format('Y-m-d')) {
            DB::table('data_weather_history')->insert([
                'location_id' => $location_id,
                'temp_max' => $res->forecast->forecastday[0]->day->maxtemp_c,
                'temp_min' => $res->forecast->forecastday[0]->day->mintemp_c,
                'icon_code' => $res->current->condition->code,
                'icon_link' => 'https:'. str_replace('night', 'day', $res->current->condition->icon),
                'description' => $res->current->condition->text,
                'rain_percentage' => $res->forecast->forecastday[0]->day->daily_chance_of_rain,
                'date' => $res->forecast->forecastday[0]->date,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }
    }
}
