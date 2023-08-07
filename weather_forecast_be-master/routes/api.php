<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;
use App\Http\Controllers\DataCurrentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/test', [TestController::class, 'getAPINew']);
Route::get('/data_current', [DataCurrentController::class, 'getDataCurrent']);
Route::get('/data_history', [DataCurrentController::class, 'getDataHistory']);
Route::get('/data_chart', [DataCurrentController::class, 'getDataChart']);