<?php

namespace App\Console\Commands;

use App\Models\DataWeather;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class PostCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'crawl:fiftymin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crawl API every 15 minute';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $res_HN = $this->callAPI(1);
        $this->insertDataWeather($res_HN, 1);
        $this->insertDataWeatherForecast($res_HN, 1);
        $this->insertDataWeatherHistory($res_HN, 1);

        $res_HCM = $this->callAPI(2);
        $this->insertDataWeather($res_HCM, 2);
        $this->insertDataWeatherForecast($res_HCM, 2);
        $this->insertDataWeatherHistory($res_HCM, 2);
        echo "OK - ". Carbon::now() . "\r\n";
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
