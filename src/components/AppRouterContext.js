import React, { createContext, useState, useContext } from 'react'

const AppRouterContext = createContext();

export const AppRouterProvider = ({ children }) => {
    const [productCount, setProductCount] = useState([]);

    const addToProductCount = (item) => {
        const index = productCount.findIndex(product => product.id === item.id);
        const updatedProductCount = index !== -1 ? [...productCount.slice(0, index), item, ...productCount.slice(index + 1)] : [...productCount, item];
        setProductCount(updatedProductCount);
    };

    const getProductCount = (id) => {
        return productCount.find(product => product.id === id) ? productCount.find(product => product.id === id).value : 0;
    }

    const removeAllProductCount = () => {
        setProductCount([]);
    }

    return (
        <AppRouterContext.Provider value={{ getProductCount, addToProductCount, removeAllProductCount }}>
            {children}
        </AppRouterContext.Provider>
    );
};


export const useAppContext = () => useContext(AppRouterContext);