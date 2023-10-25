import React from 'react';
import './NotFound.css';
const Result = ({handleClick, title, message, btnText , description}) => {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1 className="not-found-title">{title}</h1>
                <p className="not-found-message">{message}</p>
                <p className="not-found-description">{description}</p>
                <button className="not-found-home-button" onClick={handleClick}>{btnText}</button>
            </div>
        </div>
    );
};

export default Result;