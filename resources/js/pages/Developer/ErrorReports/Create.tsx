import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Reportar Error', href: route('developer.error-reports.create') }
];

interface Project {
    id: number;
    name: string;
}

interface ErrorReportFormData {
    project_id: string;
    error_type: 'funcional' | 'rendimiento' | 'seguridad' | 'otro' | '';
    error_type_other: string;
    description: string;
    project_phase: 'desarrollo' | 'pruebas' | 'produccion' | 'otro' | '';
    project_phase_other: string;
    severity: 'critica' | 'alta' | 'media' | 'baja' | '';
    [key: string]: any;
}

interface Props {
    projects: Project[];
    flash?: { success?: string, error?: string };
}

export default function CreateErrorReport({ projects = [], flash }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<ErrorReportFormData>({
        project_id: '',
        error_type: '',
        error_type_other: '',
        description: '',
        project_phase: '',
        project_phase_other: '',
        severity: '',
    });

    const [showErrorTypeOther, setShowErrorTypeOther] = useState(false);
    const [showProjectPhaseOther, setShowProjectPhaseOther] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('developer.error-reports.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleSelectChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
        field: keyof ErrorReportFormData,
        setShowOther: (value: boolean) => void
    ) => {
        const { value } = e.target;
        setData(field, value as ErrorReportFormData[typeof field]);
        if (value === 'otro') {
            setShowOther(true);
        } else {
            setShowOther(false);
            if (field === 'error_type') setData('error_type_other', '');
            if (field === 'project_phase') setData('project_phase_other', '');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reportar Error"/>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        Reportar Nuevo Error
                    </h1>

                    {flash?.success && (
                        <div
                            className="mb-6 p-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-300"
                            role="alert">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div
                            className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300"
                            role="alert">
                            {flash.error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Proyecto */}
                        <div>
                            <label htmlFor="project_id"
                                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Proyecto
                            </label>
                            <select
                                id="project_id"
                                name="project_id"
                                value={data.project_id}
                                onChange={e => setData('project_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:ring-2 pl-3 pr-10 py-2 text-base dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm"
                                required
                            >
                                <option value="">Seleccionar el proyecto relacionado</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                            {errors.project_id && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.project_id}</p>}
                        </div>

                        <div>
                            <label htmlFor="error_type"
                                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Tipo de Error
                            </label>
                            <select
                                id="error_type"
                                name="error_type"
                                value={data.error_type}
                                onChange={(e) => handleSelectChange(e, 'error_type', setShowErrorTypeOther)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                            >
                                <option value="">Seleccione un tipo</option>
                                <option value="funcional">Funcional</option>
                                <option value="rendimiento">De Rendimiento</option>
                                <option value="seguridad">De Seguridad</option>
                                <option value="otro">Otro</option>
                            </select>
                            {errors.error_type &&
                                <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.error_type}</p>}
                        </div>

                        <div>
                            {showErrorTypeOther && (
                                <div>
                                    <label htmlFor="error_type_other"
                                           className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Especificar Otro Tipo de Error
                                    </label>
                                    <input
                                        type="text"
                                        name="error_type_other"
                                        id="error_type_other"
                                        value={data.error_type_other}
                                        onChange={e => setData('error_type_other', e.target.value)}
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.error_type_other && <p
                                        className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.error_type_other}</p>}
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="description"
                                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Descripción Detallada
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            ></textarea>
                            {errors.description &&
                                <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.description}</p>}
                        </div>

                        <div>
                            <label htmlFor="project_phase"
                                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Fase del Proyecto
                            </label>
                            <select
                                id="project_phase"
                                name="project_phase"
                                value={data.project_phase}
                                onChange={(e) => handleSelectChange(e, 'project_phase', setShowProjectPhaseOther)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                            >
                                <option value="">Seleccione una fase</option>
                                <option value="desarrollo">Desarrollo</option>
                                <option value="pruebas">Pruebas</option>
                                <option value="produccion">Producción</option>
                                <option value="otro">Otro</option>
                            </select>
                            {errors.project_phase &&
                                <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.project_phase}</p>}
                        </div>

                        <div>
                            {showProjectPhaseOther && (
                                <div>
                                    <label htmlFor="project_phase_other"
                                           className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Especificar Otra Fase del Proyecto
                                    </label>
                                    <input
                                        type="text"
                                        name="project_phase_other"
                                        id="project_phase_other"
                                        value={data.project_phase_other}
                                        onChange={e => setData('project_phase_other', e.target.value)}
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.project_phase_other && <p
                                        className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.project_phase_other}</p>}
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="severity"
                                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Severidad
                            </label>
                            <select
                                id="severity"
                                name="severity"
                                value={data.severity}
                                onChange={e => setData('severity', e.target.value as ErrorReportFormData['severity'])}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                            >
                                <option value="">Seleccione la severidad</option>
                                <option value="critica">Crítica</option>
                                <option value="alta">Alta</option>
                                <option value="media">Media</option>
                                <option value="baja">Baja</option>
                            </select>
                            {errors.severity &&
                                <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.severity}</p>}
                        </div>

                        <div className="pt-2 flex justify-end space-x-3">
                            <Link
                                href={route('developer.activities')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {processing ? 'Enviando...' : 'Enviar Reporte'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}