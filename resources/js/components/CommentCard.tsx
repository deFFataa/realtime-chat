import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useInitials } from '@/hooks/use-initials';
import { Comments } from '@/types/post';
import { format, formatDistanceToNow } from 'date-fns';
import { Ellipsis, Heart, LoaderCircle, MessageCircle, Trash } from 'lucide-react';

import { SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import React, { useRef } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Textarea } from './ui/textarea';

const CommentCard = ({
    user = { id: 0, name: 'Unknown' },
    id,
    comment,
    media_location,
    likes_count = 0,
    is_liked = false,
    comments_count = 0,
    created_at,
    children: replies,
}: Comments) => {
    const getInitials = useInitials();

    const user_id = usePage<SharedData>().props.auth.user.id;
    const name = usePage<SharedData>().props.auth.user.name;

    const addTargetBlankToLinks = (htmlContent: string) => {
        const div = document.createElement('div');
        div.innerHTML = htmlContent;

        const links = div.querySelectorAll('a');
        links.forEach((link) => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });

        return div.innerHTML;
    };

    const modifiedBody = addTargetBlankToLinks(comment);

    const {
        data,
        setData,
        post,
        processing,
        delete: destroy,
    } = useForm({
        post_id: id,
        user_id: user_id,
        comment: '',
    });

    const handleLike = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('discussion-board.like-post', { id }));
    };

    const handleDeleteComment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        destroy(route('comments.destroy', { id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Comment is deleted.');
            },
        });
    };

    const handleReply = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('comments.reply', { id }), {
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

    const chatInput = useRef<HTMLTextAreaElement>(null);

    const showRepliesAndTextArea = () => {
        const commentForm = document.getElementById(`comment-form-${id}`) as HTMLFormElement;

        if (commentForm.classList.contains('flex')) {
            commentForm.classList.remove('flex');
            commentForm.classList.add('hidden');
            return;
        }
        commentForm.classList.remove('hidden');
        commentForm.classList.add('flex');

        chatInput.current?.focus();
    };

    return (
        <>
            <section className="hover:bg-accent/30 rounded p-4 duration-100 ease-in" key={id}>
                <div>
                    <div className="flex items-center justify-between">
                        <div className="flex">
                            <Avatar className="mr-2">
                                <AvatarImage src="" alt="@shadcn" />
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <div className="text-sm font-medium">{user.name}</div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="text-muted-foreground w-fit cursor-pointer text-xs hover:underline">
                                                {formatDistanceToNow(new Date(created_at), { includeSeconds: true })}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{format(new Date(created_at), 'EEEE, MMM dd, yyyy - hh:mm a')}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                        <div>
                            {user_id === user.id && (
                                <Popover>
                                    <PopoverTrigger className="hover:bg-secondary hover:text-primary rounded-full p-1">
                                        <Ellipsis size={24} className="p-1" />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-fit">
                                        <div className="flex w-full flex-col">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant={'ghost'} className="flex w-full justify-start text-red-500 hover:text-red-500">
                                                        <Trash className="" size={16} />
                                                        <span className="ml-1 text-sm">Delete</span>
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-center">Delete Comment</DialogTitle>
                                                        <DialogDescription className="">
                                                            Are you sure you want to remove this comment? This action cannot be undone.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter className="text-center">
                                                        <form onSubmit={handleDeleteComment}>
                                                            <Button variant={'destructive'} type="submit" disabled={processing}>
                                                                {processing ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <LoaderCircle className="animate-spin" />
                                                                        Deleting...
                                                                    </div>
                                                                ) : (
                                                                    'Yes, I confirm.'
                                                                )}
                                                            </Button>
                                                        </form>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>
                    </div>
                    <div className="mt-1">
                        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: modifiedBody }} />
                    </div>
                </div>

                <div className="flex items-center">
                    <form onSubmit={handleLike} className="relative right-[6px] flex flex-row items-center gap-1 hover:text-red-400">
                        <button className="rounded-full hover:bg-red-50/50 hover:text-red-400">
                            {is_liked ? <Heart fill="#ff6467" color="#ff6467" size={34} className="p-2" /> : <Heart size={34} className="p-2" />}
                        </button>
                        <span className="[position:inherit] right-[8px]">{likes_count}</span>
                    </form>
                    <div className="flex items-center hover:text-green-400">
                        <div
                            onClick={showRepliesAndTextArea}
                            className="relative right-[10px] scale-x-[-1] rounded-full hover:bg-green-50/50 hover:text-green-400"
                        >
                            <MessageCircle size={34} className="p-2" />
                        </div>
                        <span className="relative right-[12px]">{comments_count}</span>
                    </div>
                </div>
                <div>
                    {(replies?.length ?? 0) > 0 && (
                        <button
                            className="cursor-pointer"
                            id={`show-replies-${id}`}
                            onClick={() => {
                                const button = document.getElementById(`show-replies-${id}`);
                                button?.remove();
                                const repliesElements = document.querySelectorAll(`#replies-${id}`);
                                repliesElements.forEach((reply) => {
                                    reply.classList.remove('hidden');
                                });
                            }}
                        >
                            {`View ${replies?.length} ${replies?.length === 1 ? 'reply' : 'replies'}`}
                        </button>
                    )}

                    {replies?.map((reply) => (
                        <div key={reply.id} id={`replies-${id}`} className="hidden ml-4">
                            <CommentCard {...reply} />
                        </div>
                    ))}
                </div>
                <form className="hidden py-2" id={`comment-form-${id}`}>
                    <Avatar className="mr-2">
                        <AvatarImage src="" alt="@shadcn" />
                        <AvatarFallback>{getInitials(name)}</AvatarFallback>
                    </Avatar>
                    <Textarea
                        name="comment"
                        id="comment"
                        ref={chatInput}
                        autoFocus
                        className="scrollbar-hide focus-visible:ring-ring/0 h-full max-h-[100px] min-h-auto w-full flex-1 resize-none overflow-x-hidden overflow-y-auto rounded-none border-none px-4 break-words break-all shadow-none"
                        style={{ borderBottom: '2px solid #3b82f6' }}
                        onChange={(e) => setData('comment', e.target.value)}
                        placeholder="Write a comment..."
                        value={data.comment}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleReply(e as any);
                            }
                        }}
                        disabled={processing}
                    />
                </form>
            </section>
        </>
    );
};

export default CommentCard;
