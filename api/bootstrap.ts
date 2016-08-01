/// <reference path="./node_modules/reflect-metadata/reflect-metadata.d.ts" />
/// <reference path="./node_modules/inversify-dts/inversify/inversify.d.ts" />
/// <reference path="./node_modules/inversify-dts/inversify-express-utils/inversify-express-utils.d.ts" />

import 'reflect-metadata';
import { Controller, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { KernelModule } from 'inversify';

import { GetMongoDB } from './lib/commands';

import { QueryDonors } from './lib/queries';

import { HomeController } from './lib/controllers';

import { TAGS } from './lib/tags';
import { TYPES } from './lib/types';

import { config } from './config';
import { Config } from './lib/models';

let controllers = new KernelModule((bind) => {
    bind<Controller>(TYPE.Controller).to(HomeController).whenTargetNamed(TAGS.HomeController);
});

let queries = new KernelModule((bind) => {
    bind<QueryDonors>(TYPES.QueryDonors).to(QueryDonors);
});

let commands = new KernelModule((bind) => {
    
});

let infra = new KernelModule((bind) => {
    bind<GetMongoDB>(TYPES.GetMongoDB).to(GetMongoDB);
    bind<Config>(TYPES.Config).toConstantValue(config);
});

export { controllers, queries, commands, infra }

