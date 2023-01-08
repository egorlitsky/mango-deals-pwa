import { IDeal, IDealFromServer } from "../interfaces/DealsInterfaces";

export const fetchDeals = async (page: number): Promise<IDeal[]> => {
    const response = await fetch(`/deals?page=${page}`);
    const body = await response.json();

    if (response.status !== 200) {
        throw Error(body.message) 
    }

    const processedData: IDeal[] = body.deals?.map((deal: IDealFromServer) => (
        {
            ...deal,
            date: new Date(JSON.parse(deal.date))
        }
    ))

    return processedData;
};

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

export const deleteDeal = async (id: string) => {
    await fetch(`/deal/${id}`, {
        method: 'DELETE'
    });
};

