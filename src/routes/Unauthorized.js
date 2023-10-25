import React from 'react';
import {useNavigate} from 'react-router-dom';
import Result from "./Result";

const Unauthorized = () => {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate('/');
    };
    return (
        <Result handleClick={handleHomeClick} title={"401"} message={"Ro'yxatdan o'tilinmagan!"}
                description={""}
                btnText={"Ro'yxatdan o'tish"}/>
    );
};

export default Unauthorized;