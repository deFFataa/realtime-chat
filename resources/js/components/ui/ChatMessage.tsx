import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { ReactNode } from 'react';

interface Props {
    message?: string | ReactNode | undefined;
    name?: string | ReactNode | undefined;
    variant?: 'sender' | 'receiver';
}

const ChatMessage = ({ message, name = 'No Name', variant = 'sender' }: Props) => {
    if (variant === 'sender') {
        return (
            <div className="flex gap-2 justify-end">
                <div className="bg-secondary text-primary w-fit rounded-md p-2 text-xs/5 shadow">{message}</div>
            </div>
        );
    } else {
        return (
            <div className="flex gap-2">
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                        <div className="flex space-x-4">
                            <a href="">
                                <Avatar>
                                    <AvatarImage
                                        src="https://github.com/shadcn.png"
                                        className="duration-100 ease-in hover:grayscale-25"
                                        alt="@shadcn"
                                    />
                                    <AvatarFallback>EC</AvatarFallback>
                                </Avatar>
                            </a>
                            <div className="">
                                <a href="#" className="hover:text-primary/80 text-sm font-semibold duration-100 ease-in">
                                    {name}
                                </a>
                                <p className="text-primary/70 text-xs">Joined at {new Date().toDateString()}</p>
                            </div>
                        </div>
                    </HoverCardContent>
                </HoverCard>
                <div className="bg-primary text-secondary w-fit rounded-md p-2 text-xs/5">{message}</div>
            </div>
        );
    }
};

export default ChatMessage;
