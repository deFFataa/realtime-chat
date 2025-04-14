import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Props } from '@/types/ManageUser';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface PSGCItem {
    code: string;
    name: string;
}

const AddressInformation = ({ user }: Props) => {
    const { data, setData, post, processing, errors } = useForm({
        country: user.address.country || 'Philippines',
        region_code: '',
        region: user.address.region || '',
        province_code: '',
        province: user.address.province || '',
        town_city_code: '',
        town_city: user.address.town_city || '',
        barangay_code: '',
        barangay: user.address.barangay || '',
        state_street_subdivision: user.address.state_street_subdivision || '',
        zip_code: user.address.zip_code || '',
    });

    const [regions, setRegions] = useState<PSGCItem[]>([]);
    const [provinces, setProvinces] = useState<PSGCItem[]>([]);
    const [cities, setCities] = useState<PSGCItem[]>([]);
    const [barangays, setBarangays] = useState<PSGCItem[]>([]);

    // Fetch Regions
    useEffect(() => {
        axios
            .get('https://psgc.gitlab.io/api/regions.json')
            .then((response) => setRegions(response.data))
            .catch((error) => console.error('Error loading regions:', error));
    }, []);

    // Set region_code from region name
    useEffect(() => {
        if (data.region && regions.length) {
            const match = regions.find((r) => r.name === data.region);
            if (match) setData('region_code', match.code);
        }
    }, [regions]);

    // Fetch Provinces when region_code is selected
    useEffect(() => {
        if (data.region_code) {
            axios
                .get(`https://psgc.gitlab.io/api/regions/${data.region_code}/provinces.json`)
                .then((response) => setProvinces(response.data))
                .catch((error) => console.error('Error fetching provinces:', error));
        }
    }, [data.region_code]);

    // Set province_code from province name
    useEffect(() => {
        if (data.province && provinces.length) {
            const match = provinces.find((p) => p.name === data.province);
            if (match) setData('province_code', match.code);
        }
    }, [provinces]);

    // Fetch Cities when province_code is selected
    useEffect(() => {
        if (data.province_code) {
            axios
                .get(`https://psgc.gitlab.io/api/provinces/${data.province_code}/cities-municipalities.json`)
                .then((response) => setCities(response.data))
                .catch((error) => console.error('Error fetching cities:', error));
        }
    }, [data.province_code]);

    // Set town_city_code from town_city name
    useEffect(() => {
        if (data.town_city && cities.length) {
            const match = cities.find((c) => c.name === data.town_city);
            if (match) setData('town_city_code', match.code);
        }
    }, [cities]);

    // Fetch Barangays when town_city_code is selected
    useEffect(() => {
        if (data.town_city_code) {
            axios
                .get(`https://psgc.gitlab.io/api/cities-municipalities/${data.town_city_code}/barangays.json`)
                .then((response) => setBarangays(response.data))
                .catch((error) => console.error('Error fetching barangays:', error));
        }
    }, [data.town_city_code]);

    // Set barangay_code from barangay name
    useEffect(() => {
        if (data.barangay && barangays.length) {
            const match = barangays.find((b) => b.name === data.barangay);
            if (match) setData('barangay_code', match.code);
        }
    }, [barangays]);

    const saveAddressInformation = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('admin.users.update-admin-address-information', user.id), {
            onSuccess: () => toast.success('Saved Successfully!'),
            onError: () => toast.error('Failed to save!'),
            preserveScroll: true,
        });
    };

    return (
        <div className="grid grid-cols-3 py-4">
            <div className="px-4">
                <h1 className="font-semibold">Address Information</h1>
                <p className="text-muted-foreground text-sm">Edit user's address</p>
            </div>
            <form onSubmit={saveAddressInformation} className="col-span-2 grid grid-cols-2 gap-2 px-4">
                {/* Country */}
                <div>
                    <Label htmlFor="country">Country</Label>
                    <Input type="text" id="country" value={data.country} readOnly />
                    <InputError message={errors.country} className="mt-1 text-sm" />
                </div>

                {/* Region */}
                <div>
                    <Label htmlFor="region">Region</Label>
                    <Select
                        value={data.region}
                        onValueChange={(value) => {
                            const selected = regions.find((r) => r.name === value);
                            setData('region', selected?.name || '');
                            setData('region_code', selected?.code || '');
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose Region" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {regions.map((region) => (
                                    <SelectItem key={region.code} value={region.name}>
                                        {region.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.region} className="mt-1 text-sm" />
                </div>

                {/* Province */}
                <div>
                    <Label htmlFor="province">Province</Label>
                    <Select
                        value={data.province_code}
                        onValueChange={(value) => {
                            const selected = provinces.find((p) => p.code === value);
                            setData('province_code', selected?.code || '');
                            setData('province', selected?.name || '');
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose Province" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {provinces.map((province) => (
                                    <SelectItem key={province.code} value={province.code}>
                                        {province.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.province} className="mt-1 text-sm" />
                </div>

                {/* Town/City */}
                <div>
                    <Label htmlFor="town_city">Town / City</Label>
                    <Select
                        value={data.town_city_code}
                        onValueChange={(value) => {
                            const selected = cities.find((tc) => tc.code === value);
                            setData('town_city_code', selected?.code || '');
                            setData('town_city', selected?.name || '');
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose Town or City" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {cities.map((city) => (
                                    <SelectItem key={city.code} value={city.code}>
                                        {city.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.town_city} className="mt-1 text-sm" />
                </div>

                {/* Barangay */}
                <div>
                    <Label htmlFor="barangay">Barangay</Label>
                    <Select
                        value={data.barangay_code}
                        onValueChange={(value) => {
                            const selected = barangays.find((b) => b.code === value);
                            setData('barangay_code', selected?.code || '');
                            setData('barangay', selected?.name || '');
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose Barangay" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {barangays.map((barangay) => (
                                    <SelectItem key={barangay.code} value={barangay.code}>
                                        {barangay.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.barangay} className="mt-1 text-sm" />
                </div>

                {/* Street */}
                <div>
                    <Label htmlFor="state_street_subdivision">
                        State/Street/Subdivision <span className="text-gray-500">(optional)</span>
                    </Label>
                    <Input
                        type="text"
                        id="state_street_subdivision"
                        value={data.state_street_subdivision}
                        onChange={(e) => setData('state_street_subdivision', e.target.value)}
                    />
                    <InputError message={errors.state_street_subdivision} className="mt-1 text-sm" />
                </div>

                {/* Zip Code */}
                <div>
                    <Label htmlFor="zip_code">Zip Code</Label>
                    <Input
                        type="number"
                        id="zip_code"
                        value={data.zip_code}
                        onChange={(e) => setData('zip_code', e.target.value)}
                    />
                    <InputError message={errors.zip_code} className="mt-1 text-sm" />
                </div>

                <div className="col-span-2 text-end">
                    <Button type="submit" disabled={processing}>
                        {processing ? (
                            <div className="flex gap-1">
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                Saving...
                            </div>
                        ) : (
                            'Save'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddressInformation;
