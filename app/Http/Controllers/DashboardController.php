<?php

namespace App\Http\Controllers;

use App\Models\TutorialResource;
use App\Models\User; // Importar el modelo User
use App\Models\ProgramResource;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function mainDashboard(): Response
    {
        $programResources = ProgramResource::where('status', 'Aprobado')
                                        ->orderBy('type')
                                        ->orderBy('name')
                                        ->get();

        $tutorialResources = TutorialResource::where('status', 'Publicado')
                                        ->orderBy('category')
                                        ->orderBy('title')
                                        ->get();

        $chatUsers = User::where('id', '!=', optional(Auth::user())->id)->get(['id', 'name']);

        return Inertia::render('dashboard', [
            'programResources' => $programResources,
            'tutorialResources' => $tutorialResources, // <-- ¡Agregado!
            'chatUsers' => $chatUsers,
            'currentUser' => Auth::user() ? ['id' => Auth::user()->id, 'name' => Auth::user()->name] : null,
        ]);
    }
    public function index()
    {
        // Renderiza la vista de Inertia (resources/js/pages/Dashboard.tsx)
        return Inertia::render('dashboard');
    }
}

// namespace App\Http\Controllers;

// use Illuminate\Http\Request;
// use Inertia\Inertia;

// class DashboardController extends Controller
// {
//     public function index()
//     {
//         // Renderiza la vista de Inertia (resources/js/pages/Dashboard.tsx)
//         return Inertia::render('dashboard');
//     }
// }