import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react'; // Link para el botón de crear, router para acciones
import React, { useState, type FormEvent, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input'; // Asumiendo que tienes estos componentes UI
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

// Define tipos para los datos que vienen del backend
interface SimpleUser { // Para la lista de líderes
    id: number;
    name: string;
    lastname?: string | null; // Asumiendo que el apellido puede venir
}
type ProjectStatus = 'active' | 'inactive' | 'finished';

interface Project {
    id: number;
    name: string;
    description: string | null;
    status: ProjectStatus | string; // More specific status, fallback to string
    start_date: string | null; // YYYY-MM-DD
    end_date: string | null;   // YYYY-MM-DD
    leader_id: number | null;
    leader?: SimpleUser | null; // Detalles del líder (opcional, si se carga con eager loading)
}

// Props que el componente espera de Laravel/Inertia
interface ManageProjectsProps {
    initialProjects: Project[];
    potentialLeaders: SimpleUser[]; // Lista de usuarios que son líderes
    projectStatusList: ProjectStatus[]; 
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Project Management',
        href: route('project-manager.projects.manage'),
    },
];

export default function ManageProjects({
    initialProjects = [],
    potentialLeaders = [],
    projectStatusList = ['active', 'inactive', 'finished'] as ProjectStatus[], // Ensure default matches the type
}: ManageProjectsProps) {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [searchTerm, setSearchTerm] = useState(''); // Para buscar por nombre de proyecto
    const [selectedStatus, setSelectedStatus] = useState<string>(''); // Para filtrar por estado del proyecto
    const [selectedLeader, setSelectedLeader] = useState<string>(''); // ID del líder seleccionado
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success/error messages

    useEffect(() => {
        setProjects(Array.isArray(initialProjects) ? initialProjects : []);
    }, [initialProjects]);

    // Effect for success message timeout
    useEffect(() => {
        let timerId: NodeJS.Timeout;
        if (successMessage) {
            timerId = setTimeout(() => setSuccessMessage(null), 3000);
        }
        return () => clearTimeout(timerId); // Cleanup on unmount or if successMessage changes
    }, [successMessage]);

    const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // El filtrado es instantáneo a través de useMemo
    };

    const filteredProjects = useMemo(() => {
        if (!Array.isArray(projects)) {
            return [];
        }
        return projects.filter((project) => {
            const matchesSearchTerm =
                !searchTerm || (typeof project.name === 'string' && project.name.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesStatus =
                !selectedStatus || project.status === selectedStatus;

            const matchesLeader =
                !selectedLeader || (project.leader_id && project.leader_id.toString() === selectedLeader);

            const isValidDate = (d: any): d is Date => d instanceof Date && !isNaN(d.getTime());

            const pStartDate = project.start_date && typeof project.start_date === 'string' ? new Date(project.start_date) : null;
            const pEndDate = project.end_date && typeof project.end_date === 'string' ? new Date(project.end_date) : null;
            const fStartDate = filterStartDate && typeof filterStartDate === 'string' ? new Date(filterStartDate) : null;
            const fEndDate = filterEndDate && typeof filterEndDate === 'string' ? new Date(filterEndDate) : null;

            let matchesDateRange = true;
            if (isValidDate(fStartDate) && isValidDate(pEndDate)) {
                if (pEndDate < fStartDate) matchesDateRange = false;
            }
            if (isValidDate(fEndDate) && isValidDate(pStartDate)) {
                if (pStartDate && pStartDate > fEndDate) matchesDateRange = false;
            }

            return matchesSearchTerm && matchesStatus && matchesLeader && matchesDateRange;
        });
    }, [projects, searchTerm, selectedStatus, selectedLeader, filterStartDate, filterEndDate]);

    const handleSetProjectStatus = (projectId: number, currentStatus: Project['status']) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        if (!confirm(`Are you sure you want to set project ${projectId} to "${newStatus}"?`)) {
            return;
        }

        router.put(route('project-manager.projects.update-status', projectId),
            { status: newStatus },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSuccessMessage(`Project status updated to "${newStatus}".`);
                    // Rely on Inertia prop refresh to update the projects list
                    // For simplicity, we'll rely on Inertia refreshing initialProjects
                },
                onError: (errors) => {
                    console.error('Error updating project status:', errors);
                    const messages = typeof errors === 'object' && errors !== null
                        ? Object.values(errors).flat().join(' ')
                        : 'An unexpected error occurred.';
                    // Use setSuccessMessage to display errors for consistency, or a dedicated error state
                    setSuccessMessage(`Error: ${messages || 'Could not update project status.'}`);
                }
            }
        );
    };



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Projects" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Projects Overview
                    </h1>
                    <Link href={route('project-manager.projects.create')}>
                        <Button >Create New Project</Button> 
                        {/* Consider using a variant if available, e.g., <Button variant="default"> or <Button variant="primary"> */}
                    </Link>
                </div>

                {/* Filter Section */}
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Filter Projects</h2>
                    <form onSubmit={handleSearchSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Input
                                type="text"
                                placeholder="Search by Project Name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                <option value="">All Statuses</option>
                                {(Array.isArray(projectStatusList) ? projectStatusList : []).map((status) => (
                                    <option key={status} value={status} className="capitalize">{status}</option>
                                ))}
                            </select>
                            <select
                                value={selectedLeader}
                                onChange={(e) => setSelectedLeader(e.target.value)}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                <option value="">All Leaders</option>
                                {(Array.isArray(potentialLeaders) ? potentialLeaders : []).map((leader) => (
                                    <option key={leader.id} value={leader.id.toString()}>{leader.name} {leader.lastname || ''}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="filter_start_date" className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date From:</Label>
                                <Input id="filter_start_date" type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} className="mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"/>
                            </div>
                            <div>
                                <Label htmlFor="filter_end_date" className="text-sm font-medium text-gray-700 dark:text-gray-300">End Date To:</Label>
                                <Input id="filter_end_date" type="date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} className="mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"/>
                            </div>
                        </div>
                        {/* <Button type="submit" className="mt-4">Apply Filters</Button> */}
                    </form>
                </div>

                {successMessage && (
                    <div className={`my-4 p-3 rounded-md border ${successMessage.startsWith('Error:') ? 'bg-red-100 dark:bg-red-700 border-red-400 dark:border-red-600 text-red-700 dark:text-red-100' : 'bg-green-100 dark:bg-green-700 border-green-400 dark:border-green-600 text-green-700 dark:text-green-100'}`}>
                        <p>{successMessage}</p>
                    </div>
                )}
                {/* Projects Display Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map((project) => (
                            <div key={project.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-sidebar-border/70 dark:border-sidebar-border flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{project.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 h-20 overflow-y-auto">{project.description || 'No description.'}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-300">Status: <span className="font-medium capitalize">{project.status}</span></p>
                                    <p className="text-xs text-gray-500 dark:text-gray-300">Leader: {project.leader ? `${project.leader.name} ${project.leader.lastname || ''}` : 'N/A'}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-300">Dates: {project.start_date || 'N/A'} to {project.end_date || 'N/A'}</p>
                                </div>
                                <div className="mt-4 flex justify-end flex-wrap gap-2"> {/* Added flex-wrap and changed space-x-2 to gap-2 */}
                                    {project.status !== 'finished' && (
                                        <Button
                                            variant={project.status === 'active' ? 'destructive_outline' : 'default_outline'}
                                            size="sm"
                                            onClick={() => handleSetProjectStatus(project.id, project.status)}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm disabled:opacity-50"
                                        >
                                            {project.status === 'active' ? 'Set Inactive' : 'Set Active'}
                                        </Button>
                                    )}
                                    <Link href={route('project-manager.projects.team.manage', project.id)}>
                                        <Button variant="outline" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm disabled:opacity-50" size="sm">Manage Team</Button>
                                    </Link>
                                    <Link href={route('project-manager.projects.edit', project.id)}>
                                        <Button variant="outline" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm disabled:opacity-50" size="sm">Edit Project</Button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="md:col-span-full text-center text-gray-500 dark:text-gray-400 py-8">
                            No projects match the current filters or no projects available.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}