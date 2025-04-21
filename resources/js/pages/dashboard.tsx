import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';
(window as any).Pusher = Pusher;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    users_count: number;
    post_count: number;
}

export default function Dashboard({ users_count, post_count }: Props) {
    const [totalUsers, setTotalUsers] = useState(users_count | 0);
    const [totalPosts, setTotalPosts] = useState(post_count | 0);
    const [totalActiveUsers, setTotalActiveUsers] = useState(0);

    useEffect(() => {
        const echo = new Echo({
            broadcaster: 'reverb',
            key: import.meta.env.VITE_REVERB_APP_KEY,
            wsHost: import.meta.env.VITE_REVERB_HOST,
            wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
            wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
            forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
        });

        echo.channel('total-users').listen('TotalUsers', (e: any) => {
            setTotalUsers(e.total_users);
        });

        echo.channel('total-posts').listen('TotalPosts', (e: any) => {
            setTotalPosts(e.total_posts);
        });
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            user Here
        </AppLayout>
    );
}
