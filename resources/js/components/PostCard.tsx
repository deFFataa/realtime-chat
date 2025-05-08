import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useInitials } from '@/hooks/use-initials';
import { Post } from '@/types/post';
import { format, formatDistanceToNow } from 'date-fns';
import { Download, Ellipsis, FileUpIcon, Forward, Heart, LoaderCircle, MessageCircle, Trash } from 'lucide-react';

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
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const PostCard = ({
    user: { id: userId, name },
    id,
    title = '',
    body,
    media_location,
    comments_count,
    likes_count,
    is_liked = false,
    created_at,
}: Post) => {
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

    const {
        post,
        processing,
        delete: destroy,
    } = useForm({
        post_id: id,
        user_id: user_id,
    });

    const handleLike = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('discussion-board.like-post', { id }), {
            preserveScroll: true,
        });
    };

    const Wrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => {
        return url.startsWith('/post') ? (
            <div className={className}>{children}</div>
        ) : (
            <Link href={`/post/${id}`} className={className}>
                {children}
            </Link>
        );
    };

    const imageExtensionName = ['jpeg', 'jpg', 'png'];
    const fileExtensionName = ['pdf', 'doc', 'docx'];

    const file_extension = media_location?.split('.').pop();

    const handleDeletePost = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        destroy(route('discussion-board.destroy', { id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Comment is deleted.');
            },
        });
    };

    return (
        <>
            <section className="hover:bg-accent/30 rounded p-4 duration-100 ease-in" key={id}>
                <div className="relative">
                    <Wrapper className="flex items-center">
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
                    </Wrapper>
                    <div className="absolute top-0 right-0">
                        {user_id === userId && (
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
                                                    <DialogTitle className="text-center">Delete Post</DialogTitle>
                                                    <DialogDescription className="">
                                                        Are you sure you want to remove this post? This action cannot be undone.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter className="text-center">
                                                    <form onSubmit={handleDeletePost}>
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
                    <div className="mt-1">
                        <h1 className="font-medium" dangerouslySetInnerHTML={{ __html: title }} />
                        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: modifiedBody }} />
                        {file_extension && imageExtensionName.includes(file_extension) && (
                            <div className="my-2 h-full max-h-80 w-full overflow-hidden">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" className="h-full w-full cursor-pointer p-0">
                                            <img src={`/image_media/${media_location}`} alt={title} className="h-full w-full object-cover" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="h-fit w-full">
                                        <DialogHeader></DialogHeader>
                                        <div className="max-h-[80vh] overflow-auto">
                                            <img src={`/image_media/${media_location}`} alt={title} className="w-full" />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}
                        {file_extension && fileExtensionName.includes(file_extension) && (
                            <div className="bg-background my-2 flex w-full justify-between rounded border p-3">
                                <div className="flex items-center gap-2">
                                    <FileUpIcon className="text-muted-foreground" />
                                    <p className="text-muted-foreground text-sm">{media_location}</p>
                                </div>
                                <div>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant={'ghost'}
                                                    onClick={() => {
                                                        const link = document.createElement('a');
                                                        link.href = `/file_media/${media_location}`;
                                                        link.download = media_location?.split('/').pop() || 'file';
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                    }}
                                                >
                                                    <Download />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Download</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <form onSubmit={handleLike} className="relative right-[6px] flex flex-row items-center gap-1 hover:text-red-400">
                        <button className="rounded-full hover:bg-red-50/50 hover:text-red-400">
                            {is_liked ? <Heart fill="#ff6467" color="#ff6467" size={34} className="p-2" /> : <Heart size={34} className="p-2" />}
                        </button>
                        <span className="[position:inherit] right-[8px]">{likes_count === 0 ? '' : likes_count}</span>
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

                        <span className="relative right-[12px]">{comments_count === 0 ? '' : comments_count}</span>
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
                                    <Input id="link" defaultValue={`http://127.0.0.1:8000/post/${id}`} readOnly />
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
