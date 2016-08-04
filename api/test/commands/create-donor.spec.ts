/// <reference path="../../node_modules/typemoq/typemoq.d.ts" />
import 'reflect-metadata';
import * as TypeMoq from 'typemoq';
import { Promise } from 'es6-promise';
import { Db, Server, Collection, InsertOneWriteOpResult, ObjectID } from 'mongodb';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import { CreateDonor, GetMongoDB } from '../../lib/commands';
import { Donor, Location, BloodGroup } from '../../lib/models';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Create donor command', () => {

    let getMongoDb: TypeMoq.Mock<GetMongoDB>;
    let server: TypeMoq.Mock<Server>;
    let db: TypeMoq.Mock<Db>;
    let command: CreateDonor;

    beforeEach(() => {
        getMongoDb = TypeMoq.Mock.ofType(GetMongoDB);
        server = TypeMoq.Mock.ofType(Server, TypeMoq.MockBehavior.Loose, 'localhost', 27017);
        db = TypeMoq.Mock.ofType(Db, TypeMoq.MockBehavior.Loose, 'dbname', server.object);
    });

    describe('When calling exec()', () => {
        let donor: Donor;

        beforeEach(() => {

            donor = <Donor>{
                account: new ObjectID().toHexString(),
                bloodGroup: BloodGroup.A,
                contactNumber: '+55 011981111111',
                email: 'user@mail.com',
                firstName: 'Firstname',
                lastName: 'Lastname',
                ip: '127.0.0.1',
                location: <Location>{
                    type: 'Point',
                    coordinates: [-73.856077, 40.848447]
                }
            };


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

            command = new CreateDonor(getMongoDb.object);
        });

        it('should return donor created', () => {

            command.donor = donor;

            return expect(command.exec()).to.eventually.be.ok;
        });

        it('should have an _id property', () => {

            command.donor = donor;

            return expect(command.exec()).to.eventually.have.property('_id').ok;
        });

        describe('If donor is undefined', () => {

            it('should be rejected', () => {
                donor = undefined;

                command.donor = donor;

                return expect(command.exec()).to.be.rejected;
            });
        });

        describe('If donor is empty', () => {

            it('should be rejected', () => {
                donor = <Donor>{};

                command.donor = donor;

                return expect(command.exec()).to.be.rejected;
            });
        });
    });
});
