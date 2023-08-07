<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DataWeatherHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        // date_default_timezone_set('Asia/Ho_Chi_Minh');
        for ($i=1; $i <= 10 ; $i++) { 
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            // dd(Carbon::now());
            $res_HN = $this->callAPI(1, $date);
            $this->insertDataWeatherHistory($res_HN, 1);
            $res_HCM = $this->callAPI(2, $date);
            $this->insertDataWeatherHistory($res_HN, 2);
        }
    }

    public function callAPI ($location_id, $date_req) {

        if($location_id == 2) {
            $city = "Ho%20Chi%20Minh";
        }
        else{
            $city = "Ha%20Noi";
        }
        $key = env('API_KEY', 'khongbiet');
        $curl = curl_init(); 
        // $url_req = 'https://api.weatherapi.com/v1/forecast.json?key='.$key.'&q='.$city.'&days=10&aqi=no&alerts=no&lang=vi';
        $url_req = 'https://api.weatherapi.com/v1/history.json?key='.$key.'&q='.$city.'&dt='.$date_req.'&lang=vi';
        // dd($url_req);
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

    public function insertDataWeatherHistory($res, $location_id) {
        // Insert data_weather_history table
        // $latest_history = DB::table('data_weather_history')->where('location_id', $location_id)->latest()->first();
        // // dd();
        // if(!$latest_history || $latest_history->date < Carbon::now()->format('Y-m-d')) {
            DB::table('data_weather_history')->insert([
                'location_id' => $location_id,
                'temp_max' => $res->forecast->forecastday[0]->day->maxtemp_c,
                'temp_min' => $res->forecast->forecastday[0]->day->mintemp_c,
                'icon_code' => $res->forecast->forecastday[0]->day->condition->code,
                'icon_link' => ltrim($res->forecast->forecastday[0]->day->condition->icon, "//"),
                'description' => $res->forecast->forecastday[0]->day->condition->text,
                // 'rain_percentage' => $res->forecast->forecastday[0]->day->daily_chance_of_rain,
                'rain_percentage' => rand(0, 100),
                'date' => $res->forecast->forecastday[0]->date,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        // }
    }

}
