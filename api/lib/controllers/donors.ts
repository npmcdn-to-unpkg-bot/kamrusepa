import { Controller, Get, Post, Delete, Put } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { Promise } from 'es6-promise';

import { TYPES } from '../types';
import { Donor, Account } from '../models';
import { QueryDonors, GetDonor } from '../queries';
import { CreateDonor,
    CreateAccount,
    UpdateDonor,
    DeleteDonor } from '../commands';
import * as shortid from 'shortid';

@injectable()
@Controller('/api/donors')
export class DonorsController {
    private _queryDonors: QueryDonors;
    private _createDonor: CreateDonor;
    private _createAccount: CreateAccount;
    private _updateDonor: UpdateDonor;
    private _deleteDonor: DeleteDonor;
    private _getDonor: GetDonor;

    /**
     *
     */
    constructor( @inject(TYPES.QueryDonors) queryDonors: QueryDonors,
        @inject(TYPES.CreateDonor) createDonor: CreateDonor,
        @inject(TYPES.CreateAccount) createAccount: CreateAccount,
        @inject(TYPES.UpdateDonor) updateDonor: UpdateDonor,
        @inject(TYPES.DeleteDonor) deleteDonor: DeleteDonor,
        @inject(TYPES.GetDonor) getDonor: GetDonor) {

        this._queryDonors = queryDonors;
        this._createDonor = createDonor;
        this._createAccount = createAccount;
        this._updateDonor = updateDonor;
        this._deleteDonor = deleteDonor;
        this._getDonor = getDonor;
    }

    @Get('/:id')
    public get(request: Request) {
        this._getDonor.accountId = (<any>request).user._id;
        this._getDonor.id = request.params.id;

        return this._getDonor.exec();
    }

    @Get('/')
    public query(request: Request, response: Response): Promise<[Donor]> | Response {
        if (!request.query.lat || !request.query.long || !request.query.distance) {
            return response.status(400).send({ message: 'Bad data.' });
        }

        this._queryDonors.coordinates = [parseFloat(request.query.lat), parseFloat(request.query.long)] ;
        this._queryDonors.distance = parseFloat(request.query.distance);

        return this._queryDonors.exec();
    }

    @Post('/')
    public post(request: Request, response: Response): Promise<any> | Response {
        // TODO: Validate body input
        if (!request.body) {
            return response.status(400).send({ message: 'Bad data.' });
        }

        let donor = <Donor>request.body;
        let account = <Account>{
            username: donor.email,
            password: shortid.generate()
        };
        let password = account.password;

        this._createAccount.account = account;
        return this._createAccount.exec().then(savedAccount => {
            donor.account = savedAccount._id.toString();
            this._createDonor.donor = donor;
            return this._createDonor.exec().then(savedDonor => {
                savedDonor.generatedPassword = password;
                return Promise.resolve(savedDonor);
            });
        });
    }

    @Put('/:id')
    public put(request: Request, response: Response): Promise<[Donor]> | Response {
        if (!request.body) {
            return response.status(400).send({ message: 'Bad data.' });
        }

        let donor = <Donor>request.body;

        this._updateDonor.donor = donor;
        return this._updateDonor.exec();
    }

    @Delete('/:id')
    public delete(request: Request, response: Response): Promise<[Donor]> {
         let id = request.params.id;

        this._deleteDonor.donorId = id;
        
        return this._deleteDonor.exec();
    }
}
