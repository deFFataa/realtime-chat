import CommentCard from '@/components/CommentCard';
import PostCard from '@/components/PostCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useInitials } from '@/hooks/use-initials';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Props } from '@/types/post';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Discussion Board',
        href: '/discussion-board',
    },
];

const index = ({ post, upcoming_meetings, comments }: Props) => {
    const { name, id: user_id } = usePage<SharedData>().props.auth.user;

    const { auth } = usePage<SharedData>().props;

    const getInitials = useInitials();

    const chatInput = useRef<HTMLTextAreaElement>(null);

    const {
        data,
        setData,
        processing,
        post: submitPost,
    } = useForm({
        comment: '',
        post_id: post.id,
        user_id: auth.user.id,
    });

        const [commentsCount, setCommentsCount] = useState(post.comments?.length || 0);
        const [postLikesCount, setPostLikesCount] = useState(post.post_likes?.length || 0);

        useEffect(() => {
            setCommentsCount(comments.length);
        }, [comments]);

        useEffect(() => {
            setPostLikesCount(post.post_likes?.length || 0);
        }, [post.post_likes]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitPost(route('discussion-board.comment-post', { post: post.id }), {
            onSuccess: () => {
                data.comment = '';
            },
            onError: () => {
                toast('Cannot send a message', {
                    description: 'There was an error sending your message. Please try again.',
                });
            },
            preserveScroll: true,
        });
    };

    console.log(comments);

    return (
        <div className="bg-muted">
            <AppHeaderLayout breadcrumbs={breadcrumbs}>
                <Toaster />
                <Head title={`${post.user.name.trim()}'s Post`} />
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
                                                    <div className="font-medium">250</div>
                                                    <div className="text-muted-foreground text-sm">Post</div>
                                                </div>

                                                <Separator orientation="vertical" />
                                                <div className="flex flex-col">
                                                    <div className="font-medium">250</div>
                                                    <div className="text-muted-foreground text-sm">Comments</div>
                                                </div>
                                                <Separator orientation="vertical" />
                                                <div className="flex flex-col">
                                                    <div className="font-medium">250</div>
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
                                                const startTime = new Date(`1970-01-01T${meeting.start_time}Z`);
                                                const endTime = new Date(`1970-01-01T${meeting.end_time}Z`);
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
                                                            <DialogHeader>
                                                                <DialogTitle>Meeting Details</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="grid gap-4 py-4">
                                                                <div>
                                                                    <span className="font-medium">Agenda: </span>
                                                                    {meeting.title}
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">Description: </span>
                                                                    {meeting.description}
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">Date: </span>
                                                                    {format(meeting.date_of_meeting, 'MMM dd yyyy')}
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">Time: </span>
                                                                    {`${format(startTime, 'h:mm a')} - ${format(endTime, 'h:mm a')}`}
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
                        <div className="bg-background col-span-2 h-fit rounded-lg">
                        <PostCard
                                    key={post.id}
                                    user={post.user}
                                    id={post.id}
                                    title={post.title}
                                    comments_count={commentsCount}
                                    likes_count={postLikesCount}
                                    is_liked={(post.post_likes ?? []).some((like) => like.user_id === user_id)}
                                    body={post.body}
                                    media_location={post.media_location}
                                    url={post.url}
                                    created_at={post.created_at}
                                />
                            <hr />
                            <div className="flex p-4">
                                <Avatar className="mr-2">
                                    <AvatarImage src="" alt="@shadcn" />
                                    <AvatarFallback>{getInitials(name)}</AvatarFallback>
                                </Avatar>
                                <Textarea
                                    name="comment"
                                    id='comment'
                                    ref={chatInput}
                                    autoFocus
                                    className="scrollbar-hide focus-visible:border-ring/0 focus-visible:ring-ring/0 h-full max-h-[70px] min-h-auto w-full flex-1 resize-none overflow-x-hidden overflow-y-auto border-none px-0 break-words break-all shadow-none"
                                    onChange={(e) => setData('comment', e.target.value)}
                                    placeholder="Write a comment..."
                                    value={data.comment}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit(e as any);
                                        }
                                    }}
                                    disabled={processing}
                                />
                            </div>
                            <hr />
                            {comments.map((comment) => {
                                return (
                                    <div key={comment.id}>
                                        <CommentCard
                                            key={comment.id}
                                            comment={comment.comment}
                                            children={comment.children}
                                            comments_count={comment.children?.length || 0}
                                            user={comment.user}
                                            id={comment.id}
                                            media_location={comment.media_location}
                                            url={comment.url}
                                            created_at={comment.created_at}
                                        />
                                        <hr />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="bg-background rounded-lg p-4">
                            <h3 className="font-medium">Announcements</h3>
                        </div>
                    </div>
                </div>
            </AppHeaderLayout>
        </div>
    );
};

export default index;
