import { Injectable } from '@angular/core';

import { Jsonp, URLSearchParams } from '@angular/http';
import { environment } from '../config/environment';
import { Observable } from 'rxjs';

@Injectable()
export class IpService {
  constructor(private _http: Jsonp) {}

  get() {
       let params = new URLSearchParams();
        params.set('callback', 'JSONP_CALLBACK');
        params.set('format', 'jsonp');

      return this._http.get(environment.externalIp, { search: params })
      .map(response => {
          return <string>response.json();
        });
  }

}
