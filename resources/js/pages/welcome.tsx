import React, { useState, type FormEvent } from 'react'; // Import useState and FormEvent
import { Head, Link, router } from '@inertiajs/react'; // Import router
import AppLogo from '@/components/app-logo'; // Asumiendo que tienes un componente de logo
import TextLink from '@/components/text-link'; // Para enlaces de navegación si usas componentes de Laravel Starter Kit
// import Footer from '@/components/Footer'; // Un componente de pie de página opcional

interface HomeProps {
    // Puedes definir props si necesitas pasar datos dinámicos desde el backend
    // Props para mensajes de feedback del formulario de contacto
    success?: string | null;
    error?: string | null;
}

// Definimos el componente Footer directamente aquí
const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-8 text-center mt-auto"> {/* mt-auto es clave si el contenedor padre es flex */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p>&copy; {new Date().getFullYear()} IKernell. Todos los derechos reservados.</p>
                <p className="text-sm text-gray-400 mt-1">Soluciones Innovadoras de Desarrollo de Software</p>
            </div>
        </footer>
    );
};

const Home: React.FC<HomeProps> = ({ success: initialSuccess, error: initialError }) => {
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Usar las props para mensajes de éxito/error si vienen del backend (después de un redirect)
    // o manejar mensajes locales si la lógica de feedback es solo frontend.
    // Para este ejemplo, asumiremos que el backend redirige con mensajes flash.
    // Si no, necesitarías estados locales para successMessage y errorMessage.


    return (
        <>
            <Head title="IKernell - Soluciones de Desarrollo de Software" />

            {/* Encabezado y Navegación - Modo Oscuro */}
            <header className="bg-gray-900 shadow-lg"> {/* Fondo oscuro, sombra más pronunciada */}
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <Link href="/" prefetch>
                            Ikernell
                        </Link>
                    </div>
                    {/* Botones de Autenticación */}
                    <div className="flex items-center space-x-4">

                        <Link
                            href={route('developer')}
                            className="px-4 py-2 border border-transparent rounded-md font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500 transition ease-in-out duration-150"
                        >
                            Iniciar Sesión
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Contenido Principal */}
            <main className="bg-gray-800 text-gray-200"> {/* Fondo general oscuro, texto claro */}
                {/* Sección Hero / Banner Principal - Mantiene colores vibrantes sobre fondo oscuro */}
                <section className="bg-gradient-to-r from-blue-800 to-indigo-950 text-white py-20 text-center">
                    <div className="max-w-4xl mx-auto px-4">
                        <h1 className="text-5xl font-extrabold mb-4">IKernell: Impulsando tu Visión Digital</h1>
                        <p className="text-xl mb-8">
                            Transformamos ideas en soluciones de software innovadoras y escalables.
                        </p>
                        <Link
                            href="#portafolio-servicios"
                            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-800 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10"
                        >
                            Explora Nuestros Servicios
                        </Link>
                    </div>
                </section>

                {/* Información Empresarial - Modo Oscuro */}
                <section id="informacion-empresarial" className="py-16 bg-gray-900"> {/* Fondo más oscuro */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-extrabold text-white text-center mb-12"> {/* Título blanco */}
                            Quiénes Somos: La Filosofía de IKernell
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-100 mb-4">Misión, Visión y Valores</h3> {/* Título claro */}
                                <p className="text-gray-400 mb-4"> {/* Texto ligeramente más oscuro para contraste */}
                                    En IKernell, nuestra misión es... Nuestra visión es... y nuestros valores fundamentales son la innovación, la calidad, la ética y la colaboración.
                                </p>
                                <h3 className="text-2xl font-bold text-gray-100 mb-4">Nuestra Historia y Cultura</h3>
                                <p className="text-gray-400">
                                    Fundada en [Año], IKernell ha crecido gracias a un equipo apasionado y una cultura que fomenta la creatividad y el aprendizaje continuo.
                                </p>
                            </div>
                            <div>
                                {/* Podrías añadir una imagen o un video aquí */}
                                <img src="/imagen/1366_2000.jpg" alt="Equipo IKernell" className="rounded-lg shadow-lg opacity-80 hover:opacity-100 transition-opacity duration-300" /> {/* Ligera opacidad para integrar, con hover */}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Portafolio de Servicios - Modo Oscuro */}
                <section id="portafolio-servicios" className="py-16 bg-gray-800"> {/* Fondo oscuro */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-extrabold text-white text-center mb-12">
                            Nuestras Soluciones de Software
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Servicio 1: Desarrollo Web */}
                            <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-700"> {/* Fondo oscuro para la tarjeta, borde sutil */}
                                <h3 className="text-2xl font-bold text-blue-400 mb-3">Desarrollo Web</h3> {/* Título de servicio en un color de acento */}
                                <p className="text-gray-300 mb-4">
                                    Creamos sitios web y aplicaciones web robustas, escalables y seguras utilizando las últimas tecnologías.
                                </p>
                                <ul className="list-disc list-inside text-gray-400">
                                    <li>Sitios web corporativos</li>
                                    <li>E-commerce</li>
                                    <li>Plataformas personalizadas</li>
                                </ul>
                                {/* Opcional: Enlace a caso de éxito */}
                                {/* <Link href="#" className="text-blue-500 hover:text-blue-400 mt-4 block">Ver casos de éxito</Link> */}
                            </div>

                            {/* Servicio 2: Aplicaciones Móviles */}
                            <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-700">
                                <h3 className="text-2xl font-bold text-blue-400 mb-3">Aplicaciones Móviles</h3>
                                <p className="text-gray-300 mb-4">
                                    Desarrollamos aplicaciones nativas e híbridas para iOS y Android que ofrecen una experiencia de usuario excepcional.
                                </p>
                                {/* ...otros detalles... */}
                            </div>

                            {/* Servicio 3: Consultoría de Software */}
                            <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-700">
                                <h3 className="text-2xl font-bold text-blue-400 mb-3">Consultoría de Software</h3>
                                <p className="text-gray-300 mb-4">
                                    Ofrecemos asesoramiento experto para optimizar tus procesos, seleccionar tecnologías y planificar tu estrategia digital.
                                </p>
                                {/* ...otros detalles... */}
                            </div>

                            {/* Agrega más servicios según sea necesario */}
                        </div>
                    </div>
                </section>

                {/* Noticias Relacionadas con Software - Modo Oscuro */}
                <section id="noticias-software" className="py-16 bg-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-extrabold text-white text-center mb-12">
                            Noticias y Tendencias del Sector
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Artículo de Noticia 1 */}
                            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
                                <img src="/imagen/IA-2.jpg" alt="Noticia 1" className="w-full h-48 object-cover opacity-80 hover:opacity-100 transition-opacity duration-300" />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-100 mb-2">
                                        El Futuro de la Inteligencia Artificial en el Desarrollo Web
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-4">
                                        25 de Mayo, 2025
                                    </p>
                                    <p className="text-gray-300">
                                        Exploramos cómo la IA está revolucionando la forma en que construimos y optimizamos aplicaciones web...
                                    </p>
                                    <Link href="#" className="text-blue-500 hover:text-blue-400 mt-4 block">Leer más</Link>
                                </div>
                            </div>

                            {/* Artículo de Noticia 2 */}
                            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
                                {/* ...similar al anterior con colores oscuros... */}
                                <img src="/imagen/hqdefault.jpg" alt="Noticia 2" className="w-full h-48 object-cover opacity-80 hover:opacity-100 transition-opacity duration-300" />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-100 mb-2">
                                        Microservicios vs. Monolitos: ¿Cuál es la Mejor Arquitectura?
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-4">
                                        18 de Mayo, 2025
                                    </p>
                                    <p className="text-gray-300">
                                        Analizamos las ventajas y desventajas de cada enfoque para ayudarte a decidir el camino correcto para tu proyecto...
                                    </p>
                                    <Link href="#" className="text-blue-500 hover:text-blue-400 mt-4 block">Leer más</Link>
                                </div>
                            </div>

                            {/* Artículo de Noticia 3 */}
                            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
                                {/* ...similar al anterior con colores oscuros... */}
                                <img src="/imagen/Grupo-2.jpg" alt="Noticia 3" className="w-full h-48 object-cover opacity-80 hover:opacity-100 transition-opacity duration-300" />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-100 mb-2">
                                        Ciberseguridad en el Desarrollo de Software: Prácticas Esenciales
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-4">
                                        10 de Mayo, 2025
                                    </p>
                                    <p className="text-gray-300">
                                        Descubre las mejores prácticas para asegurar tus aplicaciones desde las etapas iniciales del desarrollo...
                                    </p>
                                    <Link href="#" className="text-blue-500 hover:text-blue-400 mt-4 block">Leer más</Link>
                                </div>
                            </div>
                        </div>
                        <div className="text-center mt-12">
                            <Link
                                href="#"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Ver Todas las Noticias
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Preguntas Frecuentes (FAQ) - Modo Oscuro */}
                <section id="preguntas-frecuentes" className="py-16 bg-gray-800">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-extrabold text-white text-center mb-12">
                            Preguntas Frecuentes
                        </h2>
                        {/* Ejemplo de un elemento de FAQ */}
                        <div className="mb-6 border-b border-gray-700 pb-4"> {/* Borde más oscuro */}
                            <h3 className="text-xl font-bold text-gray-100 mb-2"> {/* Título claro */}
                                ¿Cuál es el proceso de desarrollo de software en IKernell?
                            </h3>
                            <p className="text-gray-300"> {/* Texto claro */}
                                Nuestro proceso incluye descubrimiento, diseño, desarrollo ágil, pruebas rigurosas y despliegue continuo.
                            </p>
                        </div>
                        {/* Agrega más preguntas y respuestas */}
                        <div className="mb-6 border-b border-gray-700 pb-4">
                            <h3 className="text-xl font-bold text-gray-100 mb-2">
                                ¿Qué tecnologías utilizan en sus proyectos?
                            </h3>
                            <p className="text-gray-300">
                                Nos especializamos en tecnologías como React, Vue, Laravel, Node.js, Python, y bases de datos SQL/NoSQL.
                            </p>
                        </div>
                        <div className="mb-6 border-b border-gray-700 pb-4">
                            <h3 className="text-xl font-bold text-gray-100 mb-2">
                                ¿Ofrecen soporte post-lanzamiento?
                            </h3>
                            <p className="text-gray-300">
                                Sí, ofrecemos soporte técnico continuo, mantenimiento y actualizaciones para asegurar el óptimo funcionamiento de tu solución.
                            </p>
                        </div>
                        <div className="mb-6 pb-4"> {/* Último elemento sin borde inferior */}
                            <h3 className="text-xl font-bold text-gray-100 mb-2">
                                ¿Cómo puedo solicitar un presupuesto?
                            </h3>
                            <p className="text-gray-300">
                                Puedes rellenar nuestro formulario de contacto o enviarnos un correo electrónico directamente, y nos pondremos en contacto contigo a la brevedad.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Formulario de Contacto - Modo Oscuro */}
                <section id="contacto" className="py-16 bg-gray-900">
                    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-extrabold text-white text-center mb-12">
                            Contáctanos
                        </h2>
                        <p className="text-center text-gray-300 mb-8">
                            ¿Tienes una pregunta específica o quieres discutir tu próximo proyecto? Envíanos un mensaje.
                        </p>
                        {/* Mostrar mensajes de éxito o error */}
                        {initialSuccess && (
                            <div className="mb-4 p-3 rounded-md border bg-green-700 border-green-600 text-green-100">
                                <p>{initialSuccess}</p>
                            </div>
                        )}
                        {initialError && (
                            <div className="mb-4 p-3 rounded-md border bg-red-700 border-red-600 text-red-100">
                                <p>{initialError}</p>
                            </div>
                        )}
                        <form
                            onSubmit={(e: FormEvent<HTMLFormElement>) => {
                                e.preventDefault();
                                setIsSubmitting(true);
                                router.post(route('contact.send'), contactForm, { // 'contact.send' es la ruta que crearemos en Laravel
                                    onSuccess: () => {
                                        setContactForm({ name: '', email: '', message: '' }); // Limpiar formulario
                                        // El mensaje de éxito vendrá de la sesión flash de Laravel
                                        // You might want to explicitly set a success message here if not relying on flash props
                                        // setLocalSuccessMessage("¡Mensaje enviado con éxito!");
                                    },
                                    onError: (errors) => {
                                        // Los errores de validación se mostrarán automáticamente si usas props.errors
                                        // Para un error general:
                                        console.error("Error sending message:", errors);
                                        // Podrías establecer un estado de error aquí si no usas props.errors para esto.
                                        // setLocalErrorMessage("Hubo un error al enviar el mensaje.");
                                    },
                                    onFinish: () => {
                                        setIsSubmitting(false);
                                    },
                                });
                            }}
                            className="space-y-6"
                        >

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300"> {/* Texto claro para labels */}
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={contactForm.name}
                                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                    className="mt-1 block w-full border border-gray-700 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" // Fondo oscuro, texto blanco, placeholder claro
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={contactForm.email}
                                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                    className="mt-1 block w-full border border-gray-700 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                                    Tu Mensaje
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    value={contactForm.message}
                                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                    className="mt-1 block w-full border border-gray-700 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                ></textarea>
                            </div>
                            <div className="text-center">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    Enviar Mensaje
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
            <Footer />
            {/* Pie de Página - Modo Oscuro */}
            {/* <Footer className="bg-gray-900 text-gray-400" /> */} {/* Asegúrate de que tu componente Footer acepte y aplique estas clases */}
        </>
    );
};

export default Home;