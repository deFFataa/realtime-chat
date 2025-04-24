import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInitials } from '@/hooks/use-initials';
import { SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Dot, LoaderCircle } from 'lucide-react';
const TextSection = () => {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
    });

    const {auth} = usePage<SharedData>().props

    const getInitials = useInitials();

    return (
        <div className="grid grid-cols-2">
            <form className="grid w-full max-w-lg grid-cols-1 gap-2">
                <div className="mt-3 grid w-full max-w-lg items-center gap-1.5">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        type="title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        id="title"
                        placeholder="Title of your discussion"
                    />
                </div>
                <div className="mt-3 grid w-full max-w-lg items-center gap-1.5">
                    <Label htmlFor="body">Body</Label>
                    <Textarea
                        id="body"
                        placeholder="Tell us about your discussion"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        className="max-h-[400px] break-words break-all whitespace-pre-wrap"
                    />
                </div>
                <div className='flex justify-end'>
                    <Button disabled={processing}>
                        {processing ? (
                            <div className="flex items-center gap-2">
                                <LoaderCircle className="animate-spin" />
                                Posting..
                            </div>
                        ) : (
                            'Post'
                        )}
                    </Button>
                </div>
            </form>

            <section>
                <h1 className="mb-4 font-bold">Preview:</h1>
                <div className="flex items-center">
                    <Avatar className="mr-2">
                        <AvatarImage src="" alt="@shadcn" />
                        <AvatarFallback>{getInitials(auth.user.name)}</AvatarFallback>
                    </Avatar>
                    <span>{auth.user.name}</span>
                    <Dot className="m-0 p-0" />
                    <span>a while ago.</span>
                </div>

                <div className="mt-1">
                    <h1 className="font-medium">{data.title}</h1>
                    <p className="break-words break-all whitespace-pre-wrap">{data.content}</p>
                </div>
            </section>
        </div>
    );
};
export default TextSection;
