<!DOCTYPE html>
<html>
<head>
    <title>Nuevo Mensaje de Contacto</title>
</head>
<body>
    <h2>Has recibido un nuevo mensaje de contacto desde tu sitio web IKernell:</h2>
    <p><strong>Nombre:</strong> {{ $name }}</p>
    <p><strong>Correo Electrónico del Remitente:</strong> {{ $email }}</p>
    <hr>
    <p><strong>Mensaje:</strong></p>
    <p>{{ nl2br(e($userMessage)) }}</p>
</body>
</html>
