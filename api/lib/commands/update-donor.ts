import { injectable, inject } from 'inversify';
import { ObjectID, UpdateWriteOpResult } from 'mongodb';
import { Promise } from 'es6-promise';

import { Command, GetMongoDB } from './';

import { TYPES } from '../types';
import { Donor } from '../models';
import * as _ from 'lodash';

import { EventEmitter } from 'events';

/**
 * UpdateDonor
 */
@injectable()
export class UpdateDonor  implements Command {
    private _getMongoDB: GetMongoDB;
    private _donor: Donor;
    private _emitter: EventEmitter;

    public get donor(): Donor {
        return this._donor;
    }

    public set donor(v: Donor) {
        this._donor = v;
    }

    /**
     *
     */
    constructor( @inject(TYPES.GetMongoDB) getMongoDB: GetMongoDB) {
        this._emitter = new EventEmitter();
        this._getMongoDB = getMongoDB;
    }

    public exec(): Promise<any> {
        if (!this.donor || Object.keys(this.donor).length === 0) {
            return Promise.reject('Donor cannot be undefined or empty.');
        }

        return this._getMongoDB.exec().then(db => {
            let query = { _id: new ObjectID(this.donor._id) };
            let tosave: any = _.omit(this.donor, '_id');

            return db.collection('donors').updateOne(query, tosave)
                .then((value: UpdateWriteOpResult) => {
                    if (value.result.ok) {
                        this._emitter.emit('donor_updated', this.donor);
                        return Promise.resolve(this.donor);
                    }
                    Promise.reject('Donor was not updated.');
                });
        });
    }

    public on(event: string, listener: Function) {
        this._emitter.on(event, listener);
    }
}
