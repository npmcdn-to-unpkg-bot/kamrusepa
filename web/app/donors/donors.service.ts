import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';

import { environment } from '../config/environment';
import { contentHeaders } from '../shared/headers';

const url = `${environment.baseUrl}/donors`;

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
    generatedPassword: string;
}

export interface Location {
    type: string;
    coordinates: [number];
}

export enum BloodGroup {
    A, B, AB, O
}


@Injectable()
export class DonorsService {

    constructor(private _http: Http) { }

    public query(lat: number, long: number, distance: number) {
        let params: URLSearchParams = new URLSearchParams();
        params.set('lat', '' + lat);
        params.set('long', '' + long);
        params.set('distance', '' + distance);

        let options = {
            headers: contentHeaders,
            search: params
        };

        return this._http.get(url, options).map((response) => <[Donor]>response.json());
    }

    public create(donor: Donor) {
        let options = {
            headers: contentHeaders
        };

        return this._http.post(url, donor, options).map((response) => <Donor>response.json());
    }
}

