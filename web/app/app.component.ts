import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MapComponent,
  PointsModel } from './shared/index';

import { DonorsService, Donor, NewDonorComponent } from './donors/index';

import Point from 'esri/geometry/Point';
import Graphic from 'esri/Graphic';
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';
import Color from 'esri/Color';


@Component({
  directives: [MapComponent, NewDonorComponent],
  selector: 'my-app',
  templateUrl: './app/app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(MapComponent) mapComponent: MapComponent;
  @ViewChild(NewDonorComponent) newDonorComponent: NewDonorComponent;

  longitude: number = -46.990256;
  latitude: number = -22.979712;

  private defaultSymbol: SimpleMarkerSymbol = new SimpleMarkerSymbol({
    style: 'diamond',
    size: 10,
    color: new Color('#F20F34')
  });

  constructor(private pointsModel: PointsModel,
    private _donorsService: DonorsService) { }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((location) => {
      this.longitude = location.coords.latitude;
      this.latitude = location.coords.longitude;

      this.mapComponent.view.goTo({
        center: [this.latitude, this.longitude]
      });

      this._donorsService.query(this.latitude, this.latitude, 4513).subscribe((donors) => {
        donors.forEach((donor: Donor) => {
          this.addPoint(donor);
        });
      });
    });

    let _ws = new WebSocket('ws://localhost:3000');
    _ws.onopen = () => console.log('Connected.');
    _ws.onclose = () => console.log('Disconnected.');
    _ws.onmessage = (m: any) => {
      console.log(m);
      let json = JSON.parse(m.data);
      console.log(json);
    };
  }

  addPoint(donor: Donor) {
    let g = new Graphic({
      geometry: new Point({
        x: donor.location.coordinates[1],
        y: donor.location.coordinates[0],
        spatialReference: 4326
      }),
      popupTemplate: {
        title: `${donor.firstName} ${donor.lastName} is ${donor.bloodGroup}${donor.rh ? '+' : '-'} bloodtype.`,
        content: `
        <p id="email"><strong>Email:</strong> ${donor.email}</p>
        `
      },
      attributes: {
        id: donor._id
      },
      symbol: this.defaultSymbol
    });
    this.pointsModel.addPoint(g);
  }

  ngAfterViewInit() {

    this.mapComponent.view.watch('scale', (newValue, oldValue, propertyName, target) => {
      console.log(propertyName + ' changed from ' + oldValue + ' to ' + newValue);

    });

    this.mapComponent.view.on('click', (event) => {
      let coordinate = <[number]>[event.mapPoint.latitude, event.mapPoint.longitude];

      let point = this.pointsModel.find(event.mapPoint);
      
      if (point === undefined) {
        this.newDonor(coordinate);
      }
    });
  }

  private newDonor(coordinate: [number]) {
    this.newDonorComponent.coordinates = coordinate;
    this.newDonorComponent.open();
  }

  onViewCreated() {

  }
}
