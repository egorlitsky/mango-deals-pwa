import express, { Express, Request, Response } from 'express';
import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import {v4 as uuid} from 'uuid';
import bodyParser from 'body-parser';
import _ from 'lodash';

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
db.read()
db.write()

app.get('/deals', (req: Request, res: Response) => {
    db.read()

    const requestedPage = Number.parseInt(req.query.page as string);
    const pagesWithContent = _.chunk(db.data?.deals, DATA_PAGE_SIZE);

    const inversedIndex = pagesWithContent.length - requestedPage;
    const index = (inversedIndex >= 0) ? inversedIndex : 0;

    res.send({deals: pagesWithContent[index]});
});

app.post('/deal', (req: Request, res: Response) => {
    if (db && db.data) {
        db.data.deals.push({ id: uuid(), ...req.body });
    }
    
    db.write();
    res.redirect('/');
});

app.delete('/deal/:id', (req: Request, res: Response) => {
    console.log(req.params.id);
});
