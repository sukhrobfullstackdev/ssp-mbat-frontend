import React, {createContext, useContext, useEffect, useState} from 'react';
import {useAuth} from "../hooks/auth.hook";
import {AuthContext} from "./AuthContext";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
      const auth = useContext(AuthContext);
      const filial = auth.empFilial === "000" ?
          {"paydocTabFilter": [
                  {
                      column: 'filial',
                      operator: '=',
                      value: '000',
                      dataType: 'text',
                  },
              ],
           "paydocAccFilter": [
                  {
                      column: 'filial',
                      operator: '=',
                      value: '000',
                      dataType: 'text',
                  },
              ]
          } : {}

      const [filterValues, setFilterValues] = useState(filial);



    return (
        <FilterContext.Provider value={{ filterValues, setFilterValues }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilter = () => {
    return useContext(FilterContext);
};