import { injectable, inject } from 'inversify';
import { Db, ObjectID } from 'mongodb';
import { Query } from './';
import { GetMongoDB } from '../commands';

import { Donor } from '../models';

import { TYPES } from '../types';

import { Promise } from 'es6-promise';

@injectable()
export class GetDonor implements Query<Promise<Donor>> {

    private _getMongo: GetMongoDB;
    private _id: string;

    public get id(): string {
        return this._id;
    }
    public set id(v: string) {
        this._id = v;
    }

    /**
     *
     */
    constructor( @inject(TYPES.GetMongoDB) getMongo: GetMongoDB) {
        this._getMongo = getMongo;
    }

    public exec(): Promise<Donor> {
        if (!this.id) {
            return Promise.reject('Id cannot be undefined or empty.');
        }
        return new Promise<Donor>((resolver, reject) => {
            this._getMongo.exec().then((db: Db) => {
                let query = {
                    _id: new ObjectID(this.id)
                };
                let donor: Donor = undefined;

                db.collection('donors').find(query).limit(1).forEach((item) => {
                    donor = item;
                }, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolver(donor);
                });

            }).catch(reject);
        });
    }
}