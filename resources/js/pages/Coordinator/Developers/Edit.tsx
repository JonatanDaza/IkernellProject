import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
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

export default function EditDeveloper({ developer, specialtyList, workerTypeList }: EditDeveloperProps) {
    const { data, setData, post, processing, errors } = useForm<any>({
        _method: 'PUT',
        name: developer.name || '',
        lastname: developer.lastname || '',
        email: developer.email || '',
        identification_number: developer.identification_number || '',
        address: developer.address || '',
        profession: developer.profession || '',
        specialty: developer.specialty || '',
        worker_type: developer.worker_type || '',
        profile_photo: null as File | null,
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
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="lastname">Last Name</Label>
                            <Input
                                type="text"
                                name="lastname"
                                id="lastname"
                                value={data.lastname}
                                onChange={e => setData('lastname', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <InputError message={errors.lastname} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="identification_number">Identification Number</Label>
                            <Input
                                type="text"
                                name="identification_number"
                                id="identification_number"
                                value={data.identification_number || ''}
                                onChange={e => setData('identification_number', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <InputError message={errors.identification_number} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="address">Address</Label>
                            <Textarea
                                name="address"
                                id="address"
                                value={data.address || ''}
                                onChange={e => setData('address', e.target.value)}
                                rows={3}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-24"
                            />
                            <InputError message={errors.address} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="profession">Profession</Label>
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
                            <Label htmlFor="specialty">Specialty</Label>
                            <select
                                id="specialty"
                                name="specialty"
                                value={data.specialty}
                                onChange={e => setData('specialty', e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                {specialtyList.map(spec => <option key={spec} value={spec} className="capitalize">{spec}</option>)}
                            </select>
                            <InputError message={errors.specialty} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="worker_type">Worker Type</Label>
                            <select
                                id="worker_type"
                                name="worker_type"
                                value={data.worker_type}
                                onChange={e => setData('worker_type', e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                {workerTypeList.map(type => <option key={type} value={type} className="capitalize">{type}</option>)}
                            </select>
                            <InputError message={errors.worker_type} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="profile_photo">Profile Photo</Label>
                            <Input
                                type="file"
                                name="profile_photo"
                                id="profile_photo"
                                onChange={handleFileChange}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200 dark:hover:file:bg-blue-800"
                            />
                            {photoPreview && (
                                <div className="mt-2">
                                    <img src={photoPreview} alt="Profile preview" className="h-20 w-20 object-cover rounded-full" />
                                </div>
                            )}
                            <InputError message={errors.profile_photo} className="mt-2" />
                        </div>

                        <div className="flex items-center">
                            <input
                                id="is_active"
                                name="is_active"
                                type="checkbox"
                                checked={data.is_active}
                                onChange={e => setData('is_active', e.target.checked)}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <Label htmlFor="is_active" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                                Active
                            </Label>
                        </div>
                        <InputError message={errors.is_active} className="mt-2" />

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