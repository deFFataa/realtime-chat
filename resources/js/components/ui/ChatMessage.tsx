import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { ReactNode } from 'react';
import { ProperName } from '@/lib/utils';

interface Props {
    message?: string | ReactNode | undefined;
    name?: string | undefined;
    variant?: 'sender' | 'receiver';
    joinedAt?: any;
}

const ChatMessage = ({ message, name = 'No Name', variant = 'sender', joinedAt = 'Unknown' }: Props) => {
    if (variant === 'sender') {
        return (
            <div className="flex justify-end gap-2">
                <div className="bg-secondary text-primary w-fit rounded-md p-2 text-xs/5 shadow">{message}</div>
            </div>
        );
    } else {
        return (
            <div>
                <div className="flex gap-2">
                    <HoverCard>
                        <HoverCardTrigger asChild>
                            <Avatar className="mt-3 self-center">
                                {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
                                <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                            <div className="flex space-x-2">
                                <a href="">
                                    <Avatar>
                                        {/* <AvatarImage
                                            src="https://github.com/shadcn.png"
                                            className="duration-100 ease-in hover:grayscale-25"
                                            alt="@shadcn"
                                        /> */}
                                        <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </a>
                                <div className="">
                                    <a href="#" className="hover:text-primary/80 text-sm font-semibold duration-100 ease-in">
                                        {ProperName(name)}
                                    </a>
                                    <p className="text-primary/70 text-xs">Joined at {joinedAt}</p>
                                </div>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                    <div>
                        <h5 className="mb-1 text-xs">{ProperName(name)}</h5>
                        <div className="bg-primary text-secondary w-fit rounded-md p-2 text-xs/5">{message}</div>
                    </div>
                </div>
            </div>
        );
    }
};

export default ChatMessage;
