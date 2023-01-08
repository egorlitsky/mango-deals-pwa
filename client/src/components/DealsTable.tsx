import {ReactElement} from 'react';
import {IDeal} from '../interfaces/DealsInterfaces';
import {deleteDeal} from '../services/DealsService';

interface IDealsTableProps {
    data: IDeal[];
    onDeleteDeal: () => void;
    onRowMouseOver: (id: string) => void;
    onRowMouseLeave: () => void;
}

/**
 * Renders a table with deals. Allows to view, hightlight on a chart (hover event), and delete deals.
 * @param props DealsTable props
 * @returns DealsTable React-element
 */
const DealsTable = (
    props: IDealsTableProps
): ReactElement<IDealsTableProps> => {
    const {data, onDeleteDeal, onRowMouseOver, onRowMouseLeave} = props;

    const formatValue = (value: number): string => {
        return String(Number.parseFloat(`${value}`).toFixed(2));
    };

    const formatDate = (date: Date): string => {
        return date
            .toLocaleString('en-GB', {
                dateStyle: 'medium',
                timeStyle: 'medium',
                hour12: false
            })
            .replace(',', '')
            .replace('at ', '');
    };

    const onDeleteDealClick = async (id: string): Promise<void> => {
        await deleteDeal(id);
        onDeleteDeal();
    };

    return (
        <div className="deals-table">
            <table>
                <thead>
                    <tr>
                        <th>Value</th>
                        <th>Date and time</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((deal: IDeal) => {
                        return (
                            <tr
                                key={deal.id}
                                onMouseOver={() => onRowMouseOver(deal.id)}
                                onMouseLeave={onRowMouseLeave}
                            >
                                <td className="deals-table-value">
                                    {formatValue(deal.value)}
                                </td>
                                <td>
                                    <div className="deals-table-date-container">
                                        <div className="deals-table-date">
                                            {formatDate(deal.date)}
                                        </div>
                                        <img
                                            className="deals-table-delete"
                                            src="delete.png"
                                            alt="Delete"
                                            onClick={() =>
                                                onDeleteDealClick(deal.id)
                                            }
                                        />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default DealsTable;
