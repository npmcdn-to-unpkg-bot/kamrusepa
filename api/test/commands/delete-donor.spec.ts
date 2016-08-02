/// <reference path="../../node_modules/typemoq/typemoq.d.ts" />
import 'reflect-metadata';
import * as TypeMoq from "typemoq";
import { Promise } from 'es6-promise';
import { Db, Server, Collection, DeleteWriteOpResultObject, ObjectID } from "mongodb";
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Kernel } from 'inversify';

import { DeleteDonor, GetMongoDB } from '../../lib/commands';
import { Donor, Location, BloodGroup } from '../../lib/models';
import { TYPES } from '../../lib/types';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Delete donor command', () => {

    let getMongoDb: TypeMoq.Mock<GetMongoDB>;
    let server: TypeMoq.Mock<Server>;
    let db: TypeMoq.Mock<Db>;
    let command: DeleteDonor;

    beforeEach(() => {
        getMongoDb = TypeMoq.Mock.ofType(GetMongoDB);
        server = TypeMoq.Mock.ofType(Server, TypeMoq.MockBehavior.Loose, 'localhost', 27017);
        db = TypeMoq.Mock.ofType(Db, TypeMoq.MockBehavior.Loose, 'dbname', server.object);
    });

    describe('When calling exec()', () => {
        let donorId: string = new ObjectID().toHexString();

        beforeEach(() => {

            let collection = <Collection>{
                deleteOne: (query, param) => {
                    return Promise.resolve(<DeleteWriteOpResultObject>{
                        result: {
                            ok: 1
                        }
                    });
                }
            };

            db.setup(c => c.collection(TypeMoq.It.isAnyString())).returns(() => collection);

            getMongoDb.setup(c => c.exec())
                .returns(() => Promise.resolve(db.object));

            command = new DeleteDonor(getMongoDb.object);
        });

        it('should return donor id', () => {

            command.donorId = donorId;
            
            return expect(command.exec()).to.eventually.be.eq(donorId);
        });

        
        describe('If donorid is undefined', () => {

            it('should be rejected', () => {
                command.donorId = undefined;

                return expect(command.exec()).to.be.rejected;
            });
        });

        describe('If donorid is empty', () => {

            it('should be rejected', () => {
                command.donorId = '';

                return expect(command.exec()).to.be.rejected;
            });
        });
    });
});