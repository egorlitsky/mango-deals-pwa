import {ReactElement} from 'react';

interface IFooterProps {
    onLoadMoreDataClick: () => void;
}

/**
 * Renders a footer-container with "Load next page" button onboard.
 * @param props Foooter props
 * @returns Foooter React-element
 */
const Foooter = (props: IFooterProps): ReactElement<IFooterProps> => {
    const {onLoadMoreDataClick} = props;

    return (
        <footer className="footer">
            <button className="secondary-btn" onClick={onLoadMoreDataClick}>
                Load next page
            </button>
        </footer>
    );
};

export default Foooter;
