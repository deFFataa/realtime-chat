import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ProperName } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

interface Props {
    message?: string | ReactNode | undefined;
    name?: string | undefined;
    variant?: 'sender' | 'receiver';
    joinedAt?: any;
    sent_date: string;
    id: number;
}

const ChatMessage = ({ message, name = 'No Name', variant = 'sender', joinedAt = 'Unknown', sent_date = 'Uknown', id }: Props) => {
    if (variant === 'sender') {
        return (
            <div className="flex justify-end gap-2">
                <TooltipProvider delayDuration={800} skipDelayDuration={500}>
                    <Tooltip>
                        <TooltipTrigger className="text-left" style={{ textWrap: 'wrap' }} asChild>
                            <div className="bg-primary whitespace-pre text-secondary w-fit max-w-xl rounded-md p-2 text-sm/6 shadow font-medium">{message}</div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Sent: {sent_date}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        );
    } else {
        return (
            <div>
                <div className="flex gap-2">
                    <HoverCard>
                        <HoverCardTrigger asChild>
                            <Avatar className="mt-5 self-start">
                                {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
                                <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                            <div className="flex space-x-2">
                                <Link href="">
                                    <Avatar>
                                        {/* <AvatarImage
                                            src="https://github.com/shadcn.png"
                                            className="duration-100 ease-in hover:grayscale-25"
                                            alt="@shadcn"
                                        /> */}
                                        <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div className="">
                                    <a href="#" className="hover:text-primary/80 text-sm font-semibold duration-100 ease-in">
                                        {ProperName(name)}
                                    </a>
                                    <p className="text-foreground text-xs">Joined at {joinedAt}</p>
                                </div>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                    <div>
                        <h5 className="mb-1 text-xs">{ProperName(name)}</h5>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="text-left" style={{ textWrap: 'wrap' }} asChild>
                                    <div key={id} className="bg-secondary whitespace-pre text-foreground shadow w-fit max-w-xl rounded-md p-2 text-sm/6 font-medium">{message}</div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Sent: {sent_date}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        );
    }
};

export default ChatMessage;
