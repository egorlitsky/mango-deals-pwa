import React, {useState} from 'react';

import './App.css';

import Header from './components/Header';
import './styles/Header.css';

import DealsChart from './components/DealsChart';
import './styles/DealsChart.css';

import DealsTable from './components/DealsTable';
import './styles/DealsTable.css';

import Foooter from './components/Footer';
import './styles/Footer.css';

import NewDealModal from './components/NewDealModal';
import './styles/NewDealModal.css';

import { IDeal } from './components/interfaces';
import { DATA_PAGE_SIZE } from './components/constants';

const generatedData: IDeal[] = [];

for (let i = 0; i < 100; i++) {
    generatedData.push({
        id: 'id-' + i,
        date: new Date(),
        value: Math.floor(Math.random() * 100)
    });
}

function App() {
    const data = generatedData.slice(-DATA_PAGE_SIZE);

    const [isModalDisplayed, setIsModalDisplayed] = useState(false);

    return (
        <>
            <div className={isModalDisplayed ? 'blur-bg' : ''}>
                <Header onNewDealButtonClick={() => setIsModalDisplayed(true)} />
                <DealsChart data={data} smoothCurves={true} />
                <DealsTable data={data} />
                <Foooter />
            </div>

            {isModalDisplayed && <NewDealModal onClose={() => setIsModalDisplayed(false)} />}
        </>
    );
}

export default App;
