import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User as GlobalUser } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Project Management',
        href: route('project-manager.projects.manage'),
    },
    {
        title: 'Create Project',
        href: route('project-manager.projects.create'),
    },
];

interface PotentialLeader {
    id: number;
    name: string;
    lastname: string | null; // Add lastname
    email: string;
}

interface CreateProjectProps {
    potentialLeaders: PotentialLeader[];
    currentUserId: number;
}

export default function CreateProject({ potentialLeaders, currentUserId }: CreateProjectProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        leader_id: currentUserId.toString(), // Pre-select current user if they are a leader, or make it empty
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('project-manager.projects.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create New Project" />
            {/* Similar al contenedor principal de Coordinate.tsx */}
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Contenedor del formulario, estilizado como una tarjeta */}
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 md:p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
                        Create New Project Form
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
                            <textarea
                                id="description"
                                name="description"
                                value={data.description}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-24"
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div >

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="start_date">Estimated Start Date</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    name="start_date"
                                    value={data.start_date}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    onChange={(e) => setData('start_date', e.target.value)}
                                />
                                <InputError message={errors.start_date} className="mt-2" />
                            </div>
                            <div>
                                <Label htmlFor="end_date">Estimated End Date</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    name="end_date"
                                    value={data.end_date}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    onChange={(e) => setData('end_date', e.target.value)}
                                />
                                <InputError message={errors.end_date} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="leader_id">Assign Leader</Label>
                            <select
                                id="leader_id"
                                name="leader_id"
                                value={data.leader_id}
                                onChange={(e) => setData('leader_id', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                <option value="">Select a Leader (Optional)</option>
                                {potentialLeaders.map((leader) => (
                                    <option key={leader.id} value={leader.id.toString()}>
                                        @{leader.name} {leader.lastname} \{leader.email} {/* Display full name and email */}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.leader_id} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end">
                            <Button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm disabled:opacity-50" // Estilo similar a botones de acción
                                disabled={processing}>
                                Create Project
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}