import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Props } from '@/types/ManageUser';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AccountInformation from './editIncludes/AccountInformation';
import AdditionalInformation from './editIncludes/AdditionalInformation';
import AddressInformation from './editIncludes/AddressInformation';
import PersonalInformation from './editIncludes/PersonalInformation';
import EditUserWithBackButton from '@/components/edit-user-with-back-button';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Users',
        href: '/admin/admin-users',
    },
    {
        title: 'Edit User',
        href: '#',
    },
];

const edit = ({ user }: Props) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User"></Head>
            <div>
                <div className="mt-3 flex items-center px-4">
                    <EditUserWithBackButton href="/admin/admin-users" />
                    <h1 className="px-4 font-bold">{user.name} Information</h1>
                </div>
                <PersonalInformation user={user} />
                <Separator className="my-4" />
                <AccountInformation user={user} />
                <Separator className="my-4" />
                <AddressInformation user={user} />
                <Separator className="my-4" />
                <AdditionalInformation user={user} />
            </div>
        </AppLayout>
    );
};

export default edit;
