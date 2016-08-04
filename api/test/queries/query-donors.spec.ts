/// <reference path="../../node_modules/typemoq/typemoq.d.ts" />
import 'reflect-metadata';
import * as TypeMoq from 'typemoq';
import { Promise } from 'es6-promise';
import { Db, Server, Collection, Cursor, ObjectID } from 'mongodb';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import { QueryDonors } from '../../lib/queries';
import { GetMongoDB } from '../../lib/commands';
import { Donor, Location, BloodGroup } from '../../lib/models';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Query donors', () => {

    let getMongoDb: TypeMoq.Mock<GetMongoDB>;
    let server: TypeMoq.Mock<Server>;
    let db: TypeMoq.Mock<Db>;
    let query: QueryDonors;

    beforeEach(() => {
        getMongoDb = TypeMoq.Mock.ofType(GetMongoDB);
        server = TypeMoq.Mock.ofType(Server, TypeMoq.MockBehavior.Loose, 'localhost', 27017);
        db = TypeMoq.Mock.ofType(Db, TypeMoq.MockBehavior.Loose, 'dbname', server.object);
    });

    describe('When calling exec()', () => {
        let donor: Donor;

        beforeEach(() => {
            donor = <Donor>{
                _id: new ObjectID().toHexString(),
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
            let cursor = <Cursor>{
                forEach: (iteratorCb, endCb) => {
                    iteratorCb(donor);
                    endCb(undefined);
                }
            }

            let collection = <Collection>{
                find: (q) => cursor
            };

            db.setup(c => c.collection(TypeMoq.It.isAnyString())).returns(() => collection);

            getMongoDb.setup(c => c.exec())
                .returns(() => Promise.resolve(db.object));

            query = new QueryDonors(getMongoDb.object);
        });

        it('should return donors matching the query', () => {

            query.coordinates = [-73.856077, 40.848447];
            query.distance = 5000;

            return expect(query.exec()).to.eventually.have.length(1);
        });

        describe('If there is no donors in desired locations', () => {
            beforeEach(() => {
                let cursor = <Cursor>{
                    forEach: (iteratorCb, endCb) => {
                        endCb(undefined);
                    }
                }

                let collection = <Collection>{
                    find: (q) => cursor
                };

                db = TypeMoq.Mock.ofType(Db, TypeMoq.MockBehavior.Loose, 'dbname', server.object);
                db.setup(c => c.collection(TypeMoq.It.isAnyString())).returns(() => collection);

                getMongoDb = TypeMoq.Mock.ofType(GetMongoDB);
                getMongoDb.setup(c => c.exec())
                    .returns(() => Promise.resolve(db.object));

                query = new QueryDonors(getMongoDb.object);
            });

            it('should return empty array', () => {

                query.coordinates = [23.5505, 46.6333];
                query.distance = 5000;

                return expect(query.exec()).to.eventually.be.empty;
            });
        });

        describe('If coordinates is empty', () => {

            it('should be rejected', () => {

                query.coordinates = <[number]>[];
                query.distance = 5000;

                return expect(query.exec()).to.rejected;
            });
        });

        describe('If coordinates is undefined', () => {

            it('should be rejected', () => {

                query.coordinates = undefined;
                query.distance = 5000;

                return expect(query.exec()).to.rejected;
            });
        });

        describe('If coordinates has only one value', () => {

            it('should be rejected', () => {

                query.coordinates = [23.5505];
                query.distance = 5000;

                return expect(query.exec()).to.rejected;
            });
        });

        describe('If coordinates has more than 2 values', () => {

            it('should be rejected', () => {

                query.coordinates = [23.5505, 46.6333, 46.6333];
                query.distance = 5000;

                return expect(query.exec()).to.rejected;
            });
        });

        describe('If distance is less than 0', () => {

            it('should be rejected', () => {

                query.coordinates = [23.5505, 46.6333];
                query.distance = -1;

                return expect(query.exec()).to.rejected;
            });
        });

        describe('If distance is 0', () => {

            it('should be rejected', () => {

                query.coordinates = [23.5505, 46.6333];
                query.distance = 0;

                return expect(query.exec()).to.rejected;
            });
        });

    });
});
