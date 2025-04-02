import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import TextSection from './create_include/TextSection';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Discussion Board',
        href: '/discussion-board',
    },
];

const create = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <section className="grid grid-cols-1 p-6">
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
        </AppLayout>
    );
};

export default create;
