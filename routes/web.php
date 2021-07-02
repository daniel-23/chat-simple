<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth'])->name('dashboard');

Route::get('/auth/user', function () {
    if (auth()->check()) {
        return response()->json(auth()->user());
    }
    return null;
});



Route::get('/chat/with/{user}', [App\Http\Controllers\ChatController::class, 'chatWith'])->middleware(['auth'])->name('chat.with');
Route::get('/chat/{chat}', [App\Http\Controllers\ChatController::class, 'show'])->middleware(['auth'])->name('chat.show');
Route::get('/chat/{chat}/users', [App\Http\Controllers\ChatController::class, 'getUsers'])->middleware(['auth'])->name('chat.getUsers');
Route::get('/chat/{chat}/messages', [App\Http\Controllers\ChatController::class, 'getMessages'])->middleware(['auth'])->name('chat.getMessages');
Route::resource('messages', App\Http\Controllers\MessageController::class)->middleware(['auth']);

require __DIR__.'/auth.php';

