import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
}
interface Interruption {
    id: number;
    interruption_type: string;
    interruption_type_other?: string;
    date: string;
    estimated_duration: string;
    affected_project_phase: string;
    affected_project_phase_other?: string;
    description?: string;
    user: User; // Desarrollador que reportó
    created_at: string;
}

interface Project {
    id: number;
    name: string;
}

interface ShowInterruptionReportProps {
    project: Project;
    interruptions: Interruption[];
}

const breadcrumbs: (project: Project) => BreadcrumbItem[] = (project) => [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Reporte de Interrupciones', href: route('reports.interruption.form') },
    { title: project.name, href: '#' } // O enlace a la página del proyecto si existe
];


export default function ShowInterruptionReport({ project, interruptions }: ShowInterruptionReportProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(project)}>
            <Head title={`Reporte de Interrupciones - ${project.name}`}/>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 sm:p-8">
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            Reporte de Interrupciones: {project.name}
                        </h1>
                        <Link href={route('reports.interruption.form')} className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200">
                            &larr; Volver a seleccionar proyecto
                        </Link>
                    </div>


                    {interruptions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Tipo
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Duración
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Fase Afectada
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Reportado por
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Descripción
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {interruptions.map((interruption) => (
                                    <tr key={interruption.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                            {new Date(interruption.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            {interruption.interruption_type === 'otro' ? interruption.interruption_type_other : interruption.interruption_type.replace('_', ' ')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            {interruption.estimated_duration}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            {interruption.affected_project_phase === 'otro' ? interruption.affected_project_phase_other : interruption.affected_project_phase.replace('_', ' ')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            {interruption.user.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate hover:whitespace-normal hover:overflow-visible" title={interruption.description}>
                                            {interruption.description || '-'}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                            No hay interrupciones registradas para este proyecto.
                        </p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
