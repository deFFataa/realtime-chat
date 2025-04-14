import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Props } from '@/types/ManageUser';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
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
    };

    const resetPassword = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('admin.users.reset-password', user.id), {
            onSuccess: () => {
                toast.success('Password reset successfully!');
            },
            onError: () => {
                toast.error('Failed to reset password! Please try again.');
            },
        });
    };

    return (
        <div className="grid grid-cols-3 py-4">
            <div className="px-4">
                <h1 className="font-semibold">Account Information</h1>
                <p className="text-muted-foreground text-sm">Edit account's information</p>
            </div>
            <form onSubmit={saveAccountInformation} className="col-span-2 grid grid-cols-2 gap-2 px-4">
                <div className="col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" placeholder="Email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                    <InputError message={errors.email} className="mt-1 text-sm" />
                </div>
                <div className="col-span-2 flex justify-between">
                    <div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button type="button" form="resetPassword" variant={'secondary'}>
                                    Reset Password
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle className="text-center">Reset Password</DialogTitle>
                                    <DialogDescription className="">Are you sure you want to reset the password of this account?</DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="text-center">
                                    <Button form="resetPassword" disabled={processing}>
                                        {processing ? (
                                            <div className="flex items-center gap-2">
                                                <LoaderCircle className="animate-spin" />
                                                Resetting..
                                            </div>
                                        ) : (
                                            'Yes, I confirm.'
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Button disabled={processing}>
                        {processing ? (
                            <div className='flex items-center gap-2'>
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                Saving...
                            </div>
                        ) : (
                            'Save'
                        )}
                    </Button>
                </div>
            </form>
            <form onSubmit={resetPassword} id="resetPassword" className="hidden"></form>
        </div>
    );
};

export default AccountInformation;
