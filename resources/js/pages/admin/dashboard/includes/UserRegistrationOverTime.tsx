import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { WhenVisible } from '@inertiajs/react';
import { format, subDays } from 'date-fns';
import { useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Props {
    all_users: any[];
}

const UserRegistrationOverTime = ({ all_users }: Props) => {
    const [timeRange, setTimeRange] = useState('7d');

    const transformedData = all_users.reduce((acc: any[], user: any) => {
        const date = format(new Date(user.created_at), 'MM-dd-yyyy');

        const existingEntry = acc.find((entry) => entry.date === date);
        if (existingEntry) {
            existingEntry.users += 1;
        } else {
            acc.push({ date, users: 1 });
        }

        return acc;
    }, []);

    transformedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const filterDate = (days: number) => {
        const cutoffDate = subDays(new Date(), days);
        return transformedData.filter((entry) => new Date(entry.date) >= cutoffDate);
    };

    const filteredData = timeRange === '30d' ? filterDate(30) : timeRange === '7d' ? filterDate(7) : filterDate(90);

    return (
        // <WhenVisible
        //     data="filteredData"
        //     fallback={
        //         <div className="bg-background h-[500px] rounded-md">
        //             <div className="flex w-full items-center p-4">
        //                 <div className="w-full space-y-2">
        //                     <Skeleton className="h-[430px] w-full" />
        //                     <Skeleton className="h-4 w-full" />
        //                 </div>
        //             </div>
        //         </div>
        //     }
        // >
            <div>
                <Card className='h-full'>
                    <CardHeader>
                        <div className="flex justify-between">
                            <CardTitle>User Registrations Over Time</CardTitle>
                            {filteredData.length > 0 && (
                                <div>
                                    <Select value={timeRange} onValueChange={setTimeRange}>
                                        <SelectTrigger className="rounded-lg">
                                            <SelectValue placeholder="Last 3 months" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="90d">Last 3 months</SelectItem>
                                            <SelectItem value="30d">Last 30 days</SelectItem>
                                            <SelectItem value="7d">Last 7 days</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredData.length === 0 && (
                            <div className="flex h-100 items-center justify-center text-sm text-gray-500">
                                Chart will be displayed here when new users register.
                            </div>
                        )}
                        {filteredData.length > 0 && (
                            <ResponsiveContainer width="100%" height={392}>
                                <LineChart data={filteredData} className="text-gray-700">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis className="text-gray-500" dataKey="date" tickFormatter={(value) => format(new Date(value), 'MMM dd')} />
                                    <YAxis />
                                    <Tooltip />
                                    <Line dataKey="users" stroke="#2563eb" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        // </WhenVisible>
    );
};

export default UserRegistrationOverTime;
