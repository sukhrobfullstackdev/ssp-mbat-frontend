import React from 'react';
import {useNavigate} from 'react-router-dom';
import Result from "./Result";

const NotFound = () => {

    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate('/layout');
    };

    return (
        <Result handleClick={handleHomeClick} title={"404"} message={"Сахифа топилмади"}
                description={"The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."}
                btnText={"Асосий ойнага кайтиш"}/>
    );
};

export default NotFound;