import { injectable, inject } from 'inversify';
import { MongoClient, Server, Db, ObjectID, DeleteWriteOpResultObject } from 'mongodb';
import { Promise } from 'es6-promise';

import { Command, GetMongoDB } from './';

import { TYPES } from '../types';
import { Donor } from '../models';

/**
 * CreateDonor
 */
@injectable()
export class DeleteDonor implements Command {
    private _getMongoDB: GetMongoDB;
    private _donorId: string;

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
                        return Promise.resolve(this.donorId);
                    }
                    return Promise.reject(`Cannot delete donor object #${this.donorId}.`);
                });
        });
    }
}
