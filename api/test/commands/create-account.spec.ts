/// <reference path="../../node_modules/typemoq/typemoq.d.ts" />
import 'reflect-metadata';
import * as TypeMoq from "typemoq";
import { Promise } from 'es6-promise';
import { Db, Server, Collection, InsertOneWriteOpResult, ObjectID } from "mongodb";
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Kernel } from 'inversify';

import { CreateAccount, GetMongoDB } from '../../lib/commands';
import { Account } from '../../lib/models';
import { TYPES } from '../../lib/types';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Create account command', () => {

    let getMongoDb: TypeMoq.Mock<GetMongoDB>;
    let server: TypeMoq.Mock<Server>;
    let db: TypeMoq.Mock<Db>;
    let command: CreateAccount;

    beforeEach(() => {
        getMongoDb = TypeMoq.Mock.ofType(GetMongoDB);
        server = TypeMoq.Mock.ofType(Server, TypeMoq.MockBehavior.Loose, 'localhost', 27017);
        db = TypeMoq.Mock.ofType(Db, TypeMoq.MockBehavior.Loose, 'dbname', server.object);
    });

    describe('When calling exec()', () => {
        let account: Account;

        beforeEach(() => {

            let collection = <Collection>{
                insert: (param) => {
                    param._id = new ObjectID();
                    return Promise.resolve(<InsertOneWriteOpResult>{
                        ops: [param]
                    });
                }
            };


            db.setup(c => c.collection(TypeMoq.It.isAnyString())).returns(() => collection);

            getMongoDb.setup(c => c.exec())
                .returns(() => Promise.resolve(db.object));

            command = new CreateAccount(getMongoDb.object);
        });

        it('should return account created', () => {
            account = <Account>{
                username: 'user@mail.com',
                password: 'password'
            };

            command.account = account;

            return expect(command.exec()).to.eventually.be.ok;
        });

        it('should encrypt password', () => {
            account = <Account>{
                username: 'user@mail.com',
                password: 'password'
            };

            command.account = account;

            return expect(command.exec()).to.eventually.have.property('password').not.eq(account.password);
        });

        it('should have an _id property', () => {
            account = <Account>{
                username: 'user@mail.com',
                password: 'password'
            };

            command.account = account;

            return expect(command.exec()).to.eventually.have.property('_id').ok;
        });

        describe('If account is undefined', () => {

            it('should be rejected', () => {
                account = undefined;

                command.account = account;

                return expect(command.exec()).to.be.rejected;
            });
        });

        describe('If account is empty', () => {

            it('should be rejected', () => {
                account = <Account>{};

                command.account = account;

                return expect(command.exec()).to.be.rejected;
            });
        });
    });
});