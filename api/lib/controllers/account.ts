import { Controller, Get, Post } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';

import { TYPES } from '../types';
import { Config } from '../models';

@injectable()
@Controller('/api/account')
export class AccountController {
    
    /**
     *
     */
    constructor() {
        
    }

    @Post('/login')
    public login(request: Request) {

        
    }
}