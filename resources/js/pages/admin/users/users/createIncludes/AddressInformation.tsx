import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface PSGCItem {
    code: string;
    name: string;
}

const AddressInformation = ({ data, setData, errors } : any) => {

    // State for API data
    const [regions, setRegions] = useState<PSGCItem[]>([]);
    const [provinces, setProvinces] = useState<PSGCItem[]>([]);
    const [cities, setCities] = useState<PSGCItem[]>([]);
    const [barangays, setBarangays] = useState<PSGCItem[]>([]);

    // Fetch Regions
    useEffect(() => {
        axios
            .get('https://psgc.gitlab.io/api/regions.json')
            .then((response) => setRegions(response.data))
            .catch((error) => console.error('Error fetching regions:', error));
    }, []);

    // Fetch Provinces when Region is selected
    useEffect(() => {
        if (data.region_code) {
            axios
                .get(`https://psgc.gitlab.io/api/regions/${data.region_code}/provinces.json`)
                .then((response) => setProvinces(response.data))
                .catch((error) => console.error('Error fetching provinces:', error));
        }
    }, [data.region_code]);

    // Fetch Cities when Province is selected
    useEffect(() => {
        if (data.province_code) {
            axios
                .get(`https://psgc.gitlab.io/api/provinces/${data.province_code}/cities-municipalities.json`)
                .then((response) => setCities(response.data))
                .catch((error) => console.error('Error fetching cities:', error));
        }
    }, [data.province_code]);

    // Fetch Barangays when City is selected
    useEffect(() => {
        if (data.town_city_code) {
            axios
                .get(`https://psgc.gitlab.io/api/cities-municipalities/${data.town_city_code}/barangays.json`)
                .then((response) => setBarangays(response.data))
                .catch((error) => console.error('Error fetching barangays:', error));
        }
    }, [data.town_city_code]);

    return (
        <div className="grid py-4">
            <div className="col-span-2 grid grid-cols-2 gap-2 px-4">
                {/* Country */}
                <div>
                    <Label htmlFor="country">Country</Label>
                    <Input type="text" id="country" value={data.country} onChange={(e) => setData('country', e.target.value)} readOnly />
                    <InputError message={errors.country} className="mt-1 text-sm" />
                </div>

                {/* Region */}
                <div>
                    <Label htmlFor="region">Region</Label>
                    <Select
                        value={data.region_code}
                        onValueChange={(value) => {
                            const selected = regions.find((r) => r.code === value);
                            setData('region_code', selected?.code || '');
                            setData('region', selected?.name || '');
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose Region" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {regions.map((region) => (
                                    <SelectItem key={region.code} value={region.code}>
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
                    <Input type="number" id="zip_code" value={data.zip_code} onChange={(e) => setData('zip_code', e.target.value)} />
                    <InputError message={errors.zip_code} className="mt-1 text-sm" />
                </div>
            </div>
        </div>
    );
};

export default AddressInformation;
