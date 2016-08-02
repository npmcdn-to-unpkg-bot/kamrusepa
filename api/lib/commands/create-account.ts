import { injectable, inject } from 'inversify';
import { MongoClient, Server, Db } from 'mongodb';
import { Promise } from 'es6-promise';

import { Command, GetMongoDB } from './';

import { TYPES } from '../types';
import { Account } from '../models';
import * as crypto from 'crypto';

/**
 * CreateAccount
 */
@injectable()
export class CreateAccount implements Command {
    private _getMongoDB: GetMongoDB;
    private _account: Account;

    public get account(): Account {
        return this._account;
    }

    public set account(v: Account) {
        this._account = v;
    }

    /**
     *
     */
    constructor( @inject(TYPES.GetMongoDB) getMongoDB: GetMongoDB) {
        this._getMongoDB = getMongoDB;
    }

    public exec(): Promise<any> {
        if(!this.account || Object.keys(this.account).length === 0)
            return Promise.reject('Account cannot be undefined or empty.');
            
        return this._getMongoDB.exec().then(db => {
            this.encryptPassword();
            return db.collection('accounts').insert(this.account)
                .then((value) => {
                    return Promise.resolve(value && value.ops && 0 < value.ops.length
                        ? value.ops[0]
                        : undefined);
                });
        });
    }

    private encryptPassword() {
        this.account.password = crypto.createHash('sha512').update(this.account.password).digest('hex');
    }
}