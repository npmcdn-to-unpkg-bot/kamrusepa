import { Controller, Get } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';

import { TYPES } from '../types';
import { Config } from '../models';

@injectable()
@Controller('/')
export class HomeController {
    private _config:Config; 

    /**
     *
     */
    constructor(@inject(TYPES.Config) config: Config) {
        this._config = config;
    }

     @Get('/')
    public get(): any {

        return {
            "version": "1.0.0",
            "name": "kamrusepa-api",
            "env": this._config.env
        };
    }
}