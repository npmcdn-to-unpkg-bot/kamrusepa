import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Kernel } from 'inversify';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as jwt from 'express-jwt';

import { commands, controllers, infra, queries } from './bootstrap';
import { config } from './config';

import { DonorsFeed } from './donors-feed';
import { TYPES } from './lib/types';

import * as http from 'http';

let kernel = new Kernel();
kernel.load(infra, commands, queries, controllers);

let server = new InversifyExpressServer(kernel);

let httpServer = http.createServer();

server.setConfig((app) => {

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(morgan('combined'));
    app.use(cors({
        origin: (origin, callback) => {
            try {
                let ok: boolean = config.originsWhitelist.indexOf(origin) !== -1
                callback(null, ok);
            } catch (e) {
                callback(e, null);
            }

        }
    }));
    app.use(jwt({ secret: config.appSecret })
        .unless({
            path: ['/api/account/login', '/setup', '/',
                {
                    url: '/api/donors',
                    methods: ['GET', 'POST']
                }]
        }));

   let feed: DonorsFeed = kernel.get<DonorsFeed>(TYPES.DonorsFeed);
   feed.start(httpServer);
});

let app = server.build();

httpServer.on('request', app);
httpServer.listen(config.appPort, () => console.log('Server started on ' + httpServer.address().address + ':' + httpServer.address().port));
