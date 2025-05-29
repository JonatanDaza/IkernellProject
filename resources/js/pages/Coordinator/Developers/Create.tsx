import AppLayout from '@/layouts/app-layout'; // Ajusta si tu layout de coordinador es diferente
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, type FormDataConvertible } from '@inertiajs/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Textarea } from '@headlessui/react'; // Using Textarea from @headlessui/react for consistency

interface CreateDeveloperProps {
    specialtyList: string[];
    workerTypeList: string[];
    errors: Record<string, string>; // More specific type for server-side validation errors
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Coordinator Dashboard', href: route('coordinator.coordinate') }, // Ajusta a tu ruta de dashboard de coordinador
    { title: 'Create Developer', href: route('coordinator.developers.create') },
];

// Define an interface for the form data to ensure type safety with useForm
interface CreateDeveloperFormDataType {
    name: string;
    lastname: string;
    email: string;
    password: string;
    password_confirmation: string;
    date_of_birth: string; // Keep as string for input type="date"
    identification_number: string;
    address: string;
    profession: string;
    specialty: string;
    worker_type: string;
    profile_photo: File | null;
    [key: string]: FormDataConvertible; // Index signature for compatibility with useForm
}

export default function CreateDeveloper({ specialtyList, workerTypeList, errors: serverErrors }: CreateDeveloperProps) {
    const { data, setData, post, processing, errors, reset, progress } = useForm<CreateDeveloperFormDataType>({
        name: '',
        lastname: '',
        email: '',
        password: '',
        password_confirmation: '',
        date_of_birth: '',
        identification_number: '',
        address: '',
        profession: '',
        specialty: specialtyList[0] || '',
        worker_type: workerTypeList[0] || '',
        profile_photo: null as File | null,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('coordinator.developers.store'), {
            onSuccess: () => reset(),
            // Los errores se manejan automáticamente por `errors` de useForm y `serverErrors`
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}> {/* Usa el layout apropiado para el coordinador */}
            <Head title="Register New Developer" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 md:p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
                        Register New Developer
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</Label>
                                <Input id="password" name="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"/>
                                <InputError message={errors.password || serverErrors?.password} className="mt-2" />
                            </div>
                            <div>
                                <Label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</Label>
                                <Input id="password_confirmation" name="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"/>
                                <InputError message={errors.password_confirmation || serverErrors?.password_confirmation} className="mt-2" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</Label>
                                <Input id="date_of_birth" name="date_of_birth" type="date" value={data.date_of_birth} onChange={(e) => setData('date_of_birth', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"/>
                                <InputError message={errors.date_of_birth || serverErrors?.date_of_birth} className="mt-2" />
                            </div>
                            <div>
                                <Label htmlFor="identification_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Identification Number</Label>
                                <Input id="identification_number" name="identification_number" value={data.identification_number} onChange={(e) => setData('identification_number', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"/>
                                <InputError message={errors.identification_number || serverErrors?.identification_number} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</Label>
                            <Textarea
                                id="address"
                                name="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)} // Simplified onChange
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

                        <div>
                            <Label htmlFor="profile_photo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Photo</Label>
                            <Input
                                id="profile_photo"
                                type="file"
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200 dark:hover:file:bg-gray-600"
                                onChange={(e) => setData('profile_photo', e.target.files ? e.target.files[0] : null)}
                            />
                            {progress && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress.percentage}%` }}></div>
                                </div>
                            )}
                            <InputError message={errors.profile_photo || serverErrors?.profile_photo} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end space-x-4">
                            <Link href={route('coordinator.coordinate')} className="text-sm text-gray-600 dark:text-gray-400 hover:underline"> {/* Ajusta a tu ruta de dashboard de coordinador */}
                                Cancel
                            </Link>
                            <Button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-sm disabled:opacity-50" disabled={processing}>
                                Register Developer
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
