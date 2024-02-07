import React, { createContext, useState, useContext } from 'react'

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartPrice, setCartPrice] = useState(0);

    const addToCart = (item) => {
        setCartItems([...cartItems, item]);
        setCartPrice(cartPrice + item.price);
    };

    const removeFromCart = (index) => {
        const newCartItems = [...cartItems];
        setCartPrice(cartPrice - cartItems[index].price);
        newCartItems.splice(index, 1);
        setCartItems(newCartItems);
    };

    const clearCart = () => {
        setCartItems([]);
        setCartPrice(0);
    };

    return (
        <CartContext.Provider value={{ cartItems, cartPrice, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};


export const useCart = () => useContext(CartContext);