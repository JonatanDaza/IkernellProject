import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import React, { useState, type FormEvent } from 'react'; // Eliminamos useEffect y useRef
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

// Tipos para los datos de la actividad y props
interface SimpleProject {
    id: number;
    name: string;
    status: string; // Añadido para filtrar por proyectos activos
}

interface ActivityFormData {
    name: string;
    description: string;
    project_id: string; // Se manejará como string por el <select>, convertir a número al enviar
    due_date: string;
}

interface MyActivitiesPageProps {
    projects: SimpleProject[]; // Lista de proyectos para asignar la actividad
    errors?: Record<string, string>; // Para errores de validación del backend
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Activities',
        href: route('developer.activities'), // Ruta correcta para listar las actividades
    },
    {
        title: 'Create New Activity',
        href: '#',
    },
];

export default function MyActivities({ projects = [], errors = {} }: MyActivitiesPageProps) {
    const activeProjects = React.useMemo(() => {
        return projects.filter(project => project.status === 'active');
    }, [projects]);

    const [formData, setFormData] = useState<ActivityFormData>(() => {
        const initialActive = projects.filter(p => p.status === 'active');
        return {
            name: '',
            description: '',
            project_id: initialActive.length > 0 ? initialActive[0].id.toString() : '',
            due_date: '',
        };
    });
    // Eliminamos elapsedTimeInSeconds, timerIsRunning, intervalRef
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Eliminamos el useEffect para el temporizador, ya no es necesario.

    // Efecto para actualizar project_id si la lista de activeProjects cambia
    // o si el proyecto seleccionado deja de estar activo.
    React.useEffect(() => {
        const selectedProjectIsStillActive = activeProjects.some(p => p.id.toString() === formData.project_id);

        if (formData.project_id && !selectedProjectIsStillActive) {
            // El proyecto seleccionado ya no está activo, seleccionar el primero activo o limpiar.
            setFormData(prev => ({
                ...prev,
                project_id: activeProjects.length > 0 ? activeProjects[0].id.toString() : ''
            }));
        } else if (!formData.project_id && activeProjects.length > 0) {
            // No hay proyecto seleccionado, pero hay activos disponibles (ej. después de carga inicial).
            setFormData(prev => ({ ...prev, project_id: activeProjects[0].id.toString() }));
        }
    }, [activeProjects, formData.project_id, projects]); // 'projects' en la dependencia asegura que se re-evalúe si la prop original cambia.

    // Efecto para mensajes de éxito/error
    React.useEffect(() => {
        let timerId: NodeJS.Timeout | undefined;
        if (successMessage || errorMessage) {
            timerId = setTimeout(() => {
                setSuccessMessage(null);
                setErrorMessage(null);
            }, 3000);
        }
        return () => {
            if (timerId) {
                clearTimeout(timerId);
            }
        };
    }, [successMessage, errorMessage]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Eliminamos toggleTimer, stopTimerAndLog, resetTimer, formatTime

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);
        setIsSubmitting(true);

        let targetUrl;
        try {
            // Usa la ruta correcta para almacenar actividades.
            // Asegúrate de que esta ruta esté definida en web.php como 'developer.activities.store'
            targetUrl = route('developer.activities.store'); 
        } catch (error) {
            console.error("Error resolving route 'developer.activities.store':", error);
            setErrorMessage("Error: Could not determine the submission URL. Please check route definition or contact support.");
            setIsSubmitting(false);
            return;
        }

        if (!targetUrl) {
            console.error("Error: Route 'developer.activities.store' resolved to an invalid URL (e.g., undefined).");
            setErrorMessage("Error: The submission URL is invalid. Please ensure the route is correctly defined.");
            setIsSubmitting(false);
            return;
        }

        const activityDataToSubmit = {
            ...formData,
            // Convert project_id to number or null; use null if empty string
            project_id: formData.project_id ? parseInt(formData.project_id, 10) : null,
            // Eliminamos time_logged_seconds, ya que el temporizador se ha quitado de la vista.
            // El controlador aún puede manejarlo si lo envía desde otro lugar o si lo define en el backend.
            // Si el controlador espera `time_logged_seconds`, podrías enviarlo como 0 o null aquí,
            // pero si la idea es que el tiempo se registre al iniciar/completar en el backend, no se envía desde aquí.
        };

        router.post(targetUrl, activityDataToSubmit, {
            onSuccess: () => {
                setSuccessMessage('Activity created successfully!');
                // Reset form to initial state
                const currentActiveProjects = projects.filter(p => p.status === 'active');
                setFormData({
                    name: '', description: '',
                    project_id: currentActiveProjects.length > 0 ? currentActiveProjects[0].id.toString() : '',
                    due_date: '' });                // Eliminamos resetTimer();
                setIsSubmitting(false);
            },
            onError: (formErrors) => {
                const errorValues = Object.values(formErrors).flat().join(' ');
                setErrorMessage(`Error creating activity: ${errorValues || 'Please check your input.'}`);
                console.error('Error creating activity:', formErrors);
                setIsSubmitting(false);
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create New Activity" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 md:p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
                        Create New Activity Form
                    </h2>

                    {successMessage && (
                        <div className="my-4 p-3 rounded-md border bg-green-100 dark:bg-green-700 border-green-400 dark:border-green-600 text-green-700 dark:text-green-100">
                            <p>{successMessage}</p>
                        </div>
                    )}
                    {errorMessage && (
                        <div className="my-4 p-3 rounded-md border bg-red-100 dark:bg-red-700 border-red-400 dark:border-red-600 text-red-700 dark:text-red-100">
                            <p>{errorMessage}</p>
                        </div>
                    )}
                    {/* Display specific backend validation errors if they exist */}
                    {Object.keys(errors || {}).length > 0 && (
                        <div className="my-4 p-3 rounded-md border bg-red-100 dark:bg-red-700 border-red-400 dark:border-red-600 text-red-700 dark:text-red-100">
                            <ul className="list-disc list-inside">
                                {Object.entries(errors || {}).map(([field, message]) => (
                                    <li key={field}>{message}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="name">Activity Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            {errors.name && <InputError message={errors.name} className="mt-2" />}
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-24"
                            />
                            {errors.description && <InputError message={errors.description} className="mt-2" />}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="project_id">Project</Label>
                                <select
                                    id="project_id"
                                    name="project_id"
                                    value={formData.project_id}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                >
                                    <option value="">Select a project (optional)</option>
                                    {activeProjects.map((project) => (
                                        <option key={project.id} value={project.id.toString()}>{project.name}</option>
                                    ))}
                                </select>
                                {errors.project_id && <InputError message={errors.project_id} className="mt-2" />}
                            </div>
                            <div>
                                <Label htmlFor="due_date">Fecha de Vencimiento</Label>
                                <Input
                                    id="due_date"
                                    name="due_date"
                                    type="date"
                                    value={formData.due_date}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                                {errors.due_date && <InputError message={errors.due_date} className="mt-2" />}
                            </div>
                        </div>

                        {/* Eliminamos toda la sección del Temporizador */}

                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <a href={route('developer.activities')} className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
                                Cancel
                            </a>
                            <Button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm disabled:opacity-50" disabled={isSubmitting}>
                                Create Activity
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}