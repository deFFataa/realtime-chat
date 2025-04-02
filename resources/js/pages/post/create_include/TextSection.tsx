import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
const TextSection = () => {
    return (
        <form className="w-full max-w-lg grid grid-cols-1 gap-2">
            <div className="grid w-full max-w-lg items-center gap-1.5 mt-3">
                <Label htmlFor="title">Title</Label>
                <Input type="title" id="title" placeholder="Title of your discussion" />
            </div>
            <div className="grid w-full max-w-lg items-center gap-1.5 mt-3">
                <Label htmlFor="body">Body</Label>
                <Textarea id="body" placeholder="Tell us about your discussion" className='max-h-[400px]'/>
            </div>
        </form>
    );
};
export default TextSection;
