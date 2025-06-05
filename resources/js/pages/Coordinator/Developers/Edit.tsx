import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Head, useForm, router, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button'; // Assuming you have this Button component
import { Input } from '@/components/ui/input'; // Assuming you have this Input component
import { Label } from '@/components/ui/label'; // Assuming you have this Label component
import InputError from '@/components/input-error'; // Assuming you have this InputError component
import { Textarea } from '@headlessui/react'; // Ensure this Textarea is styled or replaced

interface Developer {
    id: number;
    name: string;
    lastname: string;
    email: string;
    identification_number?: string | null;
    address?: string | null;
    profession?: string | null;
    specialty: string;
    worker_type: string;
    profile_photo_url?: string | null;
    is_active: boolean;
}

interface EditDeveloperProps {
    developer: Developer;
    specialtyList: string[];
    workerTypeList: string[];
    errors: Record<string, string>;
}

type EditDeveloperFormData = {
    _method: string;
    name: string;
    lastname: string;
    email: string;
    identification_number?: string | null;
    address?: string | null;
    profession?: string | null;
    specialty: string;
    worker_type: string;
    profile_photo: File | null;
    is_active: boolean;
};

export default function EditDeveloper({ developer, specialtyList, workerTypeList }: EditDeveloperProps) {
    const { data, setData, post, processing, errors } = useForm<EditDeveloperFormData>({
        _method: 'PUT',
        name: developer.name || '',
        lastname: developer.lastname || '',
        email: developer.email || '',
        identification_number: developer.identification_number || '',
        address: developer.address || '',
        profession: developer.profession || '',
        specialty: developer.specialty || '',
        worker_type: developer.worker_type || '',
        profile_photo: null,
        is_active: developer.is_active,
    });

    const [photoPreview, setPhotoPreview] = useState<string | null>(developer.profile_photo_url || null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('profile_photo', file);
            setPhotoPreview(URL.createObjectURL(file));
        } else {
            setData('profile_photo', null);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('coordinator.developers.update', developer.id), {
            onError: () => {
                // Errors are handled automatically by `useForm`
            },
            onSuccess: () => {
                // Success notification can be added here
            }
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Coordinator Dashboard',
            href: route('coordinator.coordinate')
        },
        {
            title: `Edit: ${developer.name} ${developer.lastname}`,
            href: route('coordinator.developers.edit', developer.id)
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Desarrollador" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 md:p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
                        Edit Developer: <span className="text-blue-600 dark:text-blue-400">{developer.name} {developer.lastname}</span>
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="profession">Profession</Label>
                                <Input
                                    type="text"
                                    name="profession"
                                    id="profession"
                                    value={data.profession || ''}
                                    onChange={e => setData('profession', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                                <InputError message={errors.profession} className="mt-2" />
                            </div>
                            <div>
                                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="specialty">Specialty</Label>
                                <select
                                    id="specialty"
                                    name="specialty"
                                    value={data.specialty}
                                    onChange={e => setData('specialty', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                >
                                    {specialtyList.map(spec => <option key={spec} value={spec} className="capitalize">{spec}</option>)}
                                </select>
                                <InputError message={errors.specialty} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="worker_type">Worker Type</Label>
                            <select
                                id="worker_type"
                                name="worker_type"
                                value={data.worker_type}
                                onChange={e => setData('worker_type', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                {workerTypeList.map(type => <option key={type} value={type} className="capitalize">{type}</option>)}
                            </select>
                            <InputError message={errors.worker_type} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end space-x-4">
                            <Link href={route('coordinator.coordinate')} className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
                                Cancel
                            </Link>
                            <Button
                                type="submit"
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-sm disabled:opacity-50"
                                disabled={processing}
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}