import { Component } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';
import { Auth } from '../shared/auth';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input/input';
import {ToasterService} from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-login',
  templateUrl: './app/login/login.component.html',
  styleUrls: ['./app/login/login.component.css'],
  directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES, CORE_DIRECTIVES, MD_INPUT_DIRECTIVES]
})
export class LoginComponent {

  username: string;
  password: string;
  busy: boolean = false;

  constructor(private _router: Router,
    private _auth: Auth,
    private _toasterService: ToasterService) { }

  login(event) {
    event.preventDefault();
    this.busy = true;
    let user = { username: this.username, password: this.password };
    this._auth.login(user).subscribe(
      response => {
        this.busy = false;
        let id = this._auth.getUser()._id;
        this._router.navigate(['donor', id]);
      },
      err => {
        this.busy = false;
        if (err.status === 401) {
            this._toasterService.pop('warning', 'Login Error', 'Invalid username or password');
        } else {
            this._toasterService.pop('error', 'Login Error', 'Cannot contact server. Try again later.');
        }
      });
  }

  signup(event) {
    event.preventDefault();
    this._router.navigate(['/signup']);
  }

}
