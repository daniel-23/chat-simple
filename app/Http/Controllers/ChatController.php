<?php

namespace App\Http\Controllers;

use App\Models\{Chat, User};
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Chat  $chat
     * @return \Illuminate\Http\Response
     */
    public function show(Chat $chat)
    {
        //Abortar si el usuario no esta en la sala de chat
        abort_unless($chat->users->contains(auth()->id()),403);
        return view('chat')->with('chat', $chat);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Chat  $chat
     * @return \Illuminate\Http\Response
     */
    public function edit(Chat $chat)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Chat  $chat
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Chat $chat)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Chat  $chat
     * @return \Illuminate\Http\Response
     */
    public function destroy(Chat $chat)
    {
        //
    }

    public function chatWith(User $user)
    {
        $chat = auth()->user()->chats()->wherehas('users', function($q) use ($user){
            $q->where('chat_user.user_id', $user->id);
        })->first();
        

        if (is_null($chat)) {
            $chat = Chat::create([]);
            $chat->users()->sync([auth()->id(), $user->id]);
        }

        return redirect()->route('chat.show', $chat);
    }
    public function getUsers(Chat $chat)
    {
        abort_unless($chat->users->contains(auth()->id()),403);
        return response()->json($chat->users);
    }

    public function getMessages(Chat $chat)
    {
        abort_unless($chat->users->contains(auth()->id()),403);
        return response()->json($chat->messages()->with('user')->get());
    }

    
}
