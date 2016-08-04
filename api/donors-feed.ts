import { injectable, inject } from 'inversify';
import { CreateDonor, UpdateDonor, DeleteDonor } from './lib/commands';
import { TYPES } from './lib/types';
import * as ws from 'ws';

@injectable()
export class DonorsFeed {
    private _createDonor: CreateDonor;
    private _updateDonor: UpdateDonor;
    private _deleteDonor: DeleteDonor;

    /**
     *
     */
    constructor( @inject(TYPES.CreateDonor) createDonor: CreateDonor,
        @inject(TYPES.UpdateDonor) updateDonor: UpdateDonor,
        @inject(TYPES.DeleteDonor) deleteDonor: DeleteDonor) {
        this._createDonor = createDonor;
        this._updateDonor = updateDonor;
        this._deleteDonor = deleteDonor;
    }

    start(server) {
        let wss = ws.createServer({ server: server });

        wss.on('connection', (client) => {
            console.log('Client connected');

            this._createDonor.on('donor_created', (arg) => {
                console.log(`Donor #${arg._id} was created!`);
                client.send(JSON.stringify({ type: 'donor_created', data: arg }), (err) => console.error(err));
            });
            this._updateDonor.on('donor_updated', (arg) => {
                console.log(`Donor #${arg._id} was updated!`);
                client.send(JSON.stringify({ type: 'donor_updated', data: arg }), (err) => console.error(err));
            });
            this._deleteDonor.on('donor_deleted', (arg) => {
                console.log(`Donor #${arg._id} was deleted!`);
                client.send(JSON.stringify({ type: 'donor_deleted', data: arg }), (err) => console.error(err));
            });
        });
    }
}