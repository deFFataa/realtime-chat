import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Calendar, CalendarClock, Handshake, LayoutGrid, Mail, Megaphone, NotebookPen, Plus, Star, Users } from 'lucide-react';
import AppLogo from './app-logo';
import { Button } from './ui/button';

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const is_admin = usePage<any>().props.auth.user.role === 'admin' || usePage<any>().props.auth.user.role === 'super-admin';

    const mainNavItems: NavItem[] = is_admin
        ? [
              {
                  title: 'Dashboard',
                  href: '/admin/dashboard',
                  icon: LayoutGrid,
              },
              {
                  title: 'Meeting Scheduler',
                  href: '/admin/meeting-scheduler',
                  icon: CalendarClock,
              },
              {
                  title: 'Agenda',
                  href: '/admin/agenda',
                  icon: Calendar,
              },
              {
                  title: 'Minutes of the Meeting',
                  href: '/admin/minutes-of-the-meeting',
                  icon: NotebookPen,
              },
              {
                  title: 'Board Resolution',
                  href: '/admin/board-resolution',
                  icon: Handshake,
              },
              {
                  title: 'Feedback Report',
                  href: '/admin/feeback-report',
                  icon: Star,
              },
              {
                  title: 'Discussion Board',
                  href: '/admin/discussion-board',
                  icon: Megaphone,
              },
              {
                  title: 'Users',
                  href: '/admin/users',
                  icon: Users,
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
                            <Link href={`${is_admin ? '/admin/dashboard' : '/dashboard'}`} prefetch>
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
