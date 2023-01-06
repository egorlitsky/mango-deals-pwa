import React from 'react';
import { IDeal } from './interfaces';

interface IDealsTableProps {
    data: IDeal[];
}

const DealsTable = (props: IDealsTableProps) => {
    const { data } = props;

    const formatDate = (date: Date): string => {
        return date.toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'medium',
            hour12: false
        });
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
                    {data?.map((item) => {
                        return (
                            <tr key={item.id}>
                                <td>{item.value}</td>
                                <td>{formatDate(item.date)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default DealsTable;
