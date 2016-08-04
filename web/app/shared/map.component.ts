import { Component, ElementRef, Output, Input, EventEmitter } from '@angular/core';
import { MapService } from './map.service';

import MapView from 'esri/views/MapView';
import Point from 'esri/geometry/Point';

@Component({
  selector: 'esri-map',
  template: '<div id="viewDiv" style="height:600px"><ng-content></ng-content></div>',
  providers: [MapService]
})
export class MapComponent {
  @Input()
  lat: number;
  @Input()
  long: number;
  @Output()
  viewCreated = new EventEmitter();

  view: MapView;

  constructor(private _mapService: MapService,
    private _elementRef: ElementRef) { }

  ngOnInit() {
      this.view = new MapView({
        container: this._elementRef.nativeElement.firstChild,
        map: this._mapService.map,
        center: new Point({
          longitude: this.long,
          latitude: this.lat
        }),
        zoom: 17
      });

      this.viewCreated.next(this.view);

  }
}
