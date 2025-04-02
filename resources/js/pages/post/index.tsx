import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Discussion Board',
        href: '/discussion-board',
    },
];

const index = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-6">Hekki</div>
        </AppLayout>
    );
};

export default index;
