import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Props } from '@/types/ManageUser';
import InputError from '@/components/input-error';
import { toast, Toaster } from 'sonner';
const AccountInformation = ({ user }: Props) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: user.email,
    });

    const saveAccountInformation = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('admin.users.update-account-information', user.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Saved Successfully!');
            },
            onError: () => {
                toast.error('Failed to save!');
            },
        });
    }
    return (
        <div className="grid grid-cols-3 py-4">
            <div className="px-4">
                <h1 className="font-semibold">Account Information</h1>
                <p className="text-muted-foreground text-sm">Edit this account's information</p>
            </div>
            <form onSubmit={saveAccountInformation} className="col-span-2 grid grid-cols-2 gap-2 px-4">
                <div className="col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" placeholder="Email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                    <InputError message={errors.email} className="text-sm mt-1" />
                </div>
                <div className="col-span-2 flex justify-between">
                    <Button form="resetPassword" variant={'secondary'}>
                        Reset Password
                    </Button>
                    <Button>Save</Button>
                </div>
            </form>
            <form id="resetPassword" className="hidden"></form>
        </div>
    );
};

export default AccountInformation;
