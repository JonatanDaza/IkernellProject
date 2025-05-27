import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import React, { useState, type FormEvent, useEffect, useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
        {
        title: 'Project Coordination',
        href: route('coordinator.coordinate'), // Use the new named route
    },
];

// Define types for data coming from the backend
interface User {
    id: number;
    name: string;
    email: string;
    specialty: string | null;
    role: string; // User's global role
    // Data from the pivot table
    pivot: {
        project_id: number;
        user_id: number;
        is_active_in_project: boolean;
    };
}

interface Project {
    id: number;
    name: string;
    description: string | null;
    users: User[]; // Users assigned to this project
}

// Props that the component expects from Laravel/Inertia
interface CoordinateProps {
    initialProjects: Project[];
    specialtiesList: string[]; // List of unique specialties for filtering
    assignableUsersList: Omit<User, 'pivot'>[]; // Users available for linking (don't have pivot data here)
}

export default function Coordinate({
    initialProjects = [],
    specialtiesList = [],
    assignableUsersList = [],
}: CoordinateProps) {
    // State to manage which user is selected for linking to which project
    // Key: project.id, Value: user.id to link (or '' if none selected)
    const [userToLink, setUserToLink] = useState<Record<number, number | ''>>({});

    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState<string | ''>('');
    const [selectedStatus, setSelectedStatus] = useState<boolean | ''>('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Effect to clear success message timeout if component unmounts or message changes
    useEffect(() => {
        let timerId: NodeJS.Timeout;
        if (successMessage) {
            timerId = setTimeout(() => setSuccessMessage(null), 3000);
        }
        return () => clearTimeout(timerId); // Cleanup on unmount or if successMessage changes
    }, [successMessage]);

    // Effect to synchronize local state if initialProjects prop changes
    useEffect(() => {
        setProjects(initialProjects);
    }, [initialProjects]);


    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Buscando:', searchTerm);
        // Filtering is primarily handled by useMemo reacting to searchTerm changes.
        // This function could be used for an explicit search submission if desired,
        // or to trigger a backend search if frontend filtering becomes too slow.
        // This function is kept for the form's onSubmit, but could be removed if search is instant
    };

    // Function to filter users within projects based on search/filter criteria
    const filterUsersInProjects = (projectsToFilter: Project[]) => {
        return projectsToFilter.map(project => {
            const filteredUsers = project.users.filter(user => {
                const matchesSearch =
                    !searchTerm || // if no search term, always true
                    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));

                const matchesStatus =
                    selectedStatus === '' || user.pivot.is_active_in_project === selectedStatus;

                const matchesSpecialty =
                    selectedSpecialty === '' || user.specialty === selectedSpecialty;

                return matchesSearch && matchesStatus && matchesSpecialty;
            });
            return { ...project, users: filteredUsers };
        });
    };

    // Apply filters, memoizing the result
    const filteredProjects = useMemo(() => {
        return filterUsersInProjects(projects);
    }, [projects, searchTerm, selectedStatus, selectedSpecialty]);

    const handleToggleUserProjectStatus = (projectId: number, userId: number, isActive: boolean) => {
        console.log(`${isActive ? 'Activating' : 'Deactivating'} user ${userId} in project ${projectId}`);

        // Optimistic UI update
        setProjects(prevProjects =>
            prevProjects.map(project =>
                project.id === projectId
                    ? {
                          ...project,
                          users: project.users.map(user =>
                              user.id === userId
                                  ? { ...user, pivot: { ...user.pivot, is_active_in_project: isActive } }
                                  : user,
                          ),
                      }
                    : project,
            ),
        );
        setSuccessMessage(`User ${userId} ${isActive ? 'activated' : 'deactivated'} in project ${projectId}.`);

        router.put(
            route('coordinator.projects.users.toggle-status', { project: projectId, user: userId }),
            { is_active_in_project: isActive },
            {
                preserveScroll: true,
                onSuccess: () => {
                    console.log(`User status in project ${projectId} updated to ${isActive} in server.`);
                },
                onError: (errors) => {
                    console.error('Error toggling user status in project:', errors);
                    setProjects(initialProjects); // Revert
                    setSuccessMessage('Error updating user status in project. Please try again.');
                },
            },
        );
    };

    const handleLinkUser = (projectId: number) => {
        const selectedUserId = userToLink[projectId];
        if (selectedUserId === '' || selectedUserId === 0) { // Explicitly check for empty string or 0
            alert('Please select a user to link.');
            return;
        }

        console.log(`Linking user ${selectedUserId} to project ${projectId}`);
        router.post(route('coordinator.projects.users.link', { project: projectId }), {
            user_id: selectedUserId
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage(`User linked to project ${projectId} successfully.`);
                setUserToLink(prev => ({ ...prev, [projectId]: '' })); // Reset selection
                // Inertia will reload props, so initialProjects should update
            },
            onError: (errors) => {
                console.error('Error linking user to project:', errors);
                // Improved error message handling
                const messages = typeof errors === 'object' && errors !== null
                    ? Object.values(errors).flat().join(' ')
                    : 'An unexpected error occurred.';
                setSuccessMessage(`Error linking user: ${messages || 'Please try again.'}`);
            }
        });
    };

    const handleUnlinkUser = (projectId: number, userId: number) => {
        if (!confirm(`Are you sure you want to unlink user ${userId} from project ${projectId}?`)) {
            return;
        }
        console.log(`Unlinking user ${userId} from project ${projectId}`);
        router.delete(route('coordinator.projects.users.unlink', { project: projectId, user: userId }), {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage(`User unlinked from project ${projectId} successfully.`);
                // Inertia will reload props, so initialProjects should update
            },
            onError: (errors) => {
                console.error('Error unlinking user from project:', errors);
                const messages = typeof errors === 'object' && errors !== null
                    ? Object.values(errors).flat().join(' ')
                    : 'An unexpected error occurred.';
                setSuccessMessage(`Error unlinking user: ${messages || 'Please try again.'}`);
            }
        });
    };

    const handleUserToLinkChange = (projectId: number, selectedUserId: string) => {
        setUserToLink(prev => ({
            ...prev,
            [projectId]: selectedUserId === '' ? '' : Number(selectedUserId)
        }));
    };

    const handleCycleStatusFilter = () => {
        if (selectedStatus === '') {
            setSelectedStatus(true); // All -> Active
        } else if (selectedStatus === true) {
            setSelectedStatus(false); // Active -> Inactive
        } else {
            setSelectedStatus(''); // Inactive -> All
        }
    };

    const getStatusButtonText = () => {
        if (selectedStatus === '') return 'Status: All';
        return selectedStatus ? 'Status: Active in Project' : 'Status: Inactive in Project';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Project Coordination" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Search and Filter Section */}
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Filter Users in Projects</h2>
                    <form onSubmit={handleSearch} className="mb-0"> {/* onSubmit kept for explicit search trigger if desired */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                type="text"
                                placeholder="Search by Name or Email"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <select
                                value={selectedSpecialty}
                                onChange={(e) => setSelectedSpecialty(e.target.value)}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                <option value="">All Specialties</option>
                                {specialtiesList.map(specialty => (
                                    <option key={specialty} value={specialty} className="capitalize">{specialty}</option>
                                ))}
                            </select>
                            <button
                                type="button" // Prevent form submission
                                onClick={handleCycleStatusFilter}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                {getStatusButtonText()}
                            </button>
                        </div>
                    </form>
                </div>
                        {successMessage && (
                            <div className="m-4 p-3 bg-green-100 dark:bg-green-700 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-100 rounded-md">
                                <p>{successMessage}</p>
                            </div>
                        )}

                {/* Project Sections */}
                <div className="grid auto-rows-min gap-6 md:grid-cols-1"> {/* Projects stack vertically */}
                    {filteredProjects.length === 0 ? (
                         <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-6 text-center text-gray-500 dark:text-gray-400">
                            No projects found or no users match the current filters.
                        </div>
                    ) : (
                        filteredProjects.map(project => (
                            <div key={project.id} className="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{project.name}</h3>
                                        {project.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <select
                                            value={userToLink[project.id] || ''}
                                            onChange={(e) => handleUserToLinkChange(project.id, e.target.value)}
                                            className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">Select User to Link</option>
                                            {assignableUsersList
                                                .filter(assignableUser => !project.users.find(pu => pu.id === assignableUser.id)) // Filter out already linked users
                                                .map(user => (
                                                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => handleLinkUser(project.id)}
                                            disabled={!userToLink[project.id]}
                                            className="px-3 py-1.5 text-xs bg-green-500 hover:bg-green-600 text-white rounded-md disabled:opacity-50"
                                        >
                                            Link User
                                        </button>
                                    </div>
                                </div>
                                <div className="overflow-x-auto relative max-h-[60vh]"> {/* Max height and scroll for user list */}
                                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                        <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 z-10">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">Name</th>
                                                <th scope="col" className="px-6 py-3">Email</th>
                                                <th scope="col" className="px-6 py-3">Specialty</th>
                                                <th scope="col" className="px-6 py-3">Global Role</th>
                                                <th scope="col" className="px-6 py-3">Status in Project</th>
                                                <th scope="col" className="px-6 py-3 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {project.users.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                        No users assigned to this project or matching filters.
                                                    </td>
                                                </tr>
                                            ) : (
                                                project.users.map(user => (
                                                    <tr key={user.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{user.name}</td>
                                                        <td className="px-6 py-4">{user.email}</td>
                                                        <td className="px-6 py-4 capitalize">{user.specialty || 'N/A'}</td>
                                                        <td className="px-6 py-4 capitalize">{user.role}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                                user.pivot.is_active_in_project
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
                                                                    : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                                                            }`}>
                                                                {user.pivot.is_active_in_project ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center space-x-2 whitespace-nowrap">
                                                            {user.pivot.is_active_in_project ? (
                                                                <button
                                                                    onClick={() => handleToggleUserProjectStatus(project.id, user.id, false)}
                                                                    className="px-2 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                                                                >
                                                                    Deactivate
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleToggleUserProjectStatus(project.id, user.id, true)}
                                                                    className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded"
                                                                >
                                                                    Activate
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleUnlinkUser(project.id, user.id)}
                                                                className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                                                            >
                                                                Unlink
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
