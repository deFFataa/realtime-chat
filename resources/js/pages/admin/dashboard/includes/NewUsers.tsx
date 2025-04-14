import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface Props {
    new_users: Array<{ id: number; name: string; email: string; created_at: string }>;
}

const NewUsers = ({ new_users = [] }: Props) => {
    return (
        <div className="bg-background h-full overflow-auto rounded-md shadow">
            <h2 className="bg-background sticky top-0 z-1 p-4 text-sm font-medium">New Users</h2>
            {new_users.length === 0 && (
                <div className="text-muted-foreground flex h-full items-center justify-center p-4 text-sm">
                    New Users will displayed here in realtime.
                </div>
            )}
            {new_users.map((user: any) => (
                <div key={user.id} className="flex justify-between px-4 pb-4">
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <h2 className="text-sm font-medium">{user.name}</h2>
                            <span className="text-muted-foreground text-sm">{user.email}</span>
                        </div>
                    </div>
                    <div className="self-center text-sm font-medium">{formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}</div>
                </div>
            ))}
        </div>
    );
};

export default NewUsers;
