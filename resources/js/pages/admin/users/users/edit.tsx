import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
        is_loggedin: string;
        role: 'user' | 'admin';
        created_at: string;
        updated_at: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Users',
        href: '/admin/users',
    },
    {
        title: 'Edit User',
        href: '#',
    },
];

const edit = ({ user }: Props) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        id: user.id,
        name: user.name,
        email: user.email,
        is_loggedin: user.is_loggedin,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
    });

    console.log(user);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <form action="">
                <h1 className="px-4 font-bold">Edit {data.name} Information</h1>
                <div className="grid p-4">
                    <div className="grid grid-cols-3">
                        <div>Personal Details</div>
                        <div className='col-span-2 grid grid-cols-2 gap-2'>
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input type="name" id="name" placeholder="Name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="email"
                                    id="email"
                                    placeholder="Email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Select value={Number(data.is_loggedin) === 1 ? '1' : '0'} onValueChange={(value) => setData('is_loggedin', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a fruit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="1">Active</SelectItem>
                                            <SelectItem value="0">Inactive</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="role">Role</Label>
                                <Select value={data.role} onValueChange={(value) => setData('role', value as 'user' | 'admin')}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a fruit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="created_at">Created on </Label>
                                <Input
                                    type="created_at"
                                    id="created_at"
                                    placeholder="Created On"
                                    value={format(new Date(data.created_at), 'MMMM dd, yyyy - hh:mm a')}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
};

export default edit;
