<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    protected $user;

    public function __construct()
    {
        $this->user = Auth::user();
    }

    public function show()
    {
        return response()->json($this->user);
    }

    public function update(Request $request)
    {
        $this->user->update($request->all());
        return response()->json($this->user);
    }
}
