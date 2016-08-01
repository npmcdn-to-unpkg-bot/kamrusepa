import { Controller, Get, Post, Delete, Put } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { Promise } from 'es6-promise';

import { TYPES } from '../types';
import { Donor } from '../models';
import { QueryDonors } from '../queries';

@injectable()
@Controller('/api/donors')
export class DonorsController {
    private _queryDonors: QueryDonors;

    /**
     *
     */
    constructor( @inject(TYPES.QueryDonors) queryDonors: QueryDonors) {
        this._queryDonors = queryDonors;
    }

    @Get('/:id')
    public get(request: Request) {


    }

    @Get('/')
    public query(request: Request, response: Response): Promise<[Donor]>|Response{
        if (!request.params.coordinates || !request.params.distance)
            return response.status(400).send({ message: 'Bad data.' });

        this._queryDonors.coordinates = request.params.coordinates;
        this._queryDonors.distance = request.params.distance;
        return this._queryDonors.exec();
    }

    @Put('/:id')
    public put(request: Request) {


    }

    @Delete('/:id')
    public delete(request: Request) {


    }
}