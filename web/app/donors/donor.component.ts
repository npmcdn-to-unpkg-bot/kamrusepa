import { Component, OnInit } from '@angular/core';
import { FORM_DIRECTIVES } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input/input';
import { MdCheckbox } from '@angular2-material/checkbox/checkbox';
import { Donor, DonorsService } from './index';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'donor',
  templateUrl: './app/donors/donor.component.html',
  directives: [MD_INPUT_DIRECTIVES,
    FORM_DIRECTIVES,
    MdCheckbox]
})
export class DonorComponent implements OnInit {

  donor: Donor;
  id: string;
  errorMessages: [string];

  constructor(private _donorsService: DonorsService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _toaster: ToasterService) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.id = params['id'];
      this._donorsService.get(this.id).subscribe((donor) => {
        console.log(donor);
        this.donor = donor;
      }, (err) => {
        if (err.status === 404) {
          this._router.navigate(['login']);
        }
      });
    });
  }

  save(form) {
    if (this.isValid(form)) {
      this._donorsService.update(this.donor).subscribe(donor => {
        this._toaster.pop('success', 'Donor Profile', 'Successfully saved!');
      }, err => {
        console.log(err);
        this._toaster.pop('error', 'Donor Profile', 'Your changes were not saved. Failed to contact server.');
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

  delete() {
    this._donorsService.delete(this.donor._id).subscribe((id) => {
      if (id === this.donor._id) {
        this._toaster.pop('success', 'Donor Profile', 'Successfully deleted!');
      }
    }, err => {
     console.error(err);
     this._toaster.pop('error', 'Donor Profile', 'Profile not deleted. Failed to contact server.');
    });
  }
}
