import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Assuming you have a Select component

interface SimpleUser {
    id: number;
    name: string;
    lastname?: string | null;
    email?: string;
    specialty?: string | null;
}

interface AssignedUser extends SimpleUser {
    pivot: {
        project_id: number;
        user_id: number;
        is_active_in_project: boolean;
    };
    role?: string; // Global role, if needed
}

interface ProjectData {
    id: number;
    name: string;
    description: string | null;
    // other project fields if needed
}

interface ManageProjectTeamProps {
    project: ProjectData;
    assignedUsers: AssignedUser[]; // Users currently assigned to this project
    availableDevelopers: SimpleUser[]; // Developers available to be added
}

export default function ManageProjectTeam({ project, assignedUsers: initialAssignedUsers, availableDevelopers }: ManageProjectTeamProps) {
    const [assignedUsers, setAssignedUsers] = useState<AssignedUser[]>(Array.isArray(initialAssignedUsers) ? initialAssignedUsers : []);
    const [selectedDeveloperToAdd, setSelectedDeveloperToAdd] = useState<string>(''); // Store ID as string
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        setAssignedUsers(Array.isArray(initialAssignedUsers) ? initialAssignedUsers : []);
    }, [initialAssignedUsers]);

    useEffect(() => {
        let timerId: NodeJS.Timeout;
        if (successMessage) {
            timerId = setTimeout(() => setSuccessMessage(null), 3000);
        }
        return () => clearTimeout(timerId);
    }, [successMessage]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Project Management',
            href: route('project-manager.projects.manage'),
        },
        {
            title: project.name, // Or a link to project details if you have one
            href: '#', // Placeholder, could be project details page
        },
        {
            title: 'Manage Team',
            href: route('project-manager.projects.team.manage', project.id),
        },
    ];

    const handleAddDeveloper = () => {
        if (!selectedDeveloperToAdd) {
            alert('Please select a developer to add.');
            return;
        }
        router.post(route('project-manager.projects.users.link', { project: project.id }), {
            user_id: Number(selectedDeveloperToAdd)
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Developer added to project successfully.');
                setSelectedDeveloperToAdd('');
                // Inertia will refresh props, updating assignedUsers and availableDevelopers
            },
            onError: (errors) => {
                const messages = typeof errors === 'object' && errors !== null ? Object.values(errors).flat().join(' ') : 'An unexpected error occurred.';
                setSuccessMessage(`Error adding developer: ${messages || 'Please try again.'}`);
            }
        });
    };

    const handleRemoveDeveloper = (userId: number) => {
        if (!confirm(`Are you sure you want to remove this developer from the project?`)) {
            return;
        }
        router.delete(route('project-manager.projects.users.unlink', { project: project.id, user: userId }), {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Developer removed from project successfully.');
                // Inertia will refresh props
            },
            onError: (errors) => {
                const messages = typeof errors === 'object' && errors !== null ? Object.values(errors).flat().join(' ') : 'An unexpected error occurred.';
                setSuccessMessage(`Error removing developer: ${messages || 'Please try again.'}`);
            }
        });
    };

    const handleToggleDeveloperStatus = (userId: number, isActive: boolean) => {
        router.put(route('project-manager.projects.users.toggle-status', { project: project.id, user: userId }),
            { is_active_in_project: isActive },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSuccessMessage(`Developer status updated in project.`);
                },
                onError: (errors) => {
                    const messages = typeof errors === 'object' && errors !== null ? Object.values(errors).flat().join(' ') : 'An unexpected error occurred.';
                    setSuccessMessage(`Error updating status: ${messages || 'Please try again.'}`);
                }
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Manage Team for ${project.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Manage Team for: <span className="text-blue-600 dark:text-blue-400">{project.name}</span>
                </h1>
                {project.description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>}

                {successMessage && (
                    <div className={`my-4 p-3 rounded-md border ${successMessage.startsWith('Error') ? 'bg-red-100 dark:bg-red-700 border-red-400 dark:border-red-600 text-red-700 dark:text-red-100' : 'bg-green-100 dark:bg-green-700 border-green-400 dark:border-green-600 text-green-700 dark:text-green-100'}`}>
                        <p>{successMessage}</p>
                    </div>
                )}

                {/* Add Developer Section */}
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Add Developer to Project</h2>
                    <div className="flex items-end space-x-3">
                        <div className="flex-grow">
                            <Label htmlFor="developer_to_add" className="text-sm font-medium text-gray-700 dark:text-gray-300">Available Developers</Label>
                            {/* Using Shadcn/ui Select component - replace with standard HTML select if needed */}
                            <Select value={selectedDeveloperToAdd} onValueChange={setSelectedDeveloperToAdd}>
                                <SelectTrigger className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                    <SelectValue placeholder="Select a developer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(Array.isArray(availableDevelopers) && availableDevelopers.length > 0) ? availableDevelopers.map((dev) => (
                                        <SelectItem key={dev.id} value={dev.id.toString()}>
                                            {dev.name} {dev.lastname || ''} ({dev.email}) - {dev.specialty || 'N/A'}
                                        </SelectItem>
                                    )) : <SelectItem value="no_devs" disabled>No developers available</SelectItem>}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleAddDeveloper} disabled={!selectedDeveloperToAdd} className="bg-green-600 hover:bg-green-700">Add to Project</Button>
                    </div>
                </div>

                {/* Assigned Developers Table */}
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-sidebar-border/70 dark:border-sidebar-border overflow-hidden">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 p-4 border-b dark:border-gray-700">Assigned Developers</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Specialty</th>
                                    <th scope="col" className="px-6 py-3">Status in Project</th>
                                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignedUsers.length > 0 ? assignedUsers.map((user) => (
                                    <tr key={user.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{user.name} {user.lastname || ''}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4 capitalize">{user.specialty || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.pivot.is_active_in_project ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'}`}>
                                                {user.pivot.is_active_in_project ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center space-x-2 whitespace-nowrap">
                                            <Button variant={user.pivot.is_active_in_project ? "destructive_outline" : "default_outline"} size="sm" onClick={() => handleToggleDeveloperStatus(user.id, !user.pivot.is_active_in_project)}>
                                                {user.pivot.is_active_in_project ? 'Deactivate' : 'Activate'}
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleRemoveDeveloper(user.id)}>Remove</Button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No developers assigned to this project.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}