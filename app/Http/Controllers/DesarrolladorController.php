<?php

namespace App\Http\Controllers;
 
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
 
class DesarrolladorController extends Controller
{
    /**
     * Show the form for creating a new developer.
     */
    public function create(): Response
    {
        // Estas listas podrían venir de una tabla de configuración o ser hardcodeadas
        $specialtyList = $this->getSpecialtyList();
        $workerTypeList = $this->getWorkerTypeList();
 
    return Inertia::render('Coordinator/Developers/Create', [ 
        'specialtyList' => $specialtyList,
        'workerTypeList' => $workerTypeList,
    ]);
    }
 
    /**
     * Store a newly created developer in storage.
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'date_of_birth' => 'nullable|date',
            'identification_number' => 'nullable|string|max:255|unique:users,identification_number',
            'address' => 'nullable|string|max:1000',
            'profession' => 'nullable|string|max:255',
            'specialty' => ['required', 'string', Rule::in($this->getSpecialtyList())], // Use helper method
            'worker_type' => ['required', 'string', Rule::in($this->getWorkerTypeList())], // Use helper method
            'profile_photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048', // 2MB Max
        ]);
 
        $profilePhotoPath = null;
        if ($request->hasFile('profile_photo')) {
            // Guarda en 'public/profile-photos' y el path guardado será 'profile-photos/filename.jpg'
            $profilePhotoPath = $request->file('profile_photo')->store('profile-photos', 'public');
        }
 
        User::create([
            'name' => $request->name,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'developer', // Asignar rol de desarrollador
            'is_active' => true, // Activar por defecto
            'date_of_birth' => $request->date_of_birth,
            'identification_number' => $request->identification_number,
            'address' => $request->address,
            'profession' => $request->profession,
            'specialty' => $request->specialty,
            'worker_type' => $request->worker_type,
            'profile_photo_path' => $profilePhotoPath,
        ]);
        // Redirigir a una página relevante para el coordinador, por ejemplo, la página principal del coordinador.
        // Ajusta 'coordinator.coordinate' si tienes una ruta diferente para el dashboard del coordinador.
        return redirect()->route('coordinator.coordinate')->with('success', 'Developer registered successfully!');
    }

    /**
     * Display a listing of the developers.
     */
    public function index(): Response
    {
        $developers = User::where('role', 'developer')
            ->select('id', 'name', 'lastname', 'email', 'specialty', 'worker_type', 'is_active', 'profile_photo_path') // Select necessary fields
            ->orderBy('name')
            ->paginate(10); // Or use get() if you don't need pagination

        // If 'Coordinator/Developers/Index' does not exist and you want to render
        // the main coordinator dashboard, change the view path here.
        return Inertia::render('Coordinator/coordinate', [
            'developers' => $developers,
        ]);
    }



    /**
     * Show the form for editing the specified developer.
     */
    public function edit(User $developer): Response
    {
        // Ensure the user being edited is indeed a developer
        if ($developer->role !== 'developer') {
            abort(404); // Or redirect with an error
        }

        return Inertia::render('Coordinator/Developers/Edit', [
            'developer' => $developer->only(
                'id', 'name', 'lastname', 'email', 'identification_number', 
                'address', 'profession', 'specialty', 'worker_type', 'profile_photo_path', 'is_active'
                // Exclude password, date_of_birth
            ),
            'specialtyList' => $this->getSpecialtyList(),
            'workerTypeList' => $this->getWorkerTypeList(),
        ]);
    }

    /**
     * Update the specified developer in storage.
     */
    public function update(Request $request, User $developer): \Illuminate\Http\RedirectResponse
    {
        // Ensure the user being edited is indeed a developer
        if ($developer->role !== 'developer') {
            abort(403, 'Cannot update this user type.');
        }

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($developer->id)],
            // 'date_of_birth' is not updatable as per requirements
            'identification_number' => ['nullable', 'string', 'max:255', Rule::unique('users', 'identification_number')->ignore($developer->id)],
            'address' => 'nullable|string|max:1000',
            'profession' => 'nullable|string|max:255',
            'specialty' => ['required', 'string', Rule::in($this->getSpecialtyList())],
            'worker_type' => ['required', 'string', Rule::in($this->getWorkerTypeList())],
            'profile_photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048', // 2MB Max
            'is_active' => 'required|boolean', // Allow updating active status
        ]);

        if ($request->hasFile('profile_photo')) {
            // Delete old photo if it exists
            if ($developer->profile_photo_path) {
                Storage::disk('public')->delete($developer->profile_photo_path);
            }
            $validatedData['profile_photo_path'] = $request->file('profile_photo')->store('profile-photos', 'public');
        }

        // Remove profile_photo from validatedData as it's not a column in the users table
        unset($validatedData['profile_photo']);

        $developer->update($validatedData);

        // Redirect to a developer listing page or the coordinator dashboard
        // For now, redirecting to coordinator dashboard.
        // Consider creating a route like 'coordinator.developers.index' in the future.
        return redirect()->route('coordinator.coordinate')->with('success', 'Developer profile updated successfully!');
    }

    private function getSpecialtyList(): array
    {
        return ['Backend', 'Frontend', 'DevOps', 'Mobile', 'Fullstack', 'Data Science', 'QA Engineer', 'UX/UI Designer'];
    }

    private function getWorkerTypeList(): array
    {
        return ['Full-time', 'Part-time', 'Contractor', 'Intern'];
    }
}