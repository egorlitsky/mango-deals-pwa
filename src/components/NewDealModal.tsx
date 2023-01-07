import React, { ChangeEvent, useState } from 'react';
import { formatDiagnosticsWithColorAndContext } from 'typescript';

interface INewDealModalProps {
    onClose: () => void;
}

const MIN_VALUE = 0;
const MAX_VALUE = Math.pow(2, 31) - 1; // SQL int max

const NewDealModal = (props: INewDealModalProps) => {
    const { onClose } = props;
    const [value, setValue] = useState(0);
    const [date] = useState(new Date());

    const onValueChange = (e: ChangeEvent): void => {
        const val = (e?.target as HTMLTextAreaElement)?.value;
        const num = val ? Number.parseFloat(val) : null;

        if (num && num >= MAX_VALUE) {
            setValue(MAX_VALUE);
        } else {
            setValue(Number(num));
        } 
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleString('en-GB', {
            dateStyle: 'medium',
            timeStyle: 'short',
            hour12: false
        }).replace(',', '');
    };

    return (
        <div className="new-deal-modal-container">
            <div className="new-deal-modal-body">
                <h2 className="new-deal-modal-header">Make a New Deal</h2>
                <img
                    className="new-deal-modal-close"
                    src="close.png"
                    alt="Close"
                    onClick={onClose}
                />
                <label className="new-deal-modal-date-label">
                    Current Date
                </label>
                <input
                    className="new-deal-modal-date-input"
                    type="text"
                    disabled
                    value={formatDate(date)}
                ></input>
                <label className="new-deal-modal-value-label">Value</label>
                <input
                    className="new-deal-modal-value-input"
                    type="number"
                    pattern="[0-9]*"
                    step="0.01"
                    min={MIN_VALUE}
                    max={MAX_VALUE}
                    maxLength={10}
                    value={String(value)}
                    onChange={onValueChange}
                ></input>
            </div>
            <div className="new-deal-modal-footer">
                <button className='new-deal-modal-proceed primary-btn'>Proceed</button>
            </div>
        </div>
    );
};

export default NewDealModal;
