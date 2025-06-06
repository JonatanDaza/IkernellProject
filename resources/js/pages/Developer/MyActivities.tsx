import AppLayout from '@/layouts/app-layout'; // Cambiado de AuthenticatedLayout
import { Head, useForm, router, Link, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import React, { useState, useEffect } from 'react'; // Added useEffect for potential messages
import { User, SharedData, BreadcrumbItem } from '@/types'; // Asumiendo que tienes estos tipos definidos
import { Button } from '@headlessui/react';

// Define tipos para los datos que vienen del backend
interface Project {
    id: number;
    name: string;
}

interface Activity {
    id: number;
    description: string;
    status: string; // 'pending', 'in_progress', 'completed', etc.
    status_display: string; // 'Pendiente', 'En Progreso', 'Completada'
    project: Project; // O solo project_name si lo transformaste así en el controlador
    project_name: string;
    stage: string; // Etapa de la actividad
    created_at: string;
    due_date?: string | null;
    started_at_formatted?: string | null;
    completed_at_formatted?: string | null;
    time_spent_formatted?: string;
    developer_notes?: string | null;
}

interface PageProps extends InertiaPageProps {
    auth: SharedData['auth'];
    activities: Activity[];
    successMessage?: string | null; // Add successMessage to props
}

interface ActivityCompletionForm {
    developer_notes: string;
    [key: string]: any; // Añade esta línea para la index signature
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    let bgColor = 'bg-gray-100 dark:bg-gray-700';
    let textColor = 'text-gray-800 dark:text-gray-300';

    // Determine bgColor and textColor based on status
    // Assuming status_display can be 'Pendiente', 'En Progreso', 'Completada'
    switch (status.toLowerCase()) {
        case 'pendiente':
            bgColor = 'bg-yellow-100 dark:bg-yellow-700';
            textColor = 'text-yellow-800 dark:text-yellow-200';
            break;
        case 'en progreso':
            bgColor = 'bg-blue-100 dark:bg-blue-700';
            textColor = 'text-blue-800 dark:text-blue-200';
            break;
        case 'completada':
            bgColor = 'bg-green-100 dark:bg-green-700';
            textColor = 'text-green-800 dark:text-green-200';
            break;
        // Add more cases if there are other statuses
        default:
            bgColor = 'bg-gray-100 dark:bg-gray-700';
            textColor = 'text-gray-800 dark:text-gray-300';
            break;
    }
    return (
        <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
            {status}
        </span>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Activities',
        href: route(''), // Assuming this route exists
    },
];

export default function MyActivities({ auth, activities, successMessage: initialSuccessMessage }: PageProps) {
    const [completingActivityId, setCompletingActivityId] = useState<number | null>(null);
    const [deletingActivityId, setDeletingActivityId] = useState<number | null>(null);
    const [isDeletingOperation, setIsDeletingOperation] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(initialSuccessMessage || null);

    const { data, setData, post, processing, errors, reset } = useForm<ActivityCompletionForm>({
        developer_notes: '',
    });

    // Effect for success message timeout
    useEffect(() => {
        let timerId: NodeJS.Timeout;
        if (successMessage) {
            timerId = setTimeout(() => setSuccessMessage(null), 3000);
        }
        return () => clearTimeout(timerId); // Cleanup on unmount or if successMessage changes
    }, [successMessage]);
    const {flash} = usePage().props;
    console.log(flash)
    const handleStartActivity = (activityId: number) => {
        router.post(route('developer.activities.start', activityId), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Activity started successfully!');
            },
            onError: (errors) => {
                console.error('Error starting activity:', errors);
                const messages = typeof errors === 'object' && errors !== null
                    ? Object.values(errors).flat().join(' ')
                    : 'An unexpected error occurred.';
                setSuccessMessage(`Error: ${messages || 'Could not start activity.'}`);
            }
        });
    };

    const handleOpenCompleteModal = (activity: Activity) => {
        setDeletingActivityId(null);
        setCompletingActivityId(activity.id);
        setData('developer_notes', activity.developer_notes || ''); // Pre-fill notes if any
    };

    const submitCompleteActivity = (e: React.FormEvent) => {
        e.preventDefault();
        if (!completingActivityId) return;
        post(route('developer.activities.complete', completingActivityId), {
            onSuccess: () => {
                setCompletingActivityId(null);
                reset();
                setSuccessMessage('Activity completed successfully!');
            },
            onError: (errors) => {
                console.error('Error completing activity:', errors);
                const messages = typeof errors === 'object' && errors !== null
                    ? Object.values(errors).flat().join(' ')
                    : 'An unexpected error occurred.';
                setSuccessMessage(`Error: ${messages || 'Could not complete activity.'}`);
            },
            preserveScroll: true,
        });
    };
    const handleOpenDeleteConfirmation = (activityId: number) => {
        setCompletingActivityId(null); // Cierra el modal de completar si está abierto
        setDeletingActivityId(activityId);
    };

    const handleCancelDelete = () => {
        setDeletingActivityId(null);
    };

    const confirmDeleteActivity = (activityId: number) => {
        if (isDeletingOperation) return;
        setIsDeletingOperation(true);
        router.delete(route('developer.activities.destroy', activityId), { // Asegúrate que esta ruta exista
            preserveScroll: true,
            onSuccess: () => {
                setDeletingActivityId(null);
                setSuccessMessage('Actividad eliminada correctamente!');
            },
            onError: (errors) => {
                console.error('Error eliminando actividad:', errors);
                const messages = typeof errors === 'object' && errors !== null
                    ? Object.values(errors).flat().join(' ')
                    : 'Ocurrió un error inesperado.';
                setSuccessMessage(`Error: ${messages || 'No se pudo eliminar la actividad.'}`);
            },
            onFinish: () => {
                setIsDeletingOperation(false);
            }
        });
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}> {/* Using AppLayout */}
            {flash.success && <div className="m-4 p-3 bg-green-100 dark:bg-green-700 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-100 rounded-md">
                <svg className="inline-block w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11h-2v4h2V7zm0 6h-2v2h2v-2z" />
                </svg>
                <span className='font-medium'>{flash.success}</span>
            </div>}
            <Head title="Mis Actividades" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Mis Actividades
                    </h1>
                    <div className="flex space-x-3">
                        <Link href={route('developer.create')}>
                            {/* Usando un estilo de botón más genérico si Button de headlessui no tiene variantes directas o para consistencia */}
                            <button className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:border-indigo-700 focus:ring focus:ring-indigo-200 disabled:opacity-25 transition">
                                Crear Actividades
                            </button>
                        </Link>
                        <Link
                            href={route('developer.error-reports.create')}
                            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 disabled:opacity-25 transition"
                        >
                            Reportar Error
                        </Link>
                        <Link
                            href={route('developer.interruption-reports.create')}
                            className="inline-flex items-center px-4 py-2 bg-yellow-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-yellow-400 active:bg-yellow-600 focus:outline-none focus:border-yellow-600 focus:ring focus:ring-yellow-200 disabled:opacity-25 transition"
                        >
                            Registrar Interrupción
                        </Link>
                    </div>
                </div>
                {successMessage && (
                    <div className={`my-4 p-3 rounded-md border ${successMessage.startsWith('Error:') ? 'bg-red-100 dark:bg-red-700 border-red-400 dark:border-red-600 text-red-700 dark:text-red-100' : 'bg-green-100 dark:bg-green-700 border-green-400 dark:border-green-600 text-green-700 dark:text-green-100'}`}>
                        <p>{successMessage}</p>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        {activities.length > 0 ? (
                            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                                {activities.map((activity) => {
                                    const isCompletingThis = completingActivityId === activity.id;
                                    const isDeletingThis = deletingActivityId === activity.id;
                                    return (
                                        <li key={activity.id} className="py-6">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                                                        {activity.project_name}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                                        <span className="font-medium">Etapa:</span> {activity.stage}
                                                    </p>
                                                </div>
                                                <div className="mt-4 sm:mt-0 sm:ml-4">
                                                    <StatusBadge status={activity.status_display} />
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <p className="text-md text-gray-700 dark:text-gray-200">
                                                    {activity.description}
                                                </p>
                                                {activity.due_date && (
                                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                        Fecha Límite: {new Date(activity.due_date).toLocaleDateString()}
                                                    </p>
                                                )}
                                                {activity.started_at_formatted && (
                                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                        Iniciada: {activity.started_at_formatted}
                                                    </p>
                                                )}
                                                {activity.completed_at_formatted && (
                                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                        Completada: {activity.completed_at_formatted}
                                                    </p>
                                                )}
                                                {activity.status === 'completed' && activity.time_spent_formatted && (
                                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                        Tiempo Dedicado: {activity.time_spent_formatted}
                                                    </p>
                                                )}
                                                {activity.developer_notes && (
                                                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                                                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">Notas del Desarrollador:</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-pre-wrap">{activity.developer_notes}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-4 flex space-x-3">
                                                {activity.status === 'pending' && !isCompletingThis && !isDeletingThis && (
                                                    <button
                                                        onClick={() => handleStartActivity(activity.id)}
                                                        disabled={processing}
                                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                                    >
                                                        Iniciar Actividad
                                                    </button>
                                                )}
                                                {activity.status === 'in_progress' && !isCompletingThis && !isDeletingThis && (
                                                    <button
                                                        onClick={() => handleOpenCompleteModal(activity)}
                                                        disabled={processing}
                                                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                    >
                                                        Completar Actividad
                                                    </button>
                                                )}
                                                {/* Botón para Eliminar Actividad */}
                                                {(activity.status === 'pending' || activity.status === 'in_progress') && !isCompletingThis && !isDeletingThis && (
                                                    <button
                                                        onClick={() => handleOpenDeleteConfirmation(activity.id)}
                                                        disabled={processing || isDeletingOperation}
                                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                                    >
                                                        Eliminar Actividad
                                                    </button>
                                                )}
                                            </div>
                                            {isCompletingThis && (
                                                <form onSubmit={submitCompleteActivity} className="mt-4 p-4 border border-gray-300 dark:border-gray-600 rounded-md">
                                                    <label htmlFor={`developer_notes_${activity.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Notas Adicionales (opcional):
                                                    </label>
                                                    <textarea
                                                        id={`developer_notes_${activity.id}`}
                                                        name="developer_notes"
                                                        rows={3}
                                                        value={data.developer_notes}
                                                        onChange={(e) => setData('developer_notes', e.target.value)}
                                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-900 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                                    ></textarea>
                                                    {errors.developer_notes && <p className="mt-1 text-xs text-red-500">{errors.developer_notes}</p>}
                                                    <div className="mt-3 flex justify-end space-x-2">
                                                        <button type="button" onClick={() => setCompletingActivityId(null)} className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">Cancelar</button>
                                                        <button type="submit" disabled={processing} className="px-3 py-1.5 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50">Confirmar Completada</button>
                                                    </div>
                                                </form>
                                            )}
                                            {/* Sección de Confirmación de Eliminación */}
                                            {isDeletingThis && (
                                                <div className="mt-4 p-4 border border-red-300 dark:border-red-600 rounded-md bg-red-50 dark:bg-red-900/30">
                                                    <p className="text-sm font-medium text-red-700 dark:text-red-300">
                                                        ¿Estás seguro de que quieres eliminar esta actividad?
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                                        "{activity.description}" del proyecto "{activity.project_name}"
                                                    </p>
                                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                                        Esta acción no se puede deshacer.
                                                    </p>
                                                    <div className="mt-3 flex justify-end space-x-2">
                                                        <button type="button" onClick={handleCancelDelete} disabled={isDeletingOperation} className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">
                                                            Cancelar
                                                        </button>
                                                        <button type="button" onClick={() => confirmDeleteActivity(activity.id)} disabled={isDeletingOperation} className="px-3 py-1.5 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50">
                                                            Confirmar Eliminación
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                                No tienes actividades asignadas en este momento.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}