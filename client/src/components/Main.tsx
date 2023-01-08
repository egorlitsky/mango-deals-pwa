import {ReactElement, useEffect, useState} from 'react';
import _ from 'lodash';

import Header from './Header';
import DealsChart from './DealsChart';
import DealsTable from './DealsTable';
import Foooter from './Footer';
import NewDealModal from './NewDealModal';

import {IDeal} from '../interfaces/DealsInterfaces';
import {fetchDeals} from '../services/DealsService';
import {DEFAULT_PAGE} from '../constants/DealsConstants';

/**
 * The main component that orchestrates events between child components.
 * @returns Main React-element
 */
const Main = (): ReactElement => {
    const [data, setData] = useState<IDeal[]>([]);
    const [page, setPage] = useState(1);
    const [hoveredDealId, setHoveredDealId] = useState<string>('');

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
                // when no more pages to load
                console.warn('We are on the oldest page already');
            } else {
                // set new date and increase page number
                setData(res);
                setPage(nextPage);
            }
        });
    };

    return (
        <>
            <div className={isModalDisplayed ? 'blur-bg' : ''}>
                <Header onNewDealButtonClick={onNewDealButtonClick} />
                <DealsChart
                    data={data}
                    smoothCurves={false}
                    hoveredDealId={hoveredDealId}
                />
                <DealsTable
                    data={data}
                    onDeleteDeal={() => fetchData(page)}
                    onRowMouseOver={(id: string) => setHoveredDealId(id)}
                    onRowMouseLeave={() => setHoveredDealId('')}
                />
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
};

export default Main;
