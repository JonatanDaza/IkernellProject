import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout'; // Ajusta la ruta a tu AppLayout
import { type BreadcrumbItem } from '@/types'; // Ajusta la ruta a tus tipos

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Registrar Interrupción', href: route('developer.interruption-reports.create') }
];

interface InterruptionReportFormData {
    interruption_type: 'problema_tecnico' | 'reunion' | 'solicitud_externa' | 'personal' | 'otro' | '';
    interruption_type_other: string;
    date: string;
    estimated_duration: string;
    affected_project_phase: 'planificacion' | 'desarrollo' | 'pruebas' | 'despliegue' | 'otro' | '';
    affected_project_phase_other: string;
    description: string;
    [key: string]: any; // Añade esta firma de índice para satisfacer FormDataType
}

export default function CreateInterruptionReport({ flash }: { flash?: { success?: string, error?: string } }) {
    const { data, setData, post, processing, errors, reset } = useForm<InterruptionReportFormData>({
        interruption_type: '',
        interruption_type_other: '',
        date: new Date().toISOString().split('T')[0], // Default to today
        estimated_duration: '',
        affected_project_phase: '',
        affected_project_phase_other: '',
        description: '',
    });

    const [showInterruptionTypeOther, setShowInterruptionTypeOther] = useState(false);
    const [showAffectedPhaseOther, setShowAffectedPhaseOther] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('developer.interruption-reports.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, field: keyof InterruptionReportFormData, setShowOther: (value: boolean) => void) => {
        const { value } = e.target;
        setData(field, value as InterruptionReportFormData[typeof field]);
        if (value === 'otro') {
            setShowOther(true);
        } else {
            setShowOther(false);
            if (field === 'interruption_type') setData('interruption_type_other', '');
            if (field === 'affected_project_phase') setData('affected_project_phase_other', '');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Registrar Interrupción"/>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        Registrar Nueva Interrupción
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
                        <div>
                            <label htmlFor="interruption_type"
                                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Tipo de Interrupción
                            </label>
                            <select
                                id="interruption_type"
                                name="interruption_type"
                                value={data.interruption_type}
                                onChange={(e) => handleSelectChange(e, 'interruption_type', setShowInterruptionTypeOther)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                            >
                                <option value="">Seleccione un tipo</option>
                                <option value="problema_tecnico">Problema Técnico</option>
                                <option value="reunion">Reunión</option>
                                <option value="solicitud_externa">Solicitud Externa</option>
                                <option value="personal">Personal</option>
                                <option value="otro">Otro</option>
                            </select>
                            {errors.interruption_type && <p
                                className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.interruption_type}</p>}
                        </div>

                        <div>
                            {showInterruptionTypeOther && (
                                <div>
                                    <label htmlFor="interruption_type_other"
                                           className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Especificar Otro Tipo de Interrupción
                                    </label>
                                    <input
                                        type="text"
                                        name="interruption_type_other"
                                        id="interruption_type_other"
                                        value={data.interruption_type_other}
                                        onChange={e => setData('interruption_type_other', e.target.value)}
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.interruption_type_other && <p
                                        className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.interruption_type_other}</p>}
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="date"
                                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
                            <input
                                type="date"
                                name="date"
                                id="date"
                                value={data.date}
                                onChange={e => setData('date', e.target.value)}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.date && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.date}</p>}
                        </div>

                        <div>
                            <label htmlFor="estimated_duration"
                                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Duración Estimada
                            </label>
                            <input
                                type="text"
                                name="estimated_duration"
                                id="estimated_duration"
                                value={data.estimated_duration}
                                onChange={e => setData('estimated_duration', e.target.value)}
                                placeholder="Ej: 30 minutos, 1 hora"
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.estimated_duration && <p
                                className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.estimated_duration}</p>}
                        </div>

                        <div>
                            <label htmlFor="affected_project_phase"
                                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Fase del Proyecto Afectada
                            </label>
                            <select
                                id="affected_project_phase"
                                name="affected_project_phase"
                                value={data.affected_project_phase}
                                onChange={(e) => handleSelectChange(e, 'affected_project_phase', setShowAffectedPhaseOther)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                            >
                                <option value="">Seleccione una fase</option>
                                <option value="planificacion">Planificación</option>
                                <option value="desarrollo">Desarrollo</option>
                                <option value="pruebas">Pruebas</option>
                                <option value="despliegue">Despliegue</option>
                                <option value="otro">Otro</option>
                            </select>
                            {errors.affected_project_phase && <p
                                className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.affected_project_phase}</p>}
                        </div>

                        <div>
                            {showAffectedPhaseOther && (
                                <div>
                                    <label htmlFor="affected_project_phase_other"
                                           className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Especificar Otra Fase Afectada
                                    </label>
                                    <input
                                        type="text"
                                        name="affected_project_phase_other"
                                        id="affected_project_phase_other"
                                        value={data.affected_project_phase_other}
                                        onChange={e => setData('affected_project_phase_other', e.target.value)}
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.affected_project_phase_other && <p
                                        className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.affected_project_phase_other}</p>}
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="description"
                                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Descripción Adicional (Opcional)
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            ></textarea>
                            {errors.description &&
                                <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.description}</p>}
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
                                {processing ? 'Enviando...' : 'Registrar Interrupción'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}