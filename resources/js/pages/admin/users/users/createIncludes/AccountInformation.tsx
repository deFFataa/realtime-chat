import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
const AccountInformation = ({ data, setData, errors } : any) => {
    return (
        <div className="grid py-4">
            <div className="grid grid-cols-2 gap-2 px-4">
                <div className='col-span-3'>
                    <Alert>
                        <ShieldCheck className="h-4 w-4" />
                        <AlertTitle>Important Reminder</AlertTitle>
                        <AlertDescription className='flex'>Password will be automatically set to: "<strong className='text-primary'>ECollab_2025</strong>"</AlertDescription>
                    </Alert>
                </div>
                <div className="col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" placeholder="Email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                    <InputError message={errors.email} className="mt-1 text-sm" />
                </div>
            </div>
        </div>
    );
};

export default AccountInformation;
