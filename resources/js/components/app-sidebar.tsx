import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
const {auth} = usePage<SharedData>().props;
const userRole = auth?.user?.role || 'user';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];
const adminNavItems: NavItem[] = [
    {
        title: 'Manage',
        href: '/admin/manage',
        icon: LayoutGrid,
    },
];
const coordinatorNavItems: NavItem[] = [
    {
        title: 'Coordinator',
        href: route('coordinator.coordinate'), // Use the new named route
        icon: LayoutGrid,
    },
];
const leaderNavItems: NavItem[] = [
    {
        title: 'Leader',
        href: route('project-manager.projects.manage'), // Correctly use the route() helper
        icon: LayoutGrid,
    },
    {
        title: 'Create Project',
        href: route('project-manager.projects.create'), // New link
        icon: Folder, // Example icon
    },
];
const developerNavItems: NavItem[] = [
    {
        title: 'Developer',
        href: '/developer/develop',
        icon: LayoutGrid,
    },
];
let roleBasedNavItems = [...mainNavItems];
if (userRole === 'admin') 
{
    roleBasedNavItems = [...roleBasedNavItems,...adminNavItems];
}
if (userRole === 'coordinator') 
{
    roleBasedNavItems = [...roleBasedNavItems,...coordinatorNavItems];
}
if (userRole === 'leader') 
{
    roleBasedNavItems = [...roleBasedNavItems,...leaderNavItems];
}
if (userRole === 'developer') 
{
    roleBasedNavItems = [...roleBasedNavItems,...developerNavItems];
}

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                            Ikernell
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={roleBasedNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
