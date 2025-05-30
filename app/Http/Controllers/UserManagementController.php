<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User; // Asegúrate de que la ruta a tu modelo User sea correcta
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserManagementController extends Controller
{
    /**
     * Muestra la página de gestión de usuarios.
     */
    public function managePage(): Response
    {
        // Define all roles that can be managed or assigned
        $manageableRoles = ['developer', 'admin', 'superadmin', 'leader', 'coordinator', 'interested'];

        $users = User::select('id', 'name', 'email', 'role', 'is_active')
            ->whereIn('role', $manageableRoles) // Filter for manageable roles, now including 'interested'
            ->orderBy('name') // Order users by name
            ->get()
            ->map(function ($user) {
                $user->is_active = (bool) $user->is_active;
                // Role should already be one of the filtered ones
                return $user;
            });

        $availableRoles = $manageableRoles; // Pass all manageable roles to the frontend

        return Inertia::render('Admin/Manage', [
            'initialUsers' => $users,
            'availableRoles' => $availableRoles,
        ]);
    }

    /**
     * Update the role of the specified user.
     */
    public function updateRole(Request $request, User $user): \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'role' => [
                'required',
                Rule::in(['developer', 'admin', 'superadmin', 'leader', 'coordinator', 'interested']), // Add 'interested' to validation
            ],
        ]);

        $user->role = $validated['role'];
        $user->save();

        // After a PUT/PATCH/DELETE request, Inertia expects a redirect.
        // Redirecting back is a common pattern.
        // You can also flash a success message if desired.
        return redirect()->back()->with('success', 'User role updated successfully.');

        // Alternatively, for a pure API-like response if not expecting Inertia to fully reload props:
        // return response()->json(['message' => 'User role updated successfully.']);
    }
    public function updateStatus(Request $request, User $user) // Route model binding
    {
        $validated = $request->validate([
            'is_active' => 'required|boolean', // Valida que is_active sea booleano
        ]);

        $user->is_active = $validated['is_active'];
        $user->save();

        // Para Inertia, un redirect back es común después de un PUT/PATCH/DELETE
        return redirect()->back()->with('success', 'Estado del usuario actualizado.');
        // O una respuesta JSON si no necesitas que Inertia recargue props:
        // return response()->json(['message' => 'Estado actualizado con éxito']);
    }
}