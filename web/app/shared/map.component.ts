import { Component, ElementRef, Output, EventEmitter } from '@angular/core';
import { MapService } from './map.service';

import MapView from 'esri/views/MapView';
import Point from 'esri/geometry/Point';

@Component({
  selector: 'esri-map',
  template: '<div id="viewDiv" style="height:600px"><ng-content></ng-content></div>',
  providers: [MapService]
})
export class MapComponent {

  @Output()
  viewCreated = new EventEmitter();

  view: MapView;

  constructor(private mapService: MapService, private elementRef: ElementRef) {}

  ngOnInit() {
    this.view = new MapView({
      container: this.elementRef.nativeElement.firstChild,
      map: this.mapService.map,
      center: new Point({
        longitude: -46.722221,
        latitude: -23.496614
      }),
      zoom: 17
    });
    this.view.watch('scale', (newValue, oldValue, propertyName, target) => {
      console.log(propertyName + ' changed from ' + oldValue + ' to ' + newValue);
    });
    this.viewCreated.next(this.view);
    this.view.on('click', (event) => {
      console.log(event.mapPoint);
      alert('Aeeeeeeeeeeee');
    });
    this.view.on('zoom', (event) => {
      console.log(event);
      alert('Resize');
    });
  }
}
