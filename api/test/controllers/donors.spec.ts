/// <reference path="../../node_modules/typemoq/typemoq.d.ts" />
import 'reflect-metadata';
import * as TypeMoq from "typemoq";
import { Promise } from 'es6-promise';
import { Request, Response } from 'express';
import { ObjectID } from 'mongodb';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import { DonorsController } from '../../lib/controllers';
import { QueryDonors } from '../../lib/queries';
import { Donor, BloodGroup, Location } from '../../lib/models';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Donors controller', () => {
    let controller: DonorsController;
    let request: Request;
    let response: Response;
    let queryDonors: TypeMoq.Mock<QueryDonors>;

    describe('When calling GET / ', () => {
        beforeEach(() => {
            let donors: [Donor] = [<Donor>{
                _id: new ObjectID().toHexString(),
                account: 'accountid',
                bloodGroup: BloodGroup.A,
                contactNumber: '+55 011981111111',
                email: 'user@mail.com',
                firstName: 'Firstname',
                lastName: 'Lastname', ip: '127.0.0.1', location: <Location>{ type: 'Point', coordinates: [-73.856077, 40.848447] }
            }]

            request = <Request>{
                params: {
                    coordinates: [-73.856077, 40.848447],
                    distance: 5 / 3963.2
                }
            };
            response = undefined;

            queryDonors = TypeMoq.Mock.ofType(QueryDonors);
            queryDonors.setup(c => c.exec()).returns(() => Promise.resolve(donors));

            controller = new DonorsController(queryDonors.object);
        });

        it('should query donors by geo cordinates', () => {
            return expect(controller.query(request, response)).to.eventually.have.length(1);
        });

        describe('If distance is not informed', () => {
            beforeEach(() => {

                request = <Request>{
                    params: {
                        coordinates: [-73.856077, 40.848447],
                        distance: undefined
                    }
                };

                controller = new DonorsController(undefined);
            });

            it('should return status 400', (done) => {
                response = <Response>{
                    status: (value) => {
                        expect(value).to.be.eq(400);
                        return response;
                    },
                    send: (value) => {
                        done();
                        return response;
                    }
                };
                controller.query(request, response);
            });
        });

         describe('If coordinates is not informed', () => {
            beforeEach(() => {

                request = <Request>{
                    params: {
                        coordinates: undefined,
                        distance: 5 / 3963.2
                    }
                };

                controller = new DonorsController(undefined);
            });

            it('should return status 400', (done) => {
                response = <Response>{
                    status: (value) => {
                        expect(value).to.be.eq(400);
                        return response;
                    },
                    send: (value) => {
                        done();
                        return response;
                    }
                };
                controller.query(request, response);
            });
        });
    });

});

