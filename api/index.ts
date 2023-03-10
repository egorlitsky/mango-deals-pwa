import express, { Express, Request, Response } from 'express';
import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import { v4 as uuid } from 'uuid';
import bodyParser from 'body-parser';
import _ from 'lodash';

/**
 * Simple web-server, API, and JSON-based DB to operate with mango deals.
 */

interface IDeal {
    id: string;
    value: number;
    date: string;
}

interface IDB {
    deals: IDeal[];
}

const DATA_PAGE_SIZE = 10;

const app: Express = express();
const port = 5000;
app.use(bodyParser.json());
app.listen(port, () => console.log(`Listening on port ${port}`));

const db: LowSync<IDB> = new LowSync<IDB>(new JSONFileSync('db.json'));
db.read();
db.write();

app.get('/deals', (req: Request, res: Response) => {
    db.read();

    // parse the requested page of the data
    const requestedPage = Number.parseInt(req.query.page as string);

    // split the data into pages with DATA_PAGE_SIZE items for each page
    const pagesWithContent = _.chunk(db.data?.deals, DATA_PAGE_SIZE);

    if (_.isEmpty(pagesWithContent)) {
        res.send({ deals: [] });
    } else {
        // the latest data is in the end so let's inverse an index
        const inversedIndex = pagesWithContent.length - requestedPage;
        const index = inversedIndex >= 0 ? inversedIndex : 0;

        res.send({ deals: pagesWithContent[index] });
    }
});

app.post('/deal', (req: Request, res: Response) => {
    if (db && db.data) {
        // generate some ID and push a new instance
        db.data.deals.push({ id: uuid(), ...req.body });
    }

    db.write();
    res.redirect('/');
});

app.delete('/deal/:id', (req: Request, res: Response) => {
    const id = req.params.id;

    if (id && db && db.data) {
        // delete a deal instance by ID
        _.remove(db.data.deals, (deal: IDeal) => deal.id === id);
    }

    db.write();
    res.send();
});
