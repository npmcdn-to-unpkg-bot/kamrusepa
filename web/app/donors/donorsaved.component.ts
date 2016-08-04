import { Component, OnInit } from '@angular/core';

import { Donor } from './index';

@Component({
  selector: 'donor-saved',
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
