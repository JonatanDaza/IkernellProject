import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState, type FormEvent, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
        {
        title: 'Manage',
        href: '/',
    },
];

// Define Role type first
// Updated Role type based on new roles
type Role = 'developer' | 'admin' | 'leader' | 'coordinator' | 'interested';
// Tipos para los datos de usuario (simulados)
interface User {
    id: number;
    name: string;
    email: string;
    role: Role; // Usamos el nuevo tipo Role
    is_active: boolean;
}

// Props que el componente Dashboard espera de Laravel/Inertia
interface DashboardProps {
    initialUsers: User[];
    availableRoles: Role[]; // Recibe los roles del backend
}

export default function Dashboard({
    initialUsers = [], // Valor por defecto para initialUsers
    availableRoles = [], // Valor por defecto para availableRoles
}: DashboardProps) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Buscando:', searchTerm);
        if (!searchTerm) {
            setUsers(initialUsers); // Reset a la lista original si la búsqueda está vacía
            return;
        }
        // Filtra basado en la lista original de usuarios recibida como prop
        const filteredUsers = initialUsers.filter(user =>
            (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setUsers(filteredUsers);
    };

    // Sincronizar el estado local 'users' si la prop 'initialUsers' cambia
    useEffect(() => {
        setUsers(initialUsers);
    }, [initialUsers]);

    const handleChangeRole = (userId: number, newRole: Role) => {
        console.log(`Cambiar rol para usuario ${userId} a ${newRole}`);
        // Optimistic UI update
        setUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, role: newRole } : user));
        setErrorMessage(null); // Clear previous error messages
        setSuccessMessage(`Rol del usuario ${userId} cambiado a ${newRole}.`);
        // Clear success message after 3 seconds, error message will clear it if error occurs
        setTimeout(() => setSuccessMessage(null), 3000);

        // Llamada API para persistir el cambio en el backend.
        // Asegúrate de tener una ruta en Laravel como 'admin.users.update-role'
        // o usa la URL literal, por ejemplo, `/admin/users/${userId}/update-role`.
        router.put(route('admin.users.update-role', { user: userId }), { role: newRole }, {
            preserveScroll: true, // Evita que la página se desplace al inicio tras la petición
            onSuccess: () => {
                // Opcional: Manejar el éxito, por ejemplo, mostrar un mensaje más persistente
                // El mensaje de éxito ya se muestra con la actualización optimista.
                console.log(`Rol del usuario ${userId} actualizado a ${newRole} en el servidor.`);
            },
            onError: (errors) => {
                console.error('Error al cambiar el rol:', errors);
                // Opcional: Revertir el cambio en la UI si la API falla y mostrar mensaje de error
                setUsers(initialUsers); // Revierte al estado original de las props (last known good state from server)
                setSuccessMessage(null); // Clear optimistic success message
                setErrorMessage('Error al cambiar el rol. Por favor, inténtelo de nuevo.');
                setTimeout(() => setErrorMessage(null), 3000); // Optionally hide error message after a delay
             },
        });
    };

    const handleToggleUserStatus = (userId: number, isActive: boolean) => {
        console.log(`${isActive ? 'Activar' : 'Desactivar'} usuario ${userId}`);
        // Optimistic UI update
        setUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, is_active: isActive } : user));
        setErrorMessage(null); // Clear previous error messages
        setSuccessMessage(`Usuario ${userId} ${isActive ? 'activado' : 'desactivado'}.`);
        setTimeout(() => setSuccessMessage(null), 3000);

        // Llamada API para persistir el cambio en el backend.
        // Asegúrate de tener una ruta en Laravel como 'admin.users.update-status'
        // o usa la URL literal, por ejemplo, `/admin/users/${userId}/update-status`.
        router.put(route('admin.users.update-status', { user: userId }), { is_active: isActive }, {
            preserveScroll: true, // Evita que la página se desplace al inicio tras la petición
            onSuccess: () => {
                // Opcional: Manejar el éxito. El mensaje ya se muestra con la actualización optimista.
                console.log(`Estado del usuario ${userId} actualizado a ${isActive} en el servidor.`);
            },
            onError: (errors) => {
                console.error('Error al cambiar el estado del usuario:', errors);
                // Opcional: Revertir el cambio en la UI si la API falla y mostrar mensaje de error
                setUsers(initialUsers); // Revierte al estado original de las props (last known good state from server)
                setSuccessMessage(null); // Clear optimistic success message
                setErrorMessage('Error al cambiar el estado del usuario. Por favor, inténtelo de nuevo.');
                setTimeout(() => setErrorMessage(null), 3000); // Optionally hide error message after a delay
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Nueva sección de gestión de usuarios */}
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Users Man
                            </h1>
                        </div>     
                    <div className="md:col-span-3 bg-white dark:bg-gray-800 shadow-md rounded-xl border border-sidebar-border/70 dark:border-sidebar-border overflow-y-auto">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                Usuarios
                            </span>
                        </div>

                        {successMessage && (
                            <div className="m-4 p-3 bg-green-100 dark:bg-green-700 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-100 rounded-md">
                                <p>{successMessage}</p>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="m-4 p-3 bg-red-100 dark:bg-red-700 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-100 rounded-md">
                                <p>{errorMessage}</p>
                            </div>
                        )}

                        <div className="p-4">
                            <form onSubmit={handleSearch} className="mb-4">
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <div className="flex-grow">
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            name="search"
                                            placeholder="Buscar por nombre o email"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm"
                                        >
                                            Buscar
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <div className="overflow-x-auto relative"> {/* Max height removida, scroll vertical manejado por el padre */}
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 z-10">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Nombre</th>
                                            <th scope="col" className="px-6 py-3">Email</th>
                                            <th scope="col" className="px-6 py-3">Rol</th>
                                            <th scope="col" className="px-6 py-3">Estado</th>
                                            <th scope="col" className="px-6 py-3 text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                    {user.name}
                                                </td>
                                                <td className="px-6 py-4">{user.email}</td>
                                                <td className="px-6 py-4 capitalize">{user.role}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                        user.is_active
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                                                    }`}>
                                                        {user.is_active ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center space-y-1 md:space-y-0 md:space-x-2 whitespace-nowrap">
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleChangeRole(user.id, e.target.value as Role)}
                                                        className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    >
                                                        {/* Usar availableRoles directamente de props es más limpio */}
                                                        {availableRoles.map(roleName => (
                                                            <option key={roleName} value={roleName} className="capitalize">
                                                                {roleName}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    {!user.is_active ? (
                                                        <button
                                                            onClick={() => handleToggleUserStatus(user.id, true)}
                                                            className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded"
                                                        >
                                                            Activar
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleToggleUserStatus(user.id, false)}
                                                            className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                                                        >
                                                            Desactivar
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                    No se encontraron usuarios.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
