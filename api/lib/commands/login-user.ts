import { injectable, inject } from 'inversify';
import { Promise } from 'es6-promise';

import { Db } from 'mongodb';

import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import * as crypto from "crypto";

import { Command, GetMongoDB } from './';
import { Account, Config } from '../models';
import { TYPES } from '../types';

@injectable()
export class LoginUser implements Command {
    private _getMongoDB: GetMongoDB;
    private _account: Account;
    private _config: Config;

    public get account(): Account {
        return this._account;
    }
    public set account(v: Account) {
        this._account = v;
    }

    /**
     *
     */
    constructor( @inject(TYPES.GetMongoDB) getMongoDB: GetMongoDB,
        @inject(TYPES.Config) config: Config) {
        this._getMongoDB = getMongoDB;
        this._config = config;
    }

    public exec(): Promise<any> {
        if(!this.account || Object.keys(this.account).length === 0) 
            return Promise.reject('Account cannot be undefined or empty.');
            
        return new Promise((resolver, reject) => {
            this._getMongoDB.exec().then((db: Db) => {
                this._account.password = crypto.createHash('sha512')
                    .update(this._account.password)
                    .digest('hex');

                db.collection('users').findOne(this._account).then(user => {
                    if (!user) return reject('invalid_account');
                    jwt.sign(_.omit(user, 'password'),
                        this._config.appSecret,
                        {
                            expiresIn: "2h"
                        }, (err, result) => {
                            resolver(result);
                        });
                }).catch(err => {
                    reject(err);
                });
            });
        });
    }
}