import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

interface ProjectOption {
    id: number;
    name: string;
}

interface InterruptionReportFormProps {
    projects: ProjectOption[];
    flash?: { success?: string; error?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Reporte de Interrupciones', href: route('reports.interruption.form') }
];

export default function InterruptionReportForm({ projects, flash }: InterruptionReportFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        project_id: projects.length > 0 ? projects[0].id : '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Esta ruta ahora espera un POST para generar y mostrar el reporte
        post(route('reports.interruption.generate'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Seleccionar Proyecto para Reporte de Interrupciones"/>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        Generar Reporte de Interrupciones
                    </h1>

                    {flash?.error && (
                        <div
                            className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300"
                            role="alert">
                            {flash.error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="project_id"
                                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Seleccionar Proyecto
                            </label>
                            <select
                                id="project_id"
                                name="project_id"
                                value={data.project_id}
                                onChange={(e) => setData('project_id', e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                            >
                                {projects.length === 0 && <option value="">No hay proyectos disponibles</option>}
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                            {errors.project_id &&
                                <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.project_id}</p>}
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing || projects.length === 0}
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {processing ? 'Generando...' : 'Generar Reporte'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
