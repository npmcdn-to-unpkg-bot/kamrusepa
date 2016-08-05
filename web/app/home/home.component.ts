import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MapComponent,
    PointsModel } from '../shared/index';

import { ROUTER_DIRECTIVES } from '@angular/router';

import { DonorsService, Donor, NewDonorComponent, DonorsFeed } from '../donors/index';

import Point from 'esri/geometry/Point';
import Graphic from 'esri/Graphic';
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';
import Color from 'esri/Color';

import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
    directives: [MapComponent, NewDonorComponent, ROUTER_DIRECTIVES],
    selector: 'home',
    templateUrl: './app/home/home.component.html'
})
export class HomeComponent implements OnInit, AfterViewInit {

    @ViewChild(MapComponent) mapComponent: MapComponent;
    @ViewChild(NewDonorComponent) newDonorComponent: NewDonorComponent;

    longitude: number = -46.990256;
    latitude: number = -22.979712;
    distance: number = 0.28;

    private defaultSymbol: SimpleMarkerSymbol = new SimpleMarkerSymbol({
        style: 'diamond',
        size: 10,
        color: new Color('#F20F34')
    });

    constructor(private pointsModel: PointsModel,
        private _donorsService: DonorsService,
        private _donorsFeed: DonorsFeed,
        private _toaster: ToasterService) { }

    ngOnInit() {
        this.setMap();
        this.startFeed();
    }

    startFeed() {
        let types = ['donor_created', 'donor_updated', 'donor_deleted'];

        this._donorsFeed.subscribe((message) => {
            if (!message || -1 === types.indexOf(message.type)) { return; }
            switch (message.type) {
                case 'donor_created':
                    return this.addPoint(message.data);
                case 'donor_updated':
                    this.removePoint(message.data);
                    return this.addPoint(message.data);
                case 'donor_deleted':
                    return this.removePoint(message.data);
            }
        });

        this._donorsFeed.start();
    }

    setMap() {
        navigator.geolocation.getCurrentPosition((location) => {
            this.longitude = location.coords.latitude;
            this.latitude = location.coords.longitude;

            this.mapComponent.view.goTo({
                center: [this.latitude, this.longitude]
            });
            this.loadDonors();
        });
    }

    loadDonors() {
        this._donorsService.query(this.latitude, this.latitude, this.distance)
        .subscribe((donors) => {
            donors.forEach((donor: Donor) => {
                this.addPoint(donor);
            });
        }, (err) => {
            console.error(err);
            this._toaster.pop('error', 'Donors Map', 'Failed to get donors data. Cannot contact server.');
        });
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
        <p id="email"><strong>Phone:</strong> ${donor.contactNumber}</p>
        `
            },
            attributes: {
                id: donor._id
            },
            symbol: this.defaultSymbol
        });
        this.pointsModel.addPoint(g);
    }

    removePoint(donor: Donor) {
        this.pointsModel.remove({ id: donor._id });
    }

    ngAfterViewInit() {
        let count = 0;
        this.mapComponent.view.watch('scale', (newValue, oldValue, propertyName, target) => {
            // Do nothing if is zoomin
            if (this.isZoomIn(newValue, oldValue)) { return; }
            if (count < 5) {
                count++;
                return;
            }
            count = 0;
            this.distance += 0.5;
            this.loadDonors();
        });

        this.mapComponent.view.on('click', (event) => {
            let coordinate = <[number]>[event.mapPoint.latitude, event.mapPoint.longitude];

            let point = this.pointsModel.find(event.mapPoint);

            if (point === undefined) {
                this.newDonor(coordinate);
            }
        });
    }

    private isZoomIn(newValue, oldValue): boolean {
        return newValue < oldValue;
    }

    private newDonor(coordinate: [number]) {
        this.newDonorComponent.coordinates = coordinate;
        this.newDonorComponent.open();
    }

    onViewCreated() {
        console.log('View created.');
    }

}
