import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { Donor } from './index';

@Component({
  selector: 'donor-saved',
  directives: [ ROUTER_DIRECTIVES ],
  templateUrl: './app/donors/donorsaved.component.html'
})
export class DonorSavedComponent implements OnInit {

  donor: Donor = <Donor>{};
  isOpen: boolean = false;

  constructor() { }

  ngOnInit() { }

   open() {
       this.isOpen = true;
   }

   close() {
       this.isOpen = false;
   }
}
