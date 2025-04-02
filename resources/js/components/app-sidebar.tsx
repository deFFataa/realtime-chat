import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Mail, Megaphone, Plus, Users } from 'lucide-react';
import AppLogo from './app-logo';
import { Button } from './ui/button';

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const is_admin = usePage<any>().props.auth.user.role === 'admin';

    const mainNavItems: NavItem[] = is_admin
        ? [
              {
                  title: 'Dashboard',
                  href: '/admin/dashboard',
                  icon: LayoutGrid,
              },
              {
                  title: 'Manage Users',
                  href: '/admin/users',
                  icon: Users,
              },
              {
                  title: 'Manage Discussion Board',
                  href: '/admin/discussion-board',
                  icon: Megaphone,
              },
          ]
        : [
              {
                  title: 'Dashboard',
                  href: '/dashboard',
                  icon: LayoutGrid,
              },
              {
                  title: 'Discussion Board',
                  href: '/discussion-board',
                  icon: Megaphone,
              },
              {
                  title: 'Chat',
                  href: '/chat',
                  icon: Mail,
              },
          ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                        {!is_admin && (
                            <Button asChild>
                                <Link href="/discussion-board/create" className="my-2 w-full">
                                    <Plus />
                                    Create Discussion
                                </Link>
                            </Button>
                        )}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
