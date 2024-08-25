<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Auth\AuthenticationException; // Add this line

class Authenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    // public function handle(Request $request, Closure $next): Response
    // {
    //     return $next($request);
    // }

    protected function unauthenticated($request, array $guards)
{
    if ($request->expectsJson()) {
        return response()->json(['message' => 'Unauthenticated.'], 401);
    }

    throw new AuthenticationException(
        'Unauthenticated.', $guards, $this->redirectTo($request)
    );
}
}