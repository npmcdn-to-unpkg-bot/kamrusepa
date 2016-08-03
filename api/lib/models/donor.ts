import { BloodGroup } from './';

export interface Donor {
    _id: string;
    firstName: string;
    lastName: string;
    contactNumber: string;
    email: string;
    bloodGroup: BloodGroup;
    rh: boolean;
    ip: string;
    location: Location;
    account: string;
}

export interface Location {
    type: string;
    coordinates: [number];
}
