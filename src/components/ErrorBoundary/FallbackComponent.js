import React, {useContext, useEffect} from 'react';
import {useNavigate} from "react-router-dom"
import {AuthContext} from "../../context/AuthContext";
import NotFound from "../../routes/NotFound";
import Unauthorized from "../../routes/Unauthorized";

const FallbackComponent = ({error, resetErrorBoundary}) => {
    const navigate = useNavigate();
    const {logout} = useContext(AuthContext);

    useEffect(() => {
        if (error.response?.status === 401) {
            logout();
            navigate('/');
        } else {

        }
    }, [error, navigate, logout]);

    if (error.response?.status === 401) {
        return <Unauthorized/>;
    } else {
        return <NotFound/>;
    }
};

export default FallbackComponent;