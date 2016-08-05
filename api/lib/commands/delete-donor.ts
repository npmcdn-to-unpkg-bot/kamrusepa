import { injectable, inject } from 'inversify';
import { ObjectID, DeleteWriteOpResultObject } from 'mongodb';
import { Promise } from 'es6-promise';

import { Command, GetMongoDB } from './';

import { TYPES } from '../types';

import { EventEmitter } from 'events';

/**
 * CreateDonor
 */
@injectable()
export class DeleteDonor implements Command {
    private _getMongoDB: GetMongoDB;
    private _donorId: string;
    private _emitter: EventEmitter;

    public get donorId(): string {
        return this._donorId;
    }
    public set donorId(v: string) {
        this._donorId = v;
    }

    /**
     *
     */
    constructor( @inject(TYPES.GetMongoDB) getMongoDB: GetMongoDB) {
        this._emitter = new EventEmitter();
        this._getMongoDB = getMongoDB;
    }

    public exec(): Promise<any> {
        if (!this.donorId) {
            return Promise.reject('Donorid cannot be undefined or empty.');
        }

        return this._getMongoDB.exec().then(db => {
            let query = {
                _id: new ObjectID(this.donorId)
            };

            return db.collection('donors').deleteOne(query)
                .then((value: DeleteWriteOpResultObject) => {
    
                    if (value.result.ok) {
                        this._emitter.emit('donor_deleted', {_id: this.donorId});
                        return Promise.resolve(this.donorId);
                    }
                    return Promise.reject(`Cannot delete donor object #${this.donorId}.`);
                });
        });
    }

    public on(event: string, listener: Function) {
        this._emitter.on(event, listener);
    }
}
