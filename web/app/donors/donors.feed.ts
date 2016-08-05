import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { environment } from '../config/environment';
import { Donor } from './';

let url = environment.wsUrl;

export class FeedMessage<T> {
    type: string;
    data: T;
}

@Injectable()
export class DonorsFeed extends Subject<FeedMessage<Donor>> {
    private _ws: any;

    constructor() {
        super();
    }

    start() {
        this._ws = new WebSocket(url);
        this._ws.onopen = () => this.open();
        this._ws.onclose = () => this.close();
        this._ws.onmessage = (m: any) => {
            let json = JSON.parse(m.data);
            this.emit(json);
        };
    }

    open() {
        console.log('Online');
        super.next({ type: 'connected', data: undefined });
    }

    close() {
        console.log('Offline');
        super.next({ type: 'disconnected', data: undefined });
    }

    emit(message: FeedMessage<Donor>) {
        console.log('Message emitted');
        super.next(message);
    }
}
