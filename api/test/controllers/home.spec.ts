/// <reference path="../../node_modules/typemoq/typemoq.d.ts" />
import 'reflect-metadata';
import * as TypeMoq from "typemoq";
import { Promise } from 'es6-promise';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import { HomeController } from '../../lib/controllers';
import { Config } from '../../lib/models';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Home controller', () => { 
    let config: Config = <Config>{
        env: 'Test'
    };
    let controller: HomeController;

    beforeEach(() =>{
        controller = new HomeController(config);
    });

    describe('When calling GET / ', () => {
        it('should return app info json', () => {
            expect(controller.get()).to.be.a('object');
        });

        it('should have env equals Test', () => {
            expect(controller.get()).to.have.property('env').eq('Test');
        });
    });

});

