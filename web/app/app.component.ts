import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { DonorsFeed } from './donors/index';
import { ToasterContainerComponent } from 'angular2-toaster/angular2-toaster';

@Component({
  directives: [ROUTER_DIRECTIVES, ToasterContainerComponent],
  selector: 'my-app',
  templateUrl: './app/app.component.html'
})
export class AppComponent implements OnInit {
  status: string = 'offline';

  constructor(private _donorsFeed: DonorsFeed) { }

  ngOnInit() {
    this.startFeed();
  }

  startFeed() {

    this._donorsFeed.subscribe((message) => {
      if (message.type === 'connected') {
        return this.status = 'online';
      }
      if (message.type === 'disconnected') {
        setTimeout(() => {
          this._donorsFeed.start();
        }, 3000);

        return this.status = 'offline';
      }
    });

    this._donorsFeed.start();
  }
}
