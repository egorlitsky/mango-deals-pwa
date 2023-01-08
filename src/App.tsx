import { useEffect, useState } from 'react';
import _ from 'lodash';

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

import { IDeal } from './interfaces/DealsInterfaces';
import { fetchDeals } from './services/DealsService';
import { DEFAULT_PAGE } from './constants/DealsConstants';

function App() {
    const [data, setData] = useState<IDeal[]>([]);
    const [page, setPage] = useState(1);

    const [isModalDisplayed, setIsModalDisplayed] = useState(false);
    const [modalAnimationClassName, setModalAnimationClassName] = useState('');

    const fetchData = (page: number): void => {
        fetchDeals(page).then((res: IDeal[]) => setData(res));
    };

    useEffect(() => {
        fetchData(DEFAULT_PAGE);
    }, []);

    const onNewDealButtonClick = (): void => {
        setModalAnimationClassName('open');
        setIsModalDisplayed(true);
    };

    const onModalClose = async (isNewDealCreate?: boolean): Promise<void> => {
        setModalAnimationClassName('close');
        await new Promise((r) => setTimeout(r, 500));
        setIsModalDisplayed(false);

        if (isNewDealCreate) {
            fetchData(DEFAULT_PAGE);
            setPage(DEFAULT_PAGE);
        }
    };

    const onLoadMoreDataClick = (): void => {
        const nextPage = page + 1;
        fetchDeals(nextPage).then((res: IDeal[]) => {
            
            if (_.isEqual(data, res)) {
                console.warn('We are on the oldest page already');
            } else {
                setData(res);
                setPage(nextPage);
            }
        });
    };

    return (
        <>
            <div className={isModalDisplayed ? 'blur-bg' : ''}>
                <Header onNewDealButtonClick={onNewDealButtonClick} />
                <DealsChart data={data} smoothCurves={true} />
                <DealsTable data={data} />
                <Foooter onLoadMoreDataClick={onLoadMoreDataClick} />
            </div>

            {isModalDisplayed && (
                <NewDealModal
                    className={modalAnimationClassName}
                    onClose={onModalClose}
                />
            )}
        </>
    );
}

export default App;
