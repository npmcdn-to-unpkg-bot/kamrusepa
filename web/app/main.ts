import {bootstrap}    from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS, JSONP_PROVIDERS } from '@angular/http';
import { AUTH_PROVIDERS } from 'angular2-jwt/angular2-jwt';

import {AppComponent} from './app.component';
import { PointsModel, IpService, Auth, AuthGuard } from './shared/index';
import { DonorsService, DonorsFeed } from './donors/index';
import { APP_ROUTER_PROVIDERS } from './app.router';
import 'rxjs/Rx';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import {disableDeprecatedForms, provideForms, FORM_PROVIDERS} from '@angular/forms';


bootstrap(AppComponent, [HTTP_PROVIDERS,
    AUTH_PROVIDERS,
    APP_ROUTER_PROVIDERS,
    JSONP_PROVIDERS,
    disableDeprecatedForms(),
    provideForms(),
    AuthGuard,
    Auth,
    FORM_PROVIDERS,
    PointsModel,
    DonorsService,
    IpService,
    DonorsFeed,
    ToasterService]);
