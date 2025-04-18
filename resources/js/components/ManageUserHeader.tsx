import { Button } from '@/components/ui/button';
import { Link, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';

interface Props {
    url: string;
}

const ManageUserHeader = ({ url }: Props) => {
    const { auth } = usePage().props as unknown as { auth: { user: { role: string } } };
    const is_super_admin = auth.user.role === 'super-admin';

    return (
        <div className="flex justify-between">
            <div className="bg-muted/50 flex w-fit gap-2 rounded-md border p-2 text-sm font-medium">
                <Link
                    href="/admin/users"
                    className={`${url === '/admin/users' && 'bg-primary text-secondary hover:bg-primary rounded-md'} hover:bg-muted rounded-md px-2 py-1`}
                >
                    Users
                </Link>
                {is_super_admin && (
                    <Link
                        href="/admin/admin-users"
                        className={`${url === '/admin/admin-users' && 'bg-primary text-secondary hover:bg-primary rounded-md'} hover:bg-muted rounded-md px-2 py-1`}
                    >
                        Admins
                    </Link>
                )}
            </div>
            <div>
                <Button asChild>
                    <Link href={route('admin.users.create')}>
                        New User
                        <Plus className="size-5" />
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default ManageUserHeader;
