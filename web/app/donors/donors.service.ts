import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { AuthHttp } from 'angular2-jwt/angular2-jwt';

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

    constructor(private _http: Http,
    private _authHttp: AuthHttp) { }

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

    public get(id: string) {
        let options = {
            headers: contentHeaders
        };

        return this._authHttp.get(`${url}/${id}`, options).map((response) => <Donor>response.json());
    }

    public update(donor: Donor) {
        let options = {
            headers: contentHeaders
        };

        return this._authHttp.put(`${url}/${donor._id}`, JSON.stringify(donor), options).map((response) => <Donor>response.json());
    }

    public delete(id: string) {
        let options = {
            headers: contentHeaders
        };

        return this._authHttp.delete(`${url}/${id}`, options).map((response) => <string> response.text());
    }
}

