import { ReactNode } from "react";

export interface Props {
    user: {
        id: number;
        position: string;
        title: string;
        first_name: string;
        middle_name: string;
        last_name: string;
        extension_name: string;
        name: string;
        date_of_birth: Date;
        age: number | string;
        civil_status: string;
        sex: string;
        citizenship: string;
        mobile: string;
        email: string;
        is_loggedin: string;
        role: 'user' | 'admin';
        created_at: Date;
        updated_at: string;
        address: {
            country: string;
            region: string;
            province: string;
            town_city: string;
            barangay: string;
            state_street_subdivision: string;
            zip_code: string;
        };
    };
}
