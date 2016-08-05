/// <reference path="../../node_modules/typemoq/typemoq.d.ts" />
import 'reflect-metadata';
import * as TypeMoq from 'typemoq';
import { Promise } from 'es6-promise';
import { Request, Response } from 'express';
import { ObjectID } from 'mongodb';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import { DonorsController } from '../../lib/controllers';
import { QueryDonors, GetDonor } from '../../lib/queries';

import { CreateDonor,
    CreateAccount,
    UpdateDonor,
    DeleteDonor } from '../../lib/commands';

import { Donor,
    BloodGroup,
    Location,
    Account } from '../../lib/models';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Donors controller', () => {
    let controller: DonorsController;
    let request: Request;
    let response: Response;
    let queryDonors: TypeMoq.Mock<QueryDonors>;
    let createDonor: TypeMoq.Mock<CreateDonor>;
    let createAccount: TypeMoq.Mock<CreateAccount>;
    let updateDonor: TypeMoq.Mock<UpdateDonor>;
    let deleteDonor: TypeMoq.Mock<DeleteDonor>;
    let getDonor: TypeMoq.Mock<GetDonor>;

    let instanciateController = () => new DonorsController(queryDonors ? queryDonors.object : undefined,
        createDonor ? createDonor.object : undefined,
        createAccount ? createAccount.object : undefined,
        updateDonor ? updateDonor.object : undefined,
        deleteDonor ? deleteDonor.object : undefined,
        getDonor ? getDonor.object : undefined);

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
                query: {
                    lat: -73.856077,
                    long: 40.848447,
                    distance: 5 / 3963.2
                }
            };
            response = undefined;

            queryDonors = TypeMoq.Mock.ofType(QueryDonors);
            queryDonors.setup(c => c.exec()).returns(() => Promise.resolve(donors));

            controller = instanciateController();
        });

        it('should query donors by geo cordinates', () => {
            return expect(controller.query(request, response)).to.eventually.have.length(1);
        });

        describe('If distance is not informed', () => {
            beforeEach(() => {

                request = <Request>{
                    query: {
                        lat: -73.856077,
                        long: 40.848447,
                        distance: undefined
                    }
                };

                controller = instanciateController();
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
                    query: {
                        distance: 5 / 3963.2
                    }
                };

                controller = instanciateController();
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

    describe('When calling POST / ', () => {
        beforeEach(() => {
            let donor: any = <Donor>{
                bloodGroup: BloodGroup.A,
                contactNumber: '+55 011981111111',
                email: 'user@mail.com',
                firstName: 'Firstname',
                lastName: 'Lastname',
                ip: '127.0.0.1',
                location: <Location>{ type: 'Point', coordinates: [-73.856077, 40.848447] }
            };

            request = <Request>{
                body: donor
            };

            response = undefined;

            createDonor = TypeMoq.Mock.ofType(CreateDonor);
            createDonor.setup(c => c.exec()).returns(() => {
                donor._id = new ObjectID().toHexString();
                donor.account = new ObjectID().toHexString();
                donor.generatedPassword = 'password';
                return Promise.resolve(donor);
            });

            createAccount = TypeMoq.Mock.ofType(CreateAccount);
            createAccount.setup(c => c.exec()).returns(() => Promise.resolve(<Account>{
                _id: new ObjectID().toHexString(),
                username: 'user@mail.com',
                password: 'password'
            }));

            controller = instanciateController();
        });

        it('should return created donor', () => {
            return expect(controller.post(request, response)).to.eventually.be.ok;
        });

        it('should have an account', () => {
            return expect(controller.post(request, response)).to.eventually.have.property('account').ok;
        });

        it('should have an _id', () => {
            return expect(controller.post(request, response)).to.eventually.have.property('_id').ok;
        });

        it('should have generated password', () => {
            return expect(controller.post(request, response)).to.eventually.have.property('generatedPassword').ok;
        });

        describe('If body is not undefined', () => {
            beforeEach(() => {
                request = <Request>{
                    body: undefined
                };

                response = undefined;


                controller = instanciateController();
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
                controller.post(request, response);
            });
        });
    });

    describe('When calling PUT /:id ', () => {
        beforeEach(() => {
            let donor: any = <Donor>{
                _id: new ObjectID().toHexString(),
                bloodGroup: BloodGroup.A,
                contactNumber: '+55 011981111111',
                email: 'user@mail.com',
                firstName: 'Firstname',
                lastName: 'Lastname',
                ip: '127.0.0.1',
                location: <Location>{ type: 'Point', coordinates: [-73.856077, 40.848447] }
            };

            request = <Request>{
                body: donor,
                params: {
                    id: donor._id
                }
            };

            response = undefined;

            updateDonor = TypeMoq.Mock.ofType(UpdateDonor);
            updateDonor.setup(c => c.exec()).returns(() => Promise.resolve(donor))

            controller = instanciateController();
        });

        it('should return updated donor', () => {
            return expect(controller.put(request, response)).to.eventually.be.ok;
        });

        describe('If body is undefined', () => {
            beforeEach(() => {
                request = <Request>{
                    body: undefined
                };

                response = undefined;


                controller = instanciateController();
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
                controller.put(request, response);
            });
        });

    });

    describe('When calling DELETE /:id ', () => {
        let donorId: string = new ObjectID().toHexString();

        beforeEach(() => {

            request = <Request>{
                params: {
                    id: donorId
                }
            };

            response = undefined;
            deleteDonor = TypeMoq.Mock.ofType(DeleteDonor);
            deleteDonor.setup(c => c.exec()).returns(() => Promise.resolve(donorId));

            controller = instanciateController();
        });

        it('should return deleted donorid', () => {
            return expect(controller.delete(request, response)).to.eventually.be.eq(donorId);
        });
    });

    describe('When calling GET /:id ', () => {
        beforeEach(() => {
            let donorId: string = new ObjectID().toHexString();

            request = <any>{
                params: {
                    id: donorId
                },
                user: {
                    _id: new ObjectID()
                }
            };

            let donor: any = <Donor>{
                _id: donorId,
                bloodGroup: BloodGroup.A,
                contactNumber: '+55 011981111111',
                email: 'user@mail.com',
                firstName: 'Firstname',
                lastName: 'Lastname',
                ip: '127.0.0.1',
                location: <Location>{ type: 'Point', coordinates: [-73.856077, 40.848447] }
            };

            response = undefined;

            getDonor = TypeMoq.Mock.ofType(GetDonor);
            getDonor.setup(c => c.exec()).returns(() => Promise.resolve(donor))

            controller = instanciateController();
        });

        it('should return donor', () => {
            return expect(controller.get(request)).to.eventually.be.ok;
        });

        describe('If id does not exist', () => {
            beforeEach(() => {
                let donorId = 'invalid-id';

                request = <any>{
                    params: {
                        id: donorId
                    },
                    user: {
                    _id: new ObjectID()
                    }
                };

                response = undefined;

                getDonor = TypeMoq.Mock.ofType(GetDonor);
                getDonor.setup(c => c.exec()).returns(() => Promise.resolve(undefined))

                controller = instanciateController();
            });

            it('should return undefined', () => {
                return expect(controller.get(request)).to.eventually.be.undefined;
            });
        });
    });
});

