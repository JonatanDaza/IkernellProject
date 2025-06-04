<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next,...$roles): Response
    {
        // --- INICIO DE DEPURACIÓN ---

        // 1. Verificar si el usuario está autenticado
        if (!Auth::check()) {
        Log::info('RoleMiddleware: Usuario NO autenticado para la ruta: ' . $request->fullUrl());
            return response()->view('Errors.UnauthorizedPage');
        }

        $user = Auth::user();
        $userRole = $user->role; // Obtener el rol del usuario autenticado
        $requestedRoles = implode(', ', $roles); // Roles que la ruta requiere
        Log::info('RoleMiddleware: Usuario autenticado: ' . $user->email . ' (Rol: ' . $userRole . ')');
        Log::info('RoleMiddleware: Roles requeridos por la ruta: ' . $requestedRoles);

        // 2. Comprobar si el usuario es superadmin AQUI (dentro del middleware como fallback)
        // Esto es un parche temporal para depurar, la solución Gate::before() es mejor.
        if ($userRole === 'superadmin') {
        Log::info('RoleMiddleware: Usuario ES superadmin. Permitiendo acceso (por bypass en middleware).');
            return $next($request); // Si es superadmin, permite el acceso y sal del middleware.
        }

        // 3. Verificar si el rol del usuario está en los roles permitidos
        if (!in_array($userRole, $roles)) {
            Log::warning('RoleMiddleware: Acceso DENEGADO. Rol de usuario (' . $userRole . ') NO está en los roles permitidos (' . $requestedRoles . ')');
            return response()->view('Errors.UnauthorizedPage');
        }

        Log::info('RoleMiddleware: Acceso PERMITIDO para rol: ' . $userRole);
        // --- FIN DE DEPURACIÓN ---

        return $next($request);
    }
}