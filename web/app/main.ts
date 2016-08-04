import {bootstrap}    from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS, JSONP_PROVIDERS } from '@angular/http';

import {AppComponent} from './app.component';
import { PointsModel, IpService } from './shared/index';
import { DonorsService } from './donors/index';
import 'rxjs/Rx';

import {disableDeprecatedForms, provideForms, FORM_PROVIDERS} from '@angular/forms';


bootstrap(AppComponent, [HTTP_PROVIDERS,
    JSONP_PROVIDERS,
    disableDeprecatedForms(),
    provideForms(),
    FORM_PROVIDERS,
    PointsModel,
    DonorsService,
    IpService]);
