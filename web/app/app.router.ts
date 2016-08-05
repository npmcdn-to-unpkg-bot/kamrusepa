import { provideRouter, RouterConfig } from '@angular/router';
import { HomeComponent } from './home/index';
import { DonorComponent } from './donors/index';
import { AuthGuard } from './shared/index';
import { LoginComponent } from './login/index';

export const routes: RouterConfig = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'donor/:id', component: DonorComponent, canActivate: [AuthGuard]  },
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
