import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProperName } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Props } from '@/types/ManageUser';

const AdditionalInformation = ({ user }: Props) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        is_loggedin: user.is_loggedin,
        role: user.role,
        created_at: user.created_at,
    });

    return (
        <div className="grid grid-cols-3 py-4">
            <div className="px-4">
                <h1 className="font-semibold">Additional Information</h1>
                <p className="text-muted-foreground text-sm">Edit this users' additional information</p>
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-2 px-4">
                <div>
                    <Label htmlFor="status">Status</Label>
                    <Input
                        type="text"
                        id="created_at"
                        placeholder="Created On"
                        value={Number(data.is_loggedin) === 1 ? 'Active' : 'Inactive'}
                        readOnly
                    />
                </div>
                <div>
                    <Label htmlFor="role">Role</Label>
                    <Input type="text" id="created_at" placeholder="Created On" value={ProperName(data.role)} readOnly />
                </div>
                <div>
                    <Label htmlFor="created_at">Created on </Label>
                    <Input
                        type="text"
                        id="created_at"
                        placeholder="Created On"
                        value={format(new Date(data.created_at), 'MMMM dd, yyyy - hh:mm a')}
                        readOnly
                    />
                </div>
            </div>
        </div>
    );
};

export default AdditionalInformation;
