interface IFooterProps {
    onLoadMoreDataClick: () => void;
}

const Foooter = (props: IFooterProps) => {
    const {onLoadMoreDataClick} = props;

    return (
        <footer className="footer">
            <button className='secondary-btn' onClick={onLoadMoreDataClick}>Load next page</button>
        </footer>
    );
};

export default Foooter;
