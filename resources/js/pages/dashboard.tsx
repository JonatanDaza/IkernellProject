import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import ProgramLibrary, { ProgramResource } from '@/pages/ProgramLibrary'; // Asegúrate que la ruta sea correcta
import { type BreadcrumbItem } from '@/types';
import TutorialLibrary, { TutorialResource } from '@/components/TutorialLibrary';

interface ProgramLibraryDashboardProps {
    programResources: ProgramResource[];
    tutorialResources: TutorialResource[];
 chatUsers: User[];
    currentUser: User | null;
}

export interface User {
    id: number;
    name: string;
}


const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: route('dashboard') }];

export default function Dashboard({ programResources, tutorialResources }: ProgramLibraryDashboardProps) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="">
                        <ProgramLibrary resources={programResources} />
                        <TutorialLibrary resources={tutorialResources} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center"></h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Card para Reporte de Interrupciones */}
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Reporte de Interrupciones</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Visualiza las interrupciones registradas por proyecto.
                        </p>
                        <Link href={route('reports.interruption.form')} className="mt-auto inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150">
                            Generar Reporte
                        </Link>
                    </div>

                    {/* Card para Reporte de Actividades */}
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Reporte de Actividades</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Revisa el estado de las actividades por proyecto.
                        </p>
                        <Link href={route('reports.activity.form')} className="mt-auto inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-800 focus:outline-none focus:border-green-900 focus:ring ring-green-300 disabled:opacity-25 transition ease-in-out duration-150">
                            Generar Reporte
                        </Link>
                    </div>

                    {/* Card para Reporte Empresa Brasileña */}
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center text-center">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Reporte para Brasil</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Genera el archivo (Pdf) con datos de proyectos.
                        </p>
                        <Link href={route('reports.brazilian.form')} className="mt-auto inline-flex items-center px-4 py-2 bg-purple-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-purple-700 active:bg-purple-800 focus:outline-none focus:border-purple-900 focus:ring ring-purple-300 disabled:opacity-25 transition ease-in-out duration-150">
                            Generar reporte
                        </Link>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
// import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
// import AppLayout from '@/layouts/app-layout';
// import { type BreadcrumbItem } from '@/types';
// import { Head, Link } from '@inertiajs/react';

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Home',
//         href: '/',
//     },
// ];

// export default function Dashboard() {
//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Dashboard" />
//             <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
//                 <div className="grid auto-rows-min gap-4 md:grid-cols-3">
//                     <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
//                         <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
//                     </div>
//                     <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
//                         <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
//                     </div>
//                     <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
//                         <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
//                     </div>
//                 </div>
//                 <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
//                     <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
//                 </div>
//             </div>
//         </AppLayout>
//     );
// }