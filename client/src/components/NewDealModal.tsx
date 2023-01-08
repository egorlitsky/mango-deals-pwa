import {
    ChangeEvent,
    KeyboardEvent,
    ReactElement,
    ReactNode,
    useState
} from 'react';
import {createDeal} from '../services/DealsService';

interface INewDealModalProps {
    className: string;
    onClose: (isNewDealCreate?: boolean) => void;
}

const MIN_VALUE = 0;
const MAX_VALUE = Math.pow(2, 31) - 1; // max 32-bit number
const VALUE_KEY = 'value';

/**
 * Renders a modal to create a new deal.
 * @param props NewDealModal props
 * @returns NewDealModal React-element
 */
const NewDealModal = (
    props: INewDealModalProps
): ReactElement<INewDealModalProps> => {
    const {className, onClose} = props;

    // get the previously entered value from the Local Storage
    const initialValue =
        Number.parseFloat(localStorage.getItem(VALUE_KEY) || '') || 0;

    const [value, setValue] = useState(initialValue);
    const [date] = useState(new Date());
    const [isCompleted, setIsCompleted] = useState(false);

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
        return date
            .toLocaleString('en-GB', {
                dateStyle: 'medium',
                timeStyle: 'short',
                hour12: false
            })
            .replace(',', '')
            .replace('at ', '');
    };

    const onProceed = async (): Promise<void> => {
        // save the entered value in the Local Storage
        localStorage.setItem(VALUE_KEY, String(value));

        createDeal(value, date).then(async () => {
            setIsCompleted(true);
            setTimeout(() => onClose(true), 1000);
        });
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter') {
            onProceed();
        }
    };

    const renderFields = (): ReactNode => {
        return (
            <>
                <div className="new-deal-modal-body">
                    <h2 className="new-deal-modal-header">Make a New Deal</h2>
                    <img
                        className="new-deal-modal-close"
                        src="close.png"
                        alt="Close"
                        onClick={() => onClose()}
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
                        step="0.1"
                        min={MIN_VALUE}
                        max={MAX_VALUE}
                        maxLength={10}
                        value={String(value)}
                        onChange={onValueChange}
                        onKeyDown={handleKeyDown}
                    ></input>
                </div>
                <div className="new-deal-modal-footer">
                    <button
                        className="new-deal-modal-proceed primary-btn"
                        onClick={onProceed}
                    >
                        Proceed
                    </button>
                </div>
            </>
        );
    };

    const renderSuccessBanner = (): ReactNode => {
        return (
            <div className="new-deal-modal-success-container">
                <img
                    className="new-deal-modal-success-img"
                    src="check.png"
                    alt="Success"
                />
                <h2 className="new-deal-modal-header new-deal-modal-success-text">
                    Your deal was submitted successfully!
                </h2>
            </div>
        );
    };

    return (
        <div className={`new-deal-modal-container ${className}`}>
            {!isCompleted ? renderFields() : renderSuccessBanner()}
        </div>
    );
};

export default NewDealModal;
