import express from 'express';
import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import { v4 as uuid } from 'uuid';
import bodyParser from 'body-parser';
import _ from 'lodash';
const DATA_PAGE_SIZE = 10;
const app = express();
const port = 5000;
app.use(bodyParser.json());
app.listen(port, () => console.log(`Listening on port ${port}`));
const db = new LowSync(new JSONFileSync('db.json'));
db.read();
db.write();
app.get('/deals', (req, res) => {
    var _a;
    db.read();
    // parse the requested page of the data
    const requestedPage = Number.parseInt(req.query.page);
    // split the data into pages with DATA_PAGE_SIZE items for each page
    const pagesWithContent = _.chunk((_a = db.data) === null || _a === void 0 ? void 0 : _a.deals, DATA_PAGE_SIZE);
    if (_.isEmpty(pagesWithContent)) {
        res.send({ deals: [] });
    }
    else {
        // the latest data is in the end
        const inversedIndex = pagesWithContent.length - requestedPage;
        const index = inversedIndex >= 0 ? inversedIndex : 0;
        res.send({ deals: pagesWithContent[index] });
    }
});
app.post('/deal', (req, res) => {
    if (db && db.data) {
        // generate some ID and push a new instance
        db.data.deals.push(Object.assign({ id: uuid() }, req.body));
    }
    db.write();
    res.redirect('/');
});
app.delete('/deal/:id', (req, res) => {
    const id = req.params.id;
    if (id && db && db.data) {
        // delete a deal instance by ID
        _.remove(db.data.deals, (deal) => deal.id === id);
    }
    db.write();
    res.send();
});
