import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import FilesImagesSection from './create_include/FilesImagesSection';
import AppLayout from '@/layouts/app-layout';
import TextSection from './create_include/TextSection';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Discussion Board',
        href: '/discussion-board',
    },
    {
        title: 'Create Post',
        href: '/discussion-board/create',
    },
];

const create = () => {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
    });

    return (
        <div className="bg-background">
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Create Post" />
                <section className="bg-background  grid grid-cols-1 px-4 py-4">
                    <h1 className="font-bold">Create Post</h1>
                    <Tabs defaultValue="text" className="w-full">
                        <TabsList className="w-full max-w-fit gap-4">
                            <TabsTrigger className="cursor-pointer" value="text">
                                Text
                            </TabsTrigger>
                            <TabsTrigger className="cursor-pointer" value="media">
                                Files and Images
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="text">
                            <TextSection />
                        </TabsContent>
                        <TabsContent value="media">
                            <FilesImagesSection />
                        </TabsContent>
                    </Tabs>
                </section>
            </AppLayout>
        </div>
    );
};

export default create;
