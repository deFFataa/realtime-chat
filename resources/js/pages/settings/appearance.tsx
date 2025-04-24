import { Head, usePage } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { SharedData, type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import AppHeaderLayout from '@/layouts/app/app-header-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    const { auth } = usePage<SharedData>().props;
    const userRole = auth.user.role === 'user';

    if (userRole) {
        return (
            <AppHeaderLayout breadcrumbs={breadcrumbs}>
                <Head title="Appearance settings" />

                <SettingsLayout>
                    <div className="space-y-6">
                        <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
                        <AppearanceTabs />
                    </div>
                </SettingsLayout>
            </AppHeaderLayout>
        );
    } else {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Appearance settings" />

                <SettingsLayout>
                    <div className="space-y-6">
                        <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
                        <AppearanceTabs />
                    </div>
                </SettingsLayout>
            </AppLayout>
        );
    }
}
