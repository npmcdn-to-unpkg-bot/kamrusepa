import { Injectable } from '@angular/core';

import Graphic from 'esri/Graphic';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import Collection from 'esri/core/Collection';

@Injectable()
export class PointsModel {
  private points: Collection = new Collection();
  pointsLayer: GraphicsLayer;
  constructor() {
    this.pointsLayer = new GraphicsLayer();
    this.points = this.pointsLayer.graphics;
  }
  addPoint(pointGraphic: Graphic) {
    if (-1 !== this.points.indexOf(pointGraphic)) { return; }
    this.points.add(pointGraphic);
  }

  find(point) {

    let result;
    this.points.forEach((item) => {

      if (this.matchCoordinates(point.latitude,
        point.longitude,
        item.geometry.latitude,
        item.geometry.longitude)) {
        result = item;
      }
    });

    return result;
  }

  remove(query: any) {
    let point = this.points.find((item) => item.attributes.id === query.id);
    this.points.remove(point);
  }

  private toRadians(num: number) {
    return num * Math.PI / 180;
  }


  private matchCoordinates(lat1, lon1, lat2, lon2): boolean {
    let R = 6371; // metres

    let φ1 = this.toRadians(lat1);
    let φ2 = this.toRadians(lat2);
    let Δφ = this.toRadians(lat2 - lat1);
    let Δλ = this.toRadians(lon2 - lon1);

    let a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    let d = R * c;

    return d <= 0.01;
  }

  addPoints(pointsGraphics: Graphic[]) {
    this.points.addMany(pointsGraphics);
  }
  getPointGraphics() {
    return this.points;
  }
  clear() {
    this.points.removeAll();
  }
  getIndexSum() {
    let sum = 0;
    if (this.points !== null) {
      this.points.forEach(p => sum += p.attributes.index);
    }
    return sum;
  }
}
