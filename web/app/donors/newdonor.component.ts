import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgFor} from '@angular/common';
import { FORM_DIRECTIVES } from '@angular/forms';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input/input';
import { MdButton } from '@angular2-material/button/button';
import { MdCard } from '@angular2-material/card/card';
import { MdCheckbox } from '@angular2-material/checkbox/checkbox';

import { Donor,
    DonorsService,
    Location,
    DonorSavedComponent } from './index';
import { IpService } from '../shared/index';

@Component({
    selector: 'new-donor',
    templateUrl: './app/donors/newdonor.component.html',
    directives: [
        MdCard,
        MdCheckbox,
        MdButton,
        MD_INPUT_DIRECTIVES,
        FORM_DIRECTIVES,
        NgFor,
        DonorSavedComponent
    ]
})
export class NewDonorComponent implements OnInit {
    @ViewChild(DonorSavedComponent) donorSavedComponent: DonorSavedComponent;
    @Input() coordinates: [number];

    donor: Donor = <Donor>{};
    isOpen: boolean = false;
    errorMessages: [string];


    constructor(private _donorsService: DonorsService,
    private _ipService: IpService) { }

    ngOnInit() { }

    save(form) {
        if (this.isValid(form)) {
            this.donor.location = <Location>{ type: 'Point', coordinates: this.coordinates };

            this._ipService.get().subscribe((ip: string) => {
                this.donor.ip = ip;
                this._donorsService.create(this.donor).subscribe(donor => {
                   this.donorSavedComponent.donor = donor;
                   this.close();
                   this.donorSavedComponent.open();
                }, err => {
                    console.log(err);
                    // TODO: Install toaster and display a message
                });
            });
        }
    }

    isValid(form) {
        this.errorMessages = <[string]>[];
        if (!form.controls.emailAddress.valid) {
           this.errorMessages.push('Email is invalid.');
        }
        if (!form.controls.contactNumber.valid) {
           this.errorMessages.push('Contact Number is invalid. Valid formats: +xx xxx xxxx xxx or 00xx xxx xxxx xxx');
        }
        return !this.errorMessages.length;
    }

    close() {
        this.isOpen = false;
    }

    open() {
        this.errorMessages = <[string]>[];
        this.donor = <Donor>{};
        this.isOpen = true;
    }
}
