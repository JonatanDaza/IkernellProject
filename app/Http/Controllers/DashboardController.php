<?php

// namespace App\Http\Controllers;

// use App\Models\TutorialResource;
// use App\Models\User; // Importar el modelo User
// use App\Models\ProgramResource;
// use Inertia\Inertia;
// use Inertia\Response;
// class DashboardController extends Controller
// {
//     // public function mainDashboard(): Response
//     // {
//     //     // $programResources = ProgramResource::where('status', 'Aprobado')
//     //     //                                 ->orderBy('type')
//     //     //                                 ->orderBy('name')
//     //     //                                 ->get();

//     //     // $tutorialResources = TutorialResource::where('status', 'Publicado')
//     //     //                                 ->orderBy('category')
//     //     //                                 ->orderBy('title')
//     //     //                                 ->get(); // This is correctly passed

//     //     // Obtener otros usuarios para la lista de chat, excluyendo al usuario actual
//     //     // $chatUsers = User::where('id', '!=', auth()->id())->get(['id', 'name']);

//     //     return Inertia::render('dashboard', [
//     //         // 'programResources' => $programResources,
//     //         // 'tutorialResources' => $tutorialResources, // This is correctly passed
//     //         // 'chatUsers' => $chatUsers,
//     //         // 'currentUser' => auth()->user() ? ['id' => auth()->user()->id, 'name' => auth()->user()->name] : null,
//     //     ]);
//     // }
//     public function index()
//     {
//     return view('User.Dashboard');
//     }
// }

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Renderiza la vista de Inertia (resources/js/pages/Dashboard.tsx)
        return Inertia::render('Dashboard');
    }
}