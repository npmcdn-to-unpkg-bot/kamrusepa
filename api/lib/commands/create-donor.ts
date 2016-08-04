import { injectable, inject } from 'inversify';
import { Promise } from 'es6-promise';

import { Command, GetMongoDB } from './';

import { TYPES } from '../types';
import { Donor } from '../models';
import { EventEmitter } from 'events';

/**
 * CreateDonor
 */
@injectable()
export class CreateDonor implements Command {
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
            return db.collection('donors').insert(this.donor)
                .then((value) => {
                    let donor = value && value.ops && 0 < value.ops.length
                        ? value.ops[0]
                        : undefined;

                    this._emitter.emit('donor_created', donor);
                    return Promise.resolve(donor);
                });
        });
    }

    public on(event: string, listener: Function) {
        this._emitter.on(event, listener);
    }
}
