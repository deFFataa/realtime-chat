import NewMemberSteps from '@/components/NewMemberSteps';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AccountInformation from './createIncludes/AccountInformation';
import AddressInformation from './createIncludes/AddressInformation';
import PersonalInformation from './createIncludes/PersonalInformation';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Users',
        href: '/admin/users',
    },
    {
        title: 'New Member',
        href: '#',
    },
];

const Create = () => {
    const [step, setStep] = useState(1);

    const handleNext = () => {
        if (!validateStep()) {
            toast.error('Please fill in all required fields before continuing.');
            return;
        }

        if (step < 3) setStep((prev) => prev + 1);
    };

    const handlePrevious = () => {
        if (step > 1) setStep((prev) => prev - 1);
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        // Personal Info
        title: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        extension_name: '',
        civil_status: '',
        date_of_birth: '',
        age: '',
        sex: '',
        citizenship: 'Filipino',
        mobile: '',

        // Account Info (you'll need to define these)
        email: '',

        // Address Info
        country: 'Philippines',
        region_code: '',
        region: '',
        province_code: '',
        province: '',
        town_city_code: '',
        town_city: '',
        barangay_code: '',
        barangay: '',
        state_street_subdivision: '',
        zip_code: '',
    });

    console.log(usePage().props.errors);
    

    const validateStep = (): boolean => {
        switch (step) {
            case 1:
                return (
                    !!data.first_name.trim() && !!data.last_name.trim() && !!data.date_of_birth && !!data.sex && !!data.civil_status && !!data.mobile
                );
            case 2:
                return !!data.email?.trim();
            case 3:
                return (
                    !!data.region_code.trim() &&
                    !!data.province_code.trim() &&
                    !!data.town_city_code.trim() &&
                    !!data.barangay_code.trim() &&
                    !!data.zip_code.trim()
                );
            default:
                return false;
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                toast.success('You have successfully created a new member.');
                reset()
                setStep(1)
            },
            onError: () => {
                toast.error('Something went wrong. Please try again.');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Member" />
            <form onSubmit={handleSubmit} className="p-4">
                {/* Pass step and setStep props */}
                <NewMemberSteps step={step} setStep={setStep} />

                <div className="mt-6">
                    {step === 1 && <PersonalInformation data={data} setData={setData} errors={errors} />}
                    {step === 2 && <AccountInformation data={data} setData={setData} errors={errors} />}
                    {step === 3 && <AddressInformation data={data} setData={setData} errors={errors} />}
                </div>

                <div className="mt-6 flex justify-between">
                    {step === 1 && (
                        <>
                            <div></div>
                            <Button type="button" onClick={handleNext}>
                                Next
                            </Button>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <Button type="button" variant={'ghost'} onClick={handlePrevious}>
                                Previous
                            </Button>
                            <Button type="button" onClick={handleNext}>
                                Next
                            </Button>
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <Button type="button" variant={'ghost'} onClick={handlePrevious}>
                                Previous
                            </Button>
                            <Button type="submit">Save and Finish</Button>
                        </>
                    )}
                </div>
            </form>
        </AppLayout>
    );
};

export default Create;
