import React from 'react';

const Header = () => {
    return (
        <>
            <div className="header-container">
                <img className="header-logo" src="logo.png" alt="logo" />
                <h2 className="header-app-name">Mango Deals</h2>
                <button className="header-button">New Deal</button>
            </div>
        </>
    );
};

export default Header;
