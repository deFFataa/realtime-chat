import AppLayout from '@/layouts/app-layout';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Discussion Board',
        href: '/discussion-board',
    },
];

const index = () => {
    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <div className="p-6">All Discussion board will be posted here</div>
        </AppHeaderLayout>
    );
};

export default index;
