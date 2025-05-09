import AppLogo from '@/components/app-logo';
import PostCard from '@/components/PostCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useInitials } from '@/hooks/use-initials';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Props } from '@/types/post';
import { Head, Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import Echo from 'laravel-echo';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Discussion Board',
        href: '/discussion-board',
    },
];

const index = ({ posts, upcoming_meetings, total_posts, total_likes }: Props) => {
    const { name, id: user_id } = usePage<SharedData>().props.auth.user;

    const getInitials = useInitials();

    const [postList, setPostList] = useState(posts);

    const [commentsCount, setCommentsCount] = useState(() =>
        posts.reduce(
            (acc, post) => {
                acc[post.id] = post.comments_count || 0; // 👈 use comments_count here
                return acc;
            },
            {} as Record<number, number>,
        ),
    );

    const [postLikesCount, setpostLikesCount] = useState(() =>
        posts.reduce(
            (acc, post) => {
                acc[post.id] = post.post_likes?.length || 0;
                return acc;
            },
            {} as Record<number, number>,
        ),
    );

    useEffect(() => {
        setCommentsCount(
            posts.reduce(
                (acc, post) => {
                    acc[post.id] = post.comments?.length || 0;
                    return acc;
                },
                {} as Record<number, number>,
            ),
        );
        setpostLikesCount(
            posts.reduce(
                (acc, post) => {
                    acc[post.id] = post.post_likes?.length || 0;
                    return acc;
                },
                {} as Record<number, number>,
            ),
        );
    }, [posts]);

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

        echo.channel('new-post').listen('NewPost', (e: any) => {
            setPostList([e, ...posts]);
        });
    }, []);

    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />
            <div className="mx-auto px-4 py-4 md:max-w-7xl">
                <div className="grid grid-cols-4 gap-3">
                    <div className="relative">
                        <div className="sticky top-[82px] flex flex-col gap-3">
                            <div>
                                <div className="bg-background h-fit rounded-lg p-4">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Avatar>
                                            <AvatarImage src="" alt="@shadcn" />
                                            <AvatarFallback>{getInitials(name)}</AvatarFallback>
                                        </Avatar>
                                        <Link href={'settings/profile'} className="hover:text-primary font-medium duration-100 ease-in">
                                            {name}
                                        </Link>

                                        <div className="mt-3 flex h-10 items-center space-x-4 text-center">
                                            <div className="flex flex-col">
                                                <div className="font-medium">{total_posts}</div>
                                                <div className="text-muted-foreground text-sm">Post</div>
                                            </div>

                                            <Separator orientation="vertical" />
                                            <div className="flex flex-col">
                                                <div className="font-medium">{total_likes}</div>
                                                <div className="text-muted-foreground text-sm">Likes</div>
                                            </div>
                                        </div>

                                        <div className="mt-3 w-full">
                                            <Button asChild>
                                                <Link href={route('discussion-board.create')} className="w-full">
                                                    <Plus />
                                                    Create Post
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="bg-background h-fit rounded-lg p-4">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="font-medium">Upcoming Meetings</h3>
                                        {upcoming_meetings.map((meeting) => {
                                            const startTime = new Date(`${meeting.date_of_meeting}T${meeting.start_time}`);
                                            const endTime = new Date(`${meeting.date_of_meeting}T${meeting.end_time}`);
                                            return (
                                                <Dialog key={meeting.id}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" className="h-fit flex-col items-start justify-start gap-0 p-2">
                                                            <div className="text-sm">{meeting.title}</div>
                                                            <div className="text-muted-foreground text-xs">
                                                                {format(meeting.date_of_meeting, 'MMM dd')} (
                                                                {`${format(startTime, 'h:mm a')} - ${format(endTime, 'h:mm a')}`})
                                                            </div>
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px]">
                                                        <DialogHeader className="mx-auto">
                                                            <DialogTitle>Meeting Details</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <div>
                                                                <span className="font-medium">Agenda</span>
                                                                <div className="rounded border p-2">{meeting.title}</div>
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Description</span>
                                                                <div className="rounded border p-2 text-sm">{meeting.description}</div>
                                                            </div>
                                                            <div className="grid grid-cols-5 gap-2">
                                                                <div className="col-span-3">
                                                                    <span className="font-medium">When</span>
                                                                    <div className="rounded border p-2 text-sm">
                                                                        {format(meeting.date_of_meeting, 'MMM dd yyyy')}
                                                                    </div>
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <span className="font-medium">Time</span>
                                                                    <div className="rounded border p-2 text-sm">
                                                                        {`${format(startTime, 'h:mm a')} - ${format(endTime, 'h:mm a')}`}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`bg-background col-span-2 rounded-lg ${postList.length !== 0 && 'h-fit'}`}>
                        {postList.length === 0 ? (
                            <div className="grid h-full place-items-center">
                                <div className="text-center">
                                    <h3>No posts found.</h3>
                                    <p className="text-muted-foreground text-sm">Be the first to post something.</p>
                                    <div className="mt-2 flex items-center justify-center">
                                        <AppLogo />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            posts.map((post) => {
                                return (
                                    <div key={post.id}>
                                        <PostCard
                                            key={post.id}
                                            user={post.user}
                                            id={post.id}
                                            title={post.title}
                                            comments_count={commentsCount[post.id]}
                                            likes_count={postLikesCount[post.id]}
                                            is_liked={(post.post_likes ?? []).some((like) => like.user_id === user_id)}
                                            body={post.body}
                                            media_location={post.media_location}
                                            url={post.url}
                                            created_at={post.created_at}
                                        />
                                        <hr />
                                    </div>
                                );
                            })
                        )}
                        {postList.length !== 0 && (
                            <div className="my-5 grid place-items-center">
                                <div className="text-center">
                                    <h3>You have reached the end.</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Create a new post{' '}
                                        <Link className="hover:text-primary underline" href={'/post/create'}>
                                            here
                                        </Link>
                                        .
                                    </p>
                                    <div className="mt-2 flex items-center justify-center">
                                        <AppLogo />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="bg-background rounded-lg p-4">
                        <h3 className="font-medium">Announcements</h3>
                    </div>
                </div>
            </div>
        </AppHeaderLayout>
    );
};

export default index;
