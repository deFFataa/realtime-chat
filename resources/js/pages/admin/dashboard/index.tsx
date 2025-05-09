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
import UpcomingMeeting from './includes/UpcomingMeeting';

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
    agenda: number;
    minutesOfMeeting: number;
    feedbacks?: Array<{
        id: number;
        user: {
            name: string;
        };
        rating: number;
        comment: string;
        created_at: string;
    }>;
    rating_today: number;
    overall_rating: number;
    upcoming_meeting: {
        date_of_meeting: string;
        start_time: string;
        end_time: string;
    };
}

export default function Dashboard({
    users_count,
    post_count,
    new_users,
    active_users,
    all_users,
    schedule,
    agenda,
    minutesOfMeeting,
    feedbacks,
    rating_today,
    overall_rating,
    upcoming_meeting,
}: Props) {
    const [totalUsers, setTotalUsers] = useState(users_count || 0);
    const [totalPosts, setTotalPosts] = useState(post_count || 0);
    const [totalActiveUsers, setTotalActiveUsers] = useState(active_users || 0);
    const [newUser, setNewUser] = useState(new_users);
    const [allUsers, setAllUsers] = useState(all_users);
    const [totalAgenda, setTotalAgenda] = useState(agenda || 0);
    const [totalMoM, setTotalMoM] = useState(minutesOfMeeting || 0);

    const [upcomingDateMeeting, setUpcomingDateMeeting] = useState(upcoming_meeting.date_of_meeting);
    const [upcomingStartTimeMeeting, setUpcomingStartTimeMeeting] = useState(upcoming_meeting.start_time);
    const [upcomingendTimeMeeting, setUpcomingendTimeMeeting] = useState(upcoming_meeting.end_time);

    const [feedbackList, setFeedbackList] = useState(feedbacks);
    const [totalRatingToday, setTotalRatingToday] = useState(rating_today);
    const [totalOverallRating, setTotalOverallRating] = useState(overall_rating);
    console.log(totalPosts);

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
        echo.channel('active-users').listen('TotalActiveUsers', (e: any) => setTotalActiveUsers(e.total_active_users));
        // echo.channel('new-user').listen('NewUser', (e: any) => {
        //     setNewUser((prevUsers) => [e, ...prevUsers.filter((user) => user.id !== e.id)]);
        //     setAllUsers((prevUsers) => [e, ...prevUsers.filter((user) => user.id !== e.id)]);
        // });
        echo.channel('rating').listen('Rating', (e: any) => {
            // console.log();
            
            setFeedbackList([...(feedbacks || []), e.feedbacks]);
            setTotalRatingToday(e.rating_today);
            setTotalOverallRating(e.overall_rating);
        })
        echo.channel('agenda').listen('TotalAgenda', (e: any) => setTotalAgenda(e.agenda));
        echo.channel('minutes-of-meeting').listen('TotalMinutesOfTheMeeting', (e: any) => {
            console.log(e);
            setTotalMoM(e.minutesOfMeeting)
            
        });
        echo.channel('total-posts').listen('TotalPosts', (e: any) => setTotalPosts(e.post_count));
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="bg-secondary flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <TotalAgenda totalAgenda={totalAgenda} />
                    <TotalMoM totalMoM={totalMoM} />
                    <TotalBoardResolution />
                    <TotalDiscussionBoard totalPosts={totalPosts}/>
                    <ActiveUsers totalActiveUsers={totalActiveUsers} />
                    <UpcomingMeeting
                        upcomingDateMeeting={upcomingDateMeeting}
                        upcomingStartTimeMeeting={upcomingStartTimeMeeting}
                        upcomingEndTimeMeeting={upcomingendTimeMeeting}
                    />
                </div>
                <div className="grid min-h-0 flex-1 grid-cols-2 gap-4 max-lg:grid-cols-1">
                    <ScheduleAndReminders schedule={schedule} />
                    <FeedbackSummaryReport feedbacks={feedbackList} rating_today={totalRatingToday} overall_rating={totalOverallRating} />
                </div>
            </div>
        </AppLayout>
    );
}
