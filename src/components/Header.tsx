interface IHeaderProps {
    onNewDealButtonClick: () => void;
}

const Header = (props: IHeaderProps) => {
    const {onNewDealButtonClick} = props;
    return (
        <>
            <div className="header-container">
                <img className="header-logo" src="logo.png" alt="logo" />
                <h2 className="header-app-name">Mango Deals</h2>
                <button className="header-button primary-btn" onClick={onNewDealButtonClick}>New Deal</button>
            </div>
        </>
    );
};

export default Header;
