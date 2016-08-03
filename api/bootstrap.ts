/// <reference path="./node_modules/reflect-metadata/reflect-metadata.d.ts" />
/// <reference path="./node_modules/inversify-dts/inversify/inversify.d.ts" />
/// <reference path="./node_modules/inversify-dts/inversify-express-utils/inversify-express-utils.d.ts" />

import 'reflect-metadata';
import { Controller, TYPE } from 'inversify-express-utils';
import { KernelModule } from 'inversify';

import { GetMongoDB,
    CreateAccount,
    CreateDonor,
    UpdateDonor,
    DeleteDonor,
    LoginUser } from './lib/commands';

import { QueryDonors, GetDonor } from './lib/queries';

import { HomeController,
    DonorsController,
    AccountController } from './lib/controllers';

import { TAGS } from './lib/tags';
import { TYPES } from './lib/types';

import { config } from './config';
import { Config } from './lib/models';

let controllers = new KernelModule((bind) => {
    bind<Controller>(TYPE.Controller).to(HomeController).whenTargetNamed(TAGS.HomeController);
    bind<Controller>(TYPE.Controller).to(DonorsController).whenTargetNamed(TAGS.DonorsController);
    bind<Controller>(TYPE.Controller).to(AccountController).whenTargetNamed(TAGS.AccountController);
});

let queries = new KernelModule((bind) => {
    bind<QueryDonors>(TYPES.QueryDonors).to(QueryDonors);
    bind<GetDonor>(TYPES.GetDonor).to(GetDonor);
});

let commands = new KernelModule((bind) => {
    bind<CreateAccount>(TYPES.CreateAccount).to(CreateAccount);
    bind<CreateDonor>(TYPES.CreateDonor).to(CreateDonor);
    bind<UpdateDonor>(TYPES.UpdateDonor).to(UpdateDonor);
    bind<DeleteDonor>(TYPES.DeleteDonor).to(DeleteDonor);
    bind<LoginUser>(TYPES.LoginUser).to(LoginUser);
});

let infra = new KernelModule((bind) => {
    bind<GetMongoDB>(TYPES.GetMongoDB).to(GetMongoDB);
    bind<Config>(TYPES.Config).toConstantValue(config);
});

export { controllers, queries, commands, infra }
