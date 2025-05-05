import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import TextSection from './create_include/TextSection';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Discussion Board',
        href: '/discussion-board',
    },
];

const create = () => {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
    });

    return (
        <div className="bg-background">
            <AppHeaderLayout breadcrumbs={breadcrumbs}>
                <Head title="Create Post" />
                <section className="bg-background mx-auto grid grid-cols-1 px-4 py-4 md:max-w-7xl">
                    <h1 className="font-bold">Create Post</h1>
                    <Tabs defaultValue="text" className="w-full">
                        <TabsList className="w-full max-w-fit gap-4">
                            <TabsTrigger className="cursor-pointer" value="text">
                                Text
                            </TabsTrigger>
                            <TabsTrigger className="cursor-pointer" value="media">
                                Images & Video
                            </TabsTrigger>
                            <TabsTrigger className="cursor-pointer" value="link">
                                Links
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="text">
                            <TextSection />
                        </TabsContent>
                        <TabsContent value="media">Images and Vidoes</TabsContent>
                        <TabsContent value="link">Links</TabsContent>
                    </Tabs>
                </section>
            </AppHeaderLayout>
        </div>
    );
};

export default create;
