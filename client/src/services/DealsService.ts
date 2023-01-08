import {IDeal, IDealFromServer} from '../interfaces/DealsInterfaces';

/**
 * Sends GET-query to fetch deals.
 * @param page number of page to fetch. One page is 10 deals. Page #1 contains the latest data.
 * @returns an array of IDeal instances
 */
export const fetchDeals = async (page: number): Promise<IDeal[]> => {
    const response = await fetch(`/deals?page=${page}`);
    const body = await response.json();

    if (response.status !== 200) {
        throw Error(body.message);
    }

    const processedData: IDeal[] = body.deals?.map((deal: IDealFromServer) => ({
        ...deal,
        date: new Date(JSON.parse(deal.date))
    }));

    return processedData;
};

/**
 * Sends POST-query to add a new deal.
 * @param value value of the deal
 * @param date date of the deal
 */
export const createDeal = async (value: number, date: Date) => {
    await fetch('/deal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            value: value,
            date: JSON.stringify(date)
        })
    });
};

/**
 * Sends a DELETE-qery to delete a deal.
 * @param id id of the deal to delete
 */
export const deleteDeal = async (id: string) => {
    await fetch(`/deal/${id}`, {
        method: 'DELETE'
    });
};
