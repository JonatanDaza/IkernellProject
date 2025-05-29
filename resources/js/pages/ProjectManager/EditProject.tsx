import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Textarea } from '@headlessui/react';

interface SimpleUser {
    id: number;
    name: string;
    lastname?: string | null;
    email?: string; // Email es opcional aquí si solo se usa para mostrar
}

type ProjectStatus = 'active' | 'inactive' | 'finished'; // Consistent with ManageProjects

interface ProjectData {
    id: number;
    name: string;
    description: string | null;
    status: ProjectStatus | string; // Use the defined type
    start_date: string | null;
    end_date: string | null;
    leader_id: number | null;
    leader?: SimpleUser | null;
}

interface EditProjectProps {
    project: ProjectData;
    potentialLeaders: SimpleUser[];
    projectStatusList: ProjectStatus[]; // Use the defined type
    currentUserId: number; // Podría no ser necesario aquí, pero se pasa por consistencia
}

export default function EditProject({ project, potentialLeaders, projectStatusList }: EditProjectProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: project.name || '',
        description: project.description || '',
        status: project.status || (projectStatusList.length > 0 ? projectStatusList[0] : 'active'),
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        leader_id: project.leader_id?.toString() || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Project Management',
            href: route('project-manager.projects.manage'),
        },
        {
            title: `Edit: ${project.name}`,
            href: route('project-manager.projects.edit', project.id),
        },
    ];

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('project-manager.projects.update', project.id), {
            // onSuccess: () => reset(), // Podrías no querer resetear en la edición
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Project: ${project.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 md:p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
                        Edit Project: <span className="text-blue-600 dark:text-blue-400">{project.name}</span>
                    </h2>
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <Label htmlFor="name">Project Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description" // Changed from Textarea to textarea
                                name="description"
                                value={data.description}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-24"
                                onChange={(e: { target: { value: string; }; }) => setData('description', e.target.value)}
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                name="status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                {(Array.isArray(projectStatusList) ? projectStatusList : []).map((statusVal) => (
                                    <option key={statusVal} value={statusVal} className="capitalize">{statusVal}</option>
                                ))}
                            </select>
                            <InputError message={errors.status} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="start_date">Estimated Start Date</Label>
                                <Input id="start_date" type="date" name="start_date" value={data.start_date || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" onChange={(e) => setData('start_date', e.target.value)} />
                                <InputError message={errors.start_date} className="mt-2" />
                            </div>
                            <div>
                                <Label htmlFor="end_date">Estimated End Date</Label>
                                <Input id="end_date" type="date" name="end_date" value={data.end_date || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" onChange={(e) => setData('end_date', e.target.value)} />
                                <InputError message={errors.end_date} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="leader_id">Assign Leader</Label>
                            <select
                                id="leader_id"
                                name="leader_id"
                                value={data.leader_id || ''}
                                onChange={(e) => setData('leader_id', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                <option value="">Select a Leader (Optional)</option>
                                {(Array.isArray(potentialLeaders) ? potentialLeaders : []).map((leader) => (
                                    <option key={leader.id} value={leader.id.toString()}>
                                        {leader.name} {leader.lastname || ''}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.leader_id} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end space-x-4">
                            <Link href={route('project-manager.projects.manage')} className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
                                Cancel
                            </Link>
                            <Button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-sm disabled:opacity-50" disabled={processing}>
                                Update Project
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}