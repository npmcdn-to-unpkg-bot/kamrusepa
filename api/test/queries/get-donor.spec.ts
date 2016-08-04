/// <reference path="../../node_modules/typemoq/typemoq.d.ts" />
import 'reflect-metadata';
import * as TypeMoq from 'typemoq';
import { Promise } from 'es6-promise';
import { Db, Server, Collection, Cursor, ObjectID } from 'mongodb';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import { GetDonor } from '../../lib/queries';
import { GetMongoDB } from '../../lib/commands';
import { Donor, Location, BloodGroup } from '../../lib/models';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Get donor query', () => {

    let getMongoDb: TypeMoq.Mock<GetMongoDB>;
    let server: TypeMoq.Mock<Server>;
    let db: TypeMoq.Mock<Db>;
    let query: GetDonor;

    beforeEach(() => {
        getMongoDb = TypeMoq.Mock.ofType(GetMongoDB);
        server = TypeMoq.Mock.ofType(Server, TypeMoq.MockBehavior.Loose, 'localhost', 27017);
        db = TypeMoq.Mock.ofType(Db, TypeMoq.MockBehavior.Loose, 'dbname', server.object);
    });

    describe('When calling exec()', () => {
        let donorId: string = new ObjectID().toHexString();
        let donor: Donor;

        beforeEach(() => {
            donor = <Donor>{
                _id: donorId,
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
                limit: (size) => {
                    return cursor;
                },
                forEach: (iteratorCb, endCb) => {
                    iteratorCb(donor);
                    endCb(undefined);
                }
            }

            let collection = <Collection>{
                find: (q: any) => cursor
            };

            db.setup(c => c.collection(TypeMoq.It.isAnyString())).returns(() => collection);

            getMongoDb.setup(c => c.exec())
                .returns(() => Promise.resolve(db.object));

            query = new GetDonor(getMongoDb.object);
        });

        it('should return donor by id', () => {

            query.id = donorId;

            return expect(query.exec()).to.eventually.be.eq(donor);
        });


        describe('If donorid is undefined', () => {

            it('should be rejected', () => {
                query.id = undefined;

                return expect(query.exec()).to.be.rejected;
            });
        });

        describe('If donorid is empty', () => {

            it('should be rejected', () => {
                query.id = '';

                return expect(query.exec()).to.be.rejected;
            });
        });
    });
});
