<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;
use Illuminate\Support\Facades\Log; // Importar la fachada Log
use Illuminate\Support\Facades\Validator; // Importar Validator

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|min:0',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                        ->withErrors($validator)
                        ->withInput()
                        // It's good practice to also send a general error message if validation fails,
                        // especially if not all errors are displayed inline by Inertia.
                        ->with('error', 'Por favor corrige los errores en el formulario.');
        }

        $name = $request->input('name');
        $email = $request->input('email');
        $userMessage = $request->input('message');
        $recipientEmail = 'ikernell.suport@gmail.com';

        try {
            Mail::to($recipientEmail)->send(new ContactFormMail($name, $email, $userMessage));

            return redirect()->route('home')->withSuccess("¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.");

        }catch (\Exception $e) {
             Log::error("Error al enviar correo de contacto: " . $e->getMessage() . "\n" . $e->getTraceAsString());
        
            return redirect()->route('home')->with('error', 'Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.');
        }
    }
}
