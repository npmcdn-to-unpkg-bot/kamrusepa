/// <reference path="../../node_modules/typemoq/typemoq.d.ts" />
import 'reflect-metadata';
import * as TypeMoq from 'typemoq';
import { Promise } from 'es6-promise';
import { Db, Server, Collection, ObjectID } from 'mongodb';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import { LoginUser, GetMongoDB } from '../../lib/commands';
import { Config, Account } from '../../lib/models';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Login user command', () => {

    let getMongoDb: TypeMoq.Mock<GetMongoDB>;
    let server: TypeMoq.Mock<Server>;
    let db: TypeMoq.Mock<Db>;

    beforeEach(() => {
        getMongoDb = TypeMoq.Mock.ofType(GetMongoDB);
        server = TypeMoq.Mock.ofType(Server, TypeMoq.MockBehavior.Loose, 'localhost', 27017);
        db = TypeMoq.Mock.ofType(Db, TypeMoq.MockBehavior.Loose, 'dbname', server.object);
    });

    describe('When calling exec()', () => {
        let account: Account;
        let config = <Config>{ appSecret: 'secret' };

        beforeEach(() => {

            let dbUser = {
                _id: new ObjectID(),
                username: 'User Name',
                password: 'sQnzu7wkTrgkQZF+0G1hi5AI3Qmzvv0bXgc5THBqi7mAsdd4Xll27ASbRt9fEyavWi6m0QP9B8lThf+rDKy8hg==',
            };

            let collection = <Collection>{
                findOne: (param) => {
                    return Promise.resolve(dbUser);
                }
            };

            account = <Account>{
                username: 'user@mail.com',
                password: 'password'
            };

            db.setup(c => c.collection(TypeMoq.It.isAnyString())).returns(() => collection);

            getMongoDb.setup(c => c.exec())
                .returns(() => Promise.resolve(db.object));
        });

        it('should return user token', () => {
            let command = new LoginUser(getMongoDb.object, config);
            command.account = account;
            return expect(command.exec()).to.eventually.be.ok;
        });

        describe('If user is undefined', () => {
            it('should throw', () => {
                account = undefined;
                let command = new LoginUser(getMongoDb.object, config)
                command.account = account;
                return expect(command.exec()).to.be.rejected;
            });
        });

         describe('If user is empty', () => {
            it('should throw', () => {
                account = <Account>{};
                let command = new LoginUser(getMongoDb.object, config)
                command.account = account;
                return expect(command.exec()).to.be.rejected;
            });
        });

    });
});
