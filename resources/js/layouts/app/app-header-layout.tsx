import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

export default function AppHeaderLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { url } = usePage();

    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent className={url.startsWith('/home') ? 'bg-muted' : ''}>{children}</AppContent>
        </AppShell>
    );
}
