<?php

namespace App\Http\Controllers;

use stdClass;
use Carbon\Carbon;
use App\Models\DataWeather;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DataCurrentController extends Controller
{
    //
    public function getSunCurrent($sunrise, $sunset) {

        $time_now = Carbon::now()->format('H:i');
        // $time_now = '17:30';
        if ($time_now < $sunrise || $time_now > $sunset) {
            return -1;
        }
        $sun_shine = strtotime($sunset) - strtotime($sunrise);
        $sun_from_set = strtotime($time_now) - strtotime($sunrise);
        // dd($time_now);
        return ($sun_from_set / $sun_shine) * 100;
    }


    public function getDataCurrent(Request $requests) {

        $location_id = $requests->loc_id;

        $data = DataWeather::where('location_id', $location_id)->latest()->first();

        // dd(date('N', strtotime($data->created_at)));
        $location_current = null;
        if ($location_id == 1) {
            $location_current = "Hà Nội";
        }
        if ($location_id == 2) {
            $location_current = "Hồ Chí Minh";
        }
        return response()->json([
            'locationCurrent' => $location_current,
            'tempCurrent' => round($data->temp_current, 0),
            'weatherCurrent' => $data->weather_current,
            'tempDay' => round($data->temp_day,0),
            'tempNight' => round($data->temp_night, 0),
            'themeCurrent' => $data->theme_current,
            'sunCurrent' => $this->getSunCurrent($data->time_sunrise, $data->time_sunset),
            'feelTempCurrent' => round($data->feel_temp_current,0),
            'timeSunrise' => str_replace(":00", "", $data->time_sunrise),
            'timeSunset' => str_replace (":00", "", $data->time_sunset),
            'detailsCurrent' => array(strval(round($data->temp_max,0)) ."°". "/" . strval(round($data->temp_min,0)) . "°", $data->humidity . "%", $data->pressure . " atm", $data->wind_speed . " km/h", strval($data->wind_degree), $data->visibility . " km")
        ]);
    }

    public function getdataChart (Request $requests) {
        $location_id = $requests->loc_id;
        // Example response
        // return response()->json([
        //     'monday' => array(14, 28, "Thứ 2 (10/10)", "Mưa"),
        //     'tuesday' => array(15, 26, "Thứ 3 (11/10)", "Mây"),
        //     'wednesday' => array(12, 25, "Thứ 4 (12/10)", "Mưa"),
        //     'thursday' => array(16, 28, "Thứ 5 (13/10)", "Nắng"),
        //     'friday' => array(17, 29, "Thứ 6 (14/10)", "Nắng"),
        //     'saturday' => array(13, 28, "Thứ 7 (15/10)", "Mây"),
        //     'sunday' => array(15, 28, "Chủ Nhật (16/10)", "Mây")
        // ]);

        $date_now = Carbon::now();

        $week_day_now = date('N', strtotime($date_now->format('Y-m-d')));
        $name_week_day_now = strtolower($date_now->format('l'));
        // dd($week_day_now);
            // $e = 'monday';
            // $a = 'tuesday';
        // $res->$e = array(14, 28, "Thứ 2 (10/10)", "Mưa");
        // $res->$a = array(14, 28, "Thứ 3 (11/10 )", "Mưa");

        $res = new stdClass();
        // Show history
        for ($i=$week_day_now - 1; $i > 0; $i--) {
            $that_day = Carbon::now()->subDays($i);
            $that_week_day = strtolower($that_day->format('l'));
            $detail_day = DB::table('data_weather_history')->where(['date' => $that_day->format('Y-m-d'), 'location_id' => $location_id])->first();
            $res->$that_week_day = array(
                                         round($detail_day->temp_min, 0),
                                         round($detail_day->temp_max, 0),
                                         $this->getWeekDay(date('N', strtotime($that_day->format('Y-m-d')))). " (". $that_day->format('d/m').")",
                                         $detail_day->description,
                                         $detail_day->icon_link
        );
        }

        // Show today
        $detail_day = DB::table('data_weather')->where(['location_id' => $location_id])->first();
        $res->$name_week_day_now = array(
                                         round($detail_day->temp_min, 0),
                                         round($detail_day->temp_max, 0),
                                         $this->getWeekDay(date('N', strtotime($date_now->format('Y-m-d')))). " (". $date_now->format('d/m').")",
                                         $detail_day->weather_current,
                                         $detail_day->icon_link
        );

        // Show forecast
        if($week_day_now != 0) {
            for ($i = 1; $i <= 6 - $week_day_now + 1; $i++) {
                $that_day = $date_now->addDays(1);
                $that_week_day = strtolower($that_day->format('l'));
                $detail_day = DB::table('data_weather_forecast')->where(['date' => $that_day->format('Y-m-d'), 'location_id' => $location_id])->first();
//                dd($detail_day->temp_min);
                $res->$that_week_day = array(
                    round($detail_day->temp_min, 0),
                    round($detail_day->temp_max, 0),
                    $this->getWeekDay(date('N', strtotime($date_now->format('Y-m-d')))). " (". $date_now->format('d/m').")",
                    $detail_day->description,
                    $detail_day->icon_link

                );
            }
        }
        return $res;
    }

    public function getWeekDay($num_week) {
        if($num_week == 7) {
            return "Chủ Nhật";
        }
            return ("Thứ ". $num_week+1);
    }

    public function getdataHistory (Request $requests) {
        $location_id = $requests->loc_id;

        $res = [];
        $date_now = Carbon::now();
        $week_day_now = date('N', strtotime($date_now->format('Y-m-d')));
        $name_week_day_now = strtolower($date_now->format('l'));
        // Show history
        for ($i=$week_day_now - 1; $i > 0; $i--) {
            $that_day = Carbon::now()->subDays($i);
            $that_week_day = strtolower($that_day->format('l'));
            $detail_day = DB::table('data_weather_history')->where(['date' => $that_day->format('Y-m-d'), 'location_id' => $location_id])->first();
        //     $res->$that_week_day = array($detail_day->temp_min,
        //                                  $detail_day->temp_max,
        //                                  $this->getWeekDay(date('N', strtotime($that_day->format('Y-m-d')))). " (". $that_day->format('d/m').")",
        //                                  $detail_day->description,
        //                                  $detail_day->icon_link
        // );
            array_push($res, array(
                'date' => $this->getWeekDay(date('N', strtotime($that_day->format('Y-m-d')))). " (". $that_day->format('d/m').")",
                'dayTemp' => round($detail_day->temp_max, 0),
                'nightTemp' => round($detail_day->temp_min, 0),
                'weatherDay' => $detail_day->icon_link,
                'rainPercent' => $detail_day->rain_percentage
            ));
        }

        // Show today
        $detail_day = DB::table('data_weather')->where(['location_id' => $location_id])->first();
        // $res->$name_week_day_now = array(
        //                                  $detail_day->temp_min,
        //                                  $detail_day->temp_max,
        //                                  $this->getWeekDay(date('N', strtotime($date_now->format('Y-m-d')))). " (". $date_now->format('d/m').")",
        //                                  $detail_day->weather_current,
        //                                  $detail_day->icon_link
        // );
        array_push($res, array(
            'date' => $this->getWeekDay(date('N', strtotime($date_now->format('Y-m-d')))). " (". $date_now->format('d/m').")",
            'dayTemp' => round($detail_day->temp_max, 0),
            'nightTemp' => round($detail_day->temp_min, 0),
            'weatherDay' => $detail_day->icon_link,
            'rainPercent' => $detail_day->rain_percentage
        ));

        // Show forecast
        if($week_day_now != 0) {
            for ($i = 1; $i <= 6 - $week_day_now + 1; $i++) {
                $that_day = $date_now->addDays(1);
                $that_week_day = strtolower($that_day->format('l'));
                $detail_day = DB::table('data_weather_forecast')->where(['date' => $that_day->format('Y-m-d'), 'location_id' => $location_id])->first();
                // $res->$that_week_day = array(
                //     $detail_day->temp_min,
                //     $detail_day->temp_max,
                //     $this->getWeekDay(date('N', strtotime($date_now->format('Y-m-d')))). " (". $date_now->format('d/m').")",
                //     $detail_day->description,
                //     $detail_day->icon_link

                // );
                array_push($res, array(
                    'date' => $this->getWeekDay(date('N', strtotime($that_day->format('Y-m-d')))). " (". $that_day->format('d/m').")",
                    'dayTemp' => round($detail_day->temp_max, 0),
                    'nightTemp' => round($detail_day->temp_min, 0),
                    'weatherDay' => $detail_day->icon_link,
                    'rainPercent' => $detail_day->rain_percentage
                ));

            }
        }


        return response()->json($res);
        // return response()->json([

        //     // Example response
        //     [
        //         'date' => "Thứ 6 (7/10)",
        //         'dayTemp' => 35,
        //         'nightTemp' => 16,
        //         'weatherDay' => "rainy",
        //         'rainPercent' => 60,
        //       ],
        //       [
        //         'date' => "Thứ 7 (8/10)",
        //         'dayTemp' => 35,
        //         'nightTemp' => 16,
        //         'weatherDay' => "sunny",
        //         'rainPercent' => 18,
        //       ],
        //       [
        //         'date' => "Chủ Nhật (9/10)",
        //         'dayTemp' => 35,
        //         'nightTemp' => 16,
        //         'weatherDay' => "rainy",
        //         'rainPercent' => 70,
        //       ],
        //       [
        //         'date' => "Thứ 2 (10/10)",
        //         'dayTemp' => 35,
        //         'nightTemp' => 16,
        //         'weatherDay' => "rainy",
        //         'rainPercent' => 18,
        //       ],
        //       [
        //         'date' => "Thứ 3 (11/10)",
        //         'dayTemp' => 35,
        //         'nightTemp' => 16,
        //         'weatherDay' => "thunder",
        //         'rainPercent' => 90,
        //       ],
        //       [
        //         'date' => "Thứ 4 (12/10)",
        //         'dayTemp' => 35,
        //         'nightTemp' => 16,
        //         'weatherDay' => "rainy",
        //         'rainPercent' => 18,
        //       ],
        //       [
        //         'date' => "Thứ 5 (13/10)",
        //         'dayTemp' => 33,
        //         'nightTemp' => 16,
        //         'weatherDay' => "thunder",
        //         'rainPercent' => 95,
        //       ],

        //     ]);
    }
}
