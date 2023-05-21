<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\DashboardController;


    //Home
    Route::get('/', [HomeController::class, 'index'])->name('index');
    Route::get('/about', [HomeController::class, 'about']);
    Route::get('/services', [HomeController::class, 'services']);
    Route::get('/process', [HomeController::class, 'process']);
    Route::get('/blog', [HomeController::class, 'blog']);
    Route::get('/contact', [HomeController::class, 'contact']);

    //Auth
    Route::get('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/login', [AuthController::class, 'authenticated'])->name('login.authenticated');
    Route::get('/logout', [AuthController::class, 'logout'])->name('logout');


    Route::middleware(['auth'])->group(function () {
        //Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/', [HomeController::class, 'index'])->name('index');


    });
    

