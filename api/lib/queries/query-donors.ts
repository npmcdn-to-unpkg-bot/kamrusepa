import { injectable, inject } from 'inversify';
import { Db, ObjectID } from 'mongodb';
import { Query } from './';
import { GetMongoDB } from '../commands';

import { Donor } from '../models';

import { TYPES } from '../types';

import { Promise } from 'es6-promise';

@injectable()
export class QueryDonors implements Query<Promise<[Donor]>> {

    private _getMongo: GetMongoDB;
    private _coordinates: [number];
    private _distance: number;

    public get coordinates(): [number] {
        return this._coordinates;
    }
    public set coordinates(v: [number]) {
        this._coordinates = v;
    }

    public get distance(): number {
        return this._distance;
    }
    public set distance(v: number) {
        this._distance = v;
    }

    /**
     *
     */
    constructor( @inject(TYPES.GetMongoDB) getMongo: GetMongoDB) {
        this._getMongo = getMongo;
    }

    public exec(): Promise<[Donor]> {
        return new Promise<[Donor]>((resolver, reject) => {
            this._getMongo.exec().then((db: Db) => {
                let result: [Donor] = <[Donor]>[];

                db.collection('donors').find({
                    "location": {
                        $geoWithin: {
                            $centerSphere: [this.coordinates, this.distance]
                        }
                    }
                }).forEach((item) => {
                    console.log(item);
                    result.push(item);
                }, (err) => {
                    if(err) return reject(err);
                    
                    resolver(result);
                });

            }).catch(reject);
        });
    }
}