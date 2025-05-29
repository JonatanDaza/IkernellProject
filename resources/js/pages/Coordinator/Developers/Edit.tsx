import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types'; // Assuming User type is defined in types
import { Head, Link, useForm, type FormDataConvertible } from '@inertiajs/react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Textarea } from '@headlessui/react'; // Using Textarea from @headlessui/react
// import { Switch } from '@/components/ui/switch'; // Removed as it might not exist
 
// The User type from '@/types' should now include all necessary developer fields.
// We Omit fields that are not part of the edit form or are handled differently.
interface DeveloperData extends Omit<User, 'password' | 'date_of_birth' | 'email_verified_at' | 'created_at' | 'updated_at' | 'two_factor_secret' | 'two_factor_recovery_codes' | 'two_factor_confirmed_at' | 'role' | 'avatar'> {
    // No need to add fields here if they are now in the global User type
}

interface EditDeveloperProps {
    developer: DeveloperData;
 specialtyList: string[];
 workerTypeList: string[];
    errors: Record<string, string>; // More specific type for server-side validation errors
} 

// Define an interface for the form data to ensure type safety with useForm
interface EditDeveloperFormDataType {
    _method: 'PUT';
    name: string;
    lastname: string;
    email: string;
    identification_number: string;
    address: string;
    profession: string;
    specialty: string;
    worker_type: string;
    profile_photo: File | null;
    is_active: boolean;
    [key: string]: FormDataConvertible; // Index signature for compatibility with useForm
} 

export default function EditDeveloper({ developer, specialtyList, workerTypeList, errors: serverErrors }: EditDeveloperProps) {
    const { data, setData, post, processing, errors, progress, isDirty } = useForm<EditDeveloperFormDataType>({
         _method: 'PUT', // Important for Laravel to recognize it as a PUT request
        name: developer.name || '',
        lastname: developer.lastname || '',
        email: developer.email || '',
        identification_number: developer.identification_number || '',
        address: developer.address || '',
        profession: developer.profession || '', // Corrected typo: was 'processing'
        specialty: developer.specialty || specialtyList[0] || '',
        worker_type: developer.worker_type || workerTypeList[0] || '',
        profile_photo: null as File | null,
        is_active: developer.is_active === undefined ? true : developer.is_active, // Default to true if undefined
    });

    const [preview, setPreview] = useState<string | null>(
        developer.profile_photo_path ? `/storage/${developer.profile_photo_path}` : null
    );

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Coordinator Dashboard',
            href: route('coordinator.coordinate')
        },
        // { title: 'Developers', href: route('coordinator.developers.index') }, // If you have a listing page
        {
            title: `Edit Developer: ${developer.name} ${developer.lastname}`, 
            href: route('coordinator.developers.edit', { developer: developer.id }) 
        },
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setData('profile_photo', file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            // Revert to original photo if file is deselected, or set to null if no original
            setPreview(developer.profile_photo_path ? `/storage/${developer.profile_photo_path}` : null);
        }
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Inertia's `post` method can handle file uploads and _method spoofing
        post(route('coordinator.developers.update', { developer: developer.id }), { // Changed parameter passing style
            forceFormData: true, // Important for file uploads
            // onSuccess: () => {} // Handled by controller redirect
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Developer: ${developer.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4" >
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 md:p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
                        Edit Developer Profile: <span className="text-blue-600 dark:text-blue-400">{developer.name} {developer.lastname}</span>
                    </h2>
                    <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</Label>
                                <Input id="name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"/>
                                <InputError message={errors.name || serverErrors?.name} className="mt-2" />
                            </div>
                            <div>
                                <Label htmlFor="lastname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lastname</Label>
                                <Input id="lastname" name="lastname" value={data.lastname} onChange={(e) => setData('lastname', e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"/>
                                <InputError message={errors.lastname || serverErrors?.lastname} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
                            <Input id="email" name="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"/>
                            <InputError message={errors.email || serverErrors?.email} className="mt-2" />
                        </div>

                        {/* Password and Date of Birth are excluded as per requirements */}

                        <div>
                            <Label htmlFor="identification_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Identification Number</Label>
                            <Input id="identification_number" name="identification_number" value={data.identification_number} onChange={(e) => setData('identification_number', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"/>
                            <InputError message={errors.identification_number || serverErrors?.identification_number} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</Label>
                            <Textarea
                                id="address"
                                name="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-24"
                            />
                            <InputError message={errors.address || serverErrors?.address} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <Label htmlFor="profession" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profession</Label>
                                <Input id="profession" name="profession" value={data.profession} onChange={(e) => setData('profession', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"/>
                                <InputError message={errors.profession || serverErrors?.profession} className="mt-2" />
                            </div>
                            <div>
                                <Label htmlFor="specialty" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Development Specialty</Label>
                                <select id="specialty" name="specialty" value={data.specialty} onChange={(e) => setData('specialty', e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                    {specialtyList.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                                </select>
                                <InputError message={errors.specialty || serverErrors?.specialty} className="mt-2" />
                            </div>
                            <div>
                                <Label htmlFor="worker_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Worker Type</Label>
                                <select id="worker_type" name="worker_type" value={data.worker_type} onChange={(e) => setData('worker_type', e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                    {workerTypeList.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                                <InputError message={errors.worker_type || serverErrors?.worker_type} className="mt-2" />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            {/* Replaced Switch with standard HTML checkbox */}
                            <input
                                id="is_active"
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <Label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Active Developer
                            </Label>
                            <InputError message={errors.is_active || serverErrors?.is_active} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="profile_photo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Photo</Label>
                            {preview && (
                                <div className="mt-2 mb-4">
                                    <img src={preview} alt="Profile Preview" className="h-24 w-24 rounded-full object-cover" />
                                </div>
                            )}
                            <Input
                                id="profile_photo"
                                type="file"
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200 dark:hover:file:bg-gray-600"
                                onChange={handleFileChange}
                            />
                            {progress && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress.percentage}%` }}></div>
                                </div>
                            )}
                            <InputError message={errors.profile_photo || serverErrors?.profile_photo} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end space-x-4">
                            <Link href={route('coordinator.coordinate')} className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
                                Cancel
                            </Link>
                            <Button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm disabled:opacity-50" disabled={processing || !isDirty}>
                                Update Developer
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}