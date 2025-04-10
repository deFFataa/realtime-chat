import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';
import PersonalInformation from './editIncludes/PersonalInformation';
import AccountInformation from './editIncludes/AccountInformation';
import AdditionalInformation from './editIncludes/AdditionalInformation';
import AddressInformation from './editIncludes/AddressInformation';
import { Props } from '@/types/ManageUser';

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


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User"></Head>
            <div>
                <h1 className="px-4 font-bold">Edit {user.name} Information</h1>
                <PersonalInformation user={user} />
                <Separator className="my-4" />
                <AccountInformation user={user}/>
                <Separator className="my-4" />
                <AddressInformation user={user} />
                <Separator className="my-4" />
                <AdditionalInformation user={user} />
            </div>
        </AppLayout>
    );
};

export default edit;
