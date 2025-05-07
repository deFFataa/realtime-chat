import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useInitials } from '@/hooks/use-initials';
import { Post } from '@/types/post';
import { format, formatDistanceToNow } from 'date-fns';
import { Forward, Heart, MessageCircle } from 'lucide-react';

import { Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SharedData } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';

const PostCard = ({ user: { name }, id, title = '', body, media_location, comments_count, likes_count = 0, is_liked = false, created_at }: Post) => {
    const getInitials = useInitials();

    const { url } = usePage();

    const user_id = usePage<SharedData>().props.auth.user.id;

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

    const modifiedBody = addTargetBlankToLinks(body);

    const { post } = useForm({
        post_id: id,
        user_id: user_id,
    });

    const handleLike = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('discussion-board.like-post', { id }), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <section className="hover:bg-accent/30 rounded p-4 duration-100 ease-in" key={id}>
                {url.startsWith('/post') ? (
                    <div>
                        <div className="flex items-center">
                            <Avatar className="mr-2">
                                <AvatarImage src="" alt="@shadcn" />
                                <AvatarFallback>{getInitials(name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <div className="text-sm font-medium">{name}</div>
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
                        <div className="mt-1">
                            <h1 className="font-medium" dangerouslySetInnerHTML={{ __html: title }}></h1>
                            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: modifiedBody }} />
                        </div>
                    </div>
                ) : (
                    <Link href={`/post/${id}`}>
                        <div className="flex items-center">
                            <Avatar className="mr-2">
                                <AvatarImage src="" alt="@shadcn" />
                                <AvatarFallback>{getInitials(name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <div className="text-sm font-medium">{name}</div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="text-muted-foreground w-fit cursor-pointer text-xs hover:underline">
                                                {formatDistanceToNow(new Date(created_at), { includeSeconds: true })
                                                    .replace(' minutes', 'm')
                                                    .replace(' minute', 'm')}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{format(new Date(created_at), 'EEEE, MMM dd, yyyy - hh:mm a')}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                        <div className="mt-1">
                            <h1 className="font-medium" dangerouslySetInnerHTML={{ __html: title }}></h1>
                            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: modifiedBody }} />
                        </div>
                    </Link>
                )}

                <div className="flex items-center">
                    <form onSubmit={handleLike} className="relative right-[6px] flex flex-row items-center gap-1 hover:text-red-400">
                        <button className="rounded-full hover:bg-red-50/50 hover:text-red-400">
                            {is_liked ? <Heart fill="#ff6467" color="#ff6467" size={34} className="p-2" /> : <Heart size={34} className="p-2" />}
                        </button>
                        <span className="[position:inherit] right-[8px]">{likes_count}</span>
                    </form>
                    <div className="flex items-center hover:text-green-400">
                        {url.startsWith('/post') ? (
                            <Label
                                htmlFor="comment"
                                className="relative right-[10px] scale-x-[-1] rounded-full hover:bg-green-50/50 hover:text-green-400"
                            >
                                <MessageCircle size={34} className="p-2" />
                            </Label>
                        ) : (
                            <Link
                                href={`/post/${id}`}
                                className="relative right-[10px] scale-x-[-1] rounded-full hover:bg-green-50/50 hover:text-green-400"
                            >
                                <MessageCircle size={34} className="p-2" />
                            </Link>
                        )}

                        <span className="relative right-[12px]">{comments_count}</span>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="hover:bg-primary/5 hover:text-primary relative right-[6px] rounded-full">
                                <Forward size={34} className="p-2" />
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Share link</DialogTitle>
                                <DialogDescription>Anyone who has this link will be able to view this.</DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2">
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="link" className="sr-only">
                                        Link
                                    </Label>
                                    <Input id="link" defaultValue={`http://127.0.0.1:8000${url}/post/${id}`} readOnly />
                                </div>
                                <Button
                                    type="button"
                                    size="sm"
                                    className="px-3"
                                    onClick={() => {
                                        const input = document.getElementById('link') as HTMLInputElement;
                                        if (input) {
                                            const copiedElement = document.getElementById('copied');
                                            if (copiedElement) {
                                                copiedElement.innerHTML = 'Copied';
                                                copiedElement.style.transition = 'opacity 0.5s ease';
                                                copiedElement.style.opacity = '1';

                                                navigator.clipboard.writeText(input.defaultValue).then(() => {
                                                    setTimeout(() => {
                                                        copiedElement.style.opacity = '0';
                                                        setTimeout(() => {
                                                            copiedElement.innerHTML = '';
                                                        }, 500);
                                                    }, 1000);
                                                });
                                            }
                                        }
                                    }}
                                >
                                    <span className="sr-only">Copy</span>
                                    <Copy />
                                </Button>
                            </div>
                            <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                    <div className="flex w-full items-center justify-between">
                                        <Button type="button" variant="secondary">
                                            Close
                                        </Button>
                                        <p className="text-muted-foreground text-sm" id="copied"></p>
                                    </div>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </section>
        </>
    );
};

export default PostCard;
