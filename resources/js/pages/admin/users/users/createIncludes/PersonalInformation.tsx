import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/custom-calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight, LoaderCircle } from 'lucide-react';
import { useState } from 'react';

const PersonalInformation = ({ data, setData, errors } : any) => {

    const [date, setDate] = useState<Date | undefined>(data.date_of_birth ? new Date(data.date_of_birth) : undefined);

    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div className="grid p-4">
            <div className="grid">
                <div className="col-span-2 grid grid-cols-2 gap-2">
                    <div>
                        <Label htmlFor="Title">Title</Label>
                        <Input
                            type="text"
                            id="title"
                            placeholder="E.g Dr., Mr., Ms."
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        <InputError message={errors.title} className="mt-1 text-sm" />
                    </div>
                    <div>
                    </div>
                    <div>
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                            type="text"
                            id="first_name"
                            placeholder=""
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                        />
                        <InputError message={errors.first_name} className="mt-1 text-sm" />
                    </div>
                    <div>
                        <Label htmlFor="middle_name">Middle Name</Label>
                        <Input
                            type="middle_name"
                            id="middle_name"
                            placeholder=""
                            value={data.middle_name}
                            onChange={(e) => setData('middle_name', e.target.value)}
                        />
                        <InputError message={errors.middle_name} className="mt-1 text-sm" />
                    </div>
                    <div>
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                            type="text"
                            id="last_name"
                            placeholder=""
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                        />
                        <InputError message={errors.last_name} className="mt-1 text-sm" />
                    </div>
                    <div>
                        <Label htmlFor="extension_name">
                            Extension Name <span className="text-gray-500">(optional)</span>
                        </Label>
                        <Input
                            type="text"
                            id="extension_name"
                            placeholder="E.g Jr., Sr., II"
                            value={data.extension_name}
                            onChange={(e) => setData('extension_name', e.target.value)}
                        />
                        <InputError message={errors.extension_name} className="mt-1 text-sm" />
                    </div>
                    <div className="">
                        <Label htmlFor="date_of_birth">Date of Birth</Label>
                        <div className="w-full">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        className={cn('w-[inherit] justify-between text-left font-normal', !date && 'text-muted-foreground')}
                                    >
                                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                                        <CalendarIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent side="bottom" align="start" className="w-auto p-3">
                                    <div className="mb-2 flex items-center justify-between px-3">
                                        <button
                                            onClick={() => setMonth((prev) => (prev === 0 ? 11 : prev - 1))}
                                            className="rounded-md p-1 hover:bg-gray-100"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <select
                                            value={month}
                                            onChange={(e) => setMonth(Number(e.target.value))}
                                            className="rounded-md border px-2 py-1 text-sm"
                                        >
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <option key={i} value={i}>
                                                    {format(new Date(2000, i), 'MMMM')}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            value={year}
                                            onChange={(e) => setYear(Number(e.target.value))}
                                            className="rounded-md border px-2 py-1 text-sm"
                                        >
                                            {years.map((yr) => (
                                                <option key={yr} value={yr}>
                                                    {yr}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => setMonth((prev) => (prev === 11 ? 0 : prev + 1))}
                                            className="rounded-md p-1 hover:bg-gray-100"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <Calendar
                                        key={`${year}-${month}`}
                                        mode="single"
                                        selected={date}
                                        onSelect={(day) => {
                                            if (day) {
                                                setDate(day);
                                                setData('date_of_birth', day.toISOString().split('T')[0]);
                                            }
                                        }}
                                        month={new Date(year, month)}
                                        onMonthChange={(newMonth) => setMonth(newMonth.getMonth())}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <InputError message={errors.date_of_birth} className="mt-1 text-sm" />
                    </div>
                    <div>
                        <Label htmlFor="civil_status">Civil Status</Label>
                        <Select value={data.civil_status ?? ''} onValueChange={(value) => setData('civil_status', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose Civil Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="single">Single</SelectItem>
                                    <SelectItem value="married">Married</SelectItem>
                                    <SelectItem value="widowed">Widowed</SelectItem>
                                    <SelectItem value="separated">Separated</SelectItem>
                                    <SelectItem value="divorced">Divorced</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.civil_status} className="mt-1 text-sm" />
                    </div>
                    <div>
                        <Label htmlFor="sex">Sex</Label>
                        <Select value={data.sex ?? ''} onValueChange={(value) => setData('sex', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.sex} className="mt-1 text-sm" />
                    </div>
                    <div>
                        <Label htmlFor="citizenship">Citizenship</Label>
                        <Input
                            type="text"
                            id="citizenship"
                            placeholder=""
                            value={data.citizenship}
                            onChange={(e) => setData('citizenship', e.target.value)}
                            readOnly
                        />
                        <InputError message={errors.citizenship} className="mt-1 text-sm" />
                    </div>
                    <div>
                        <Label htmlFor="mobile">Contact Number</Label>
                        <Input
                            type="text"
                            id="mobile"
                            placeholder="E.g +6939123456789"
                            value={data.mobile}
                            onChange={(e) => setData('mobile', e.target.value)}
                        />
                        <InputError message={errors.mobile} className="mt-1 text-sm" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInformation;
