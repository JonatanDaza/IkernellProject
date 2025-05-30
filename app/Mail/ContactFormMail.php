<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Address;

class ContactFormMail extends Mailable
{
    use Queueable, SerializesModels;

    public $name;
    public $email;
    public $userMessage; // Renombrado para evitar conflicto con la variable $message de Mailable

    /**
     * Create a new message instance.
     */
    public function __construct(string $name, string $email, string $userMessage)
    {
        $this->name = $name;
        $this->email = $email;
        $this->userMessage = $userMessage;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address($this->email, $this->name), // El correo del remitente del formulario
            replyTo: [ // Para que puedas responder directamente al remitente
                new Address($this->email, $this->name),
            ],
            subject: 'Nuevo Mensaje de Contacto desde IKernell Web',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        // Puedes crear una vista de Blade para el correo si quieres un formato HTML más elaborado
        // Por ejemplo, en resources/views/emails/contact-form.blade.php
        return new Content(
            view: 'emails.contact-form', // Crea esta vista de Blade
            // O usar text si solo quieres texto plano:
            // text: 'emails.contact-form-text'
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
