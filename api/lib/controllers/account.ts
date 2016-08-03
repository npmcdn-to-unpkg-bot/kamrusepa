import { Controller, Post } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';

import { TYPES } from '../types';
import { Account } from '../models';
import { LoginUser } from '../commands';

@injectable()
@Controller('/api/account')
export class AccountController {
    private _loginUser: LoginUser;
    /**
     *
     */
    constructor(@inject(TYPES.LoginUser) loginUser: LoginUser) {
        this._loginUser = loginUser;
    }

    @Post('/login')
    public login(request: Request, response: Response) {
        this._loginUser.account = <Account>{
            username: request.query.username || request.body.username,
            password: request.query.password || request.body.password,
        }
        this._loginUser.exec()
            .then((token) => response.send(token))
            .catch(err => {
                if (err === 'invalid_user') {
                    return response.status(401).send({ message: 'Invalid credentials.' });
                }
                response.status(502).send(err.message || 'Server error.');
            });
    }
}
