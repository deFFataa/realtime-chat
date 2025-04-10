import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { toast } from "sonner"
import { Toaster } from '@/components/ui/sonner';

type RegisterForm = {
    first_name: string;
    last_name: string;
    middle_name: string;
    extension_name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        first_name: '',
        last_name: '',
        middle_name: '',
        extension_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [step, setStep] = useState(1); // Track the current step

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const handleNextStep = () => {
        if (!data.first_name || !data.last_name || !data.middle_name) {
            toast.error('Please fill in all required fields.');
            return;
        }
        setStep(2);
    };

    return (
        <AuthSplitLayout title="Create an account" description="Enter your details below to create your account">
            <Toaster />
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-2">
                    {step === 1 && (
                        <div className="grid gap-2">
                            <div>
                                <Label htmlFor="first_name">First Name</Label>
                                <Input
                                    id="first_name"
                                    type="text"
                                    required
                                    autoFocus
                                    autoComplete="first_name"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    disabled={processing}
                                    placeholder="E.g John"
                                />
                                <InputError message={errors.first_name} className="mt-2" />
                            </div>
                            <div>
                                <Label htmlFor="middle_name">Middle Name</Label>
                                <Input
                                    id="middle_name"
                                    type="text"
                                    required
                                    autoComplete="middle_name"
                                    value={data.middle_name}
                                    onChange={(e) => setData('middle_name', e.target.value)}
                                    disabled={processing}
                                    placeholder="E.g Reyes"
                                />
                                <InputError message={errors.middle_name} className="mt-2" />
                            </div>
                            <div>
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input
                                    id="last_name"
                                    type="text"
                                    required
                                    autoComplete="last_name"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    disabled={processing}
                                    placeholder="E.g Bautista"
                                />
                                <InputError message={errors.last_name} className="mt-2" />
                            </div>
                            <div>
                                <Label htmlFor="extension_name">
                                    Extension Name <span className="text-gray-400"> (optional)</span>
                                </Label>
                                <Input
                                    id="extension_name"
                                    type="text"
                                    autoComplete="extension_name"
                                    value={data.extension_name}
                                    onChange={(e) => setData('extension_name', e.target.value)}
                                    disabled={processing}
                                    placeholder="E.g Jr."
                                />
                                <InputError message={errors.extension_name} className="mt-2" />
                            </div>
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="bg-primary font-xl rounded-full p-4 duration-100 ease-in hover:translate-x-2"
                                >
                                    <ArrowRight />
                                </button>
                            </div>
                            <div className="text-muted-foreground text-center text-sm">
                                Already have an account? <TextLink href={route('login')}>Log in</TextLink>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="grid gap-2">
                            <div>
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div>
                                <Label htmlFor="password_confirmation">Confirm password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    disabled={processing}
                                    placeholder="Confirm password"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>
                            <Button type="submit" className="mt-2 w-full" disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Create account
                            </Button>
                            <div className="text-muted-foreground text-center text-sm">
                                Already have an account? <TextLink href={route('login')}>Log in</TextLink>
                            </div>
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="bg-primary font-xl rounded-full p-4 duration-100 ease-in hover:translate-x-2"
                                >
                                    <ArrowLeft />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </AuthSplitLayout>
    );
}
