import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react'; // Assuming Link might be used for project details
import React, { useState, type FormEvent, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input'; // Assuming you have these UI components
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

// Define types for data coming from the backend
interface User { // Simplified User for leader context
    id: number;
    name: string;
}

interface Project {
    id: number;
    name: string;
    description: string | null;
    status: 'active' | 'inactive' | 'finished' | string; // Project status
    start_date: string | null; // YYYY-MM-DD
    end_date: string | null;   // YYYY-MM-DD
    leader_id: number | null;
    leader?: User | null; // Optional: Eager load leader details
    // users: User[]; // Users assigned to this project - can be added if needed for display
}

// Props that the component expects from Laravel/Inertia
interface ManageProjectsByLeaderProps {
    initialProjects: Project[];
    potentialLeaders: User[]; // List of users who are leaders
    projectStatusList: string[]; // e.g., ['active', 'inactive', 'finished']
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Project Management (Leader)',
        href: route('project-manager.projects.manage'),
    },
];


export default function ManageProjectsByLeader({
    initialProjects = [],
    potentialLeaders = [],
    projectStatusList = ['active', 'inactive', 'finished'], // Default or from backend
}: ManageProjectsByLeaderProps) {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedLeader, setSelectedLeader] = useState<string>(''); // Store leader ID as string for select
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // For potential future actions

    useEffect(() => {
        // Robustly set projects state, ensuring it's always an array.
        // This prevents errors if initialProjects is unexpectedly not an array.
        setProjects(Array.isArray(initialProjects) ? initialProjects : []);
    }, [initialProjects]);

    // Effect for success message timeout (if you add actions later)
    useEffect(() => {
        let timerId: NodeJS.Timeout;
        if (successMessage) {
            timerId = setTimeout(() => setSuccessMessage(null), 3000);
        }
        return () => clearTimeout(timerId);
    }, [successMessage]);

    const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Filtering is instant via useMemo, this can be for explicit backend search if needed
        console.log('Applying filters...');
    };

    const filteredProjects = useMemo(() => {
        // Defensive check: Ensure 'projects' is an array before attempting to filter.
        if (!Array.isArray(projects)) {
            return [];
        }
        return projects.filter((project) => {
            // Defensive check for project.name before calling toLowerCase()
            const matchesSearchTerm =
                !searchTerm || (typeof project.name === 'string' && project.name.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesStatus =
                !selectedStatus || project.status === selectedStatus;

            const matchesLeader =
                !selectedLeader || (project.leader_id && project.leader_id.toString() === selectedLeader);

            const isValidDate = (d: any): d is Date => d instanceof Date && !isNaN(d.getTime());

            // Ensure date strings are valid before creating Date objects
            const pStartDate = project.start_date && typeof project.start_date === 'string' ? new Date(project.start_date) : null;
            const pEndDate = project.end_date && typeof project.end_date === 'string' ? new Date(project.end_date) : null;
            const fStartDate = filterStartDate && typeof filterStartDate === 'string' ? new Date(filterStartDate) : null;
            const fEndDate = filterEndDate && typeof filterEndDate === 'string' ? new Date(filterEndDate) : null;

            let matchesDateRange = true;
            // Apply date range filters only if all relevant dates are valid Date objects
            if (isValidDate(fStartDate) && isValidDate(pEndDate)) {
                if (pEndDate < fStartDate) {
                    matchesDateRange = false; // Project ends before filter start
                }
            }
            if (isValidDate(fEndDate) && isValidDate(pStartDate)) {
                // Check if pStartDate is not null before comparison
                if (pStartDate && pStartDate > fEndDate) {
                    matchesDateRange = false; // Project starts after filter end
                }
            }
            return matchesSearchTerm && matchesStatus && matchesLeader && matchesDateRange;
        });
    }, [projects, searchTerm, selectedStatus, selectedLeader, filterStartDate, filterEndDate]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Projects" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
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
                                className="px-3 py-2"
                            />
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                <option value="">All Statuses</option>
                                {/* Defensive check for projectStatusList before mapping */}
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
                                {/* Defensive check for potentialLeaders before mapping */}
                                {(Array.isArray(potentialLeaders) ? potentialLeaders : []).map((leader) => (
                                    <option key={leader.id} value={leader.id.toString()}>{leader.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="filter_start_date">Start Date From:</Label>
                                <Input id="filter_start_date" type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} className="mt-1"/>
                            </div>
                            <div>
                                <Label htmlFor="filter_end_date">End Date To:</Label>
                                <Input id="filter_end_date" type="date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} className="mt-1"/>
                            </div>
                        </div>
                        {/* <Button type="submit">Apply Filters</Button> */} {/* Optional: if you want explicit apply */}
                    </form>
                </div>

                {/* Projects Display Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map((project) => (
                            <div key={project.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-sidebar-border/70 dark:border-sidebar-border">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{project.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 h-16 overflow-y-auto">{project.description || 'No description.'}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-300">Status: <span className="font-medium capitalize">{project.status}</span></p>
                                <p className="text-xs text-gray-500 dark:text-gray-300">Leader: {project.leader && project.leader.name ? project.leader.name : 'N/A'}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-300">Dates: {project.start_date || 'N/A'} to {project.end_date || 'N/A'}</p>
                                {/* Add link to project details or manage users within project if needed */}
                                {/* <Link href={route('project-manager.projects.show', project.id)} className="text-sm text-blue-600 hover:underline mt-2 inline-block">View Details</Link> */}
                            </div>
                        ))
                    ) : (
                        <p className="md:col-span-2 lg:col-span-3 text-center text-gray-500 dark:text-gray-400 py-8">
                            No projects match the current filters.
                        </p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
