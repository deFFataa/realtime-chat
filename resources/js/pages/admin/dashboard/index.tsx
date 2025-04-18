import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';
import ActiveUsers from './includes/ActiveUsers';
import FeedbackSummaryReport from './includes/FeedbackSummaryReport';
import ScheduleAndReminders from './includes/ScheduleAndReminders';
import TotalAgenda from './includes/TotalAgenda';
import TotalBoardResolution from './includes/TotalBoardResolution';
import TotalDiscussionBoard from './includes/TotalDiscussionBoard';
import TotalMoM from './includes/TotalMoM';
import UpcomingEvent from './includes/UpcomingEvent';

(window as any).Pusher = Pusher;

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

interface Props {
    users_count: number;
    post_count: number;
    new_users: Array<{ id: number; name: string; email: string; created_at: string }>;
    active_users: number;
    all_users: any[];
    schedule: Array<{
        id: number;
        title: string;
        description: string;
        date_of_meeting: string;
        start_time: string;
        end_time: string;
    }>;
}

export default function Dashboard({ users_count, post_count, new_users, active_users, all_users, schedule }: Props) {
    const [totalUsers, setTotalUsers] = useState(users_count || 0);
    const [totalPosts, setTotalPosts] = useState(post_count || 0);
    const [totalActiveUsers, setTotalActiveUsers] = useState(active_users || 0);
    const [newUser, setNewUser] = useState(new_users);
    const [allUsers, setAllUsers] = useState(all_users);

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

        // echo.channel('total-users').listen('TotalUsers', (e: any) => setTotalUsers(e.total_users));
        // echo.channel('total-posts').listen('TotalPosts', (e: any) => setTotalPosts(e.total_posts));
        echo.channel('active-users').listen('TotalActiveUsers', (e: any) => setTotalActiveUsers(e.total_active_users));
        // echo.channel('new-user').listen('NewUser', (e: any) => {
        //     setNewUser((prevUsers) => [e, ...prevUsers.filter((user) => user.id !== e.id)]);
        //     setAllUsers((prevUsers) => [e, ...prevUsers.filter((user) => user.id !== e.id)]);
        // });
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="bg-secondary flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <TotalAgenda />
                    <TotalMoM />
                    <TotalBoardResolution />
                    <TotalDiscussionBoard />
                    <ActiveUsers totalActiveUsers={totalActiveUsers} />
                    <UpcomingEvent />
                </div>
                <div className="grid min-h-0 flex-1 grid-cols-2 gap-4 max-lg:grid-cols-1">
                    <ScheduleAndReminders schedule={schedule}/>
                    <FeedbackSummaryReport/>
                </div>
            </div>
        </AppLayout>
    );
}
