import React, {useState} from 'react';
import { useCart } from './CartContext';
import {useNavigate} from "react-router-dom";
import { useNotification } from './NotificationContext';
import { getFileUrl } from './uploadFile';

function Cart() {
    const navigate = useNavigate();
    const { cartItems, cartPrice, removeFromCart, clearCart } = useCart();
    const [cartOpen, setCartOpen] = useState(false);
    const { addNotification } = useNotification();

    const sendCart = (items) => {
        try {
            fetch('http://localhost:8000/order/add', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({items: items})
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Chyba přidávání objednávky: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                /*Znovu načtení kvůli skladovým zásobám*/
                navigate("/refresh/dashboard", { replace: true });
                clearCart();
                setCartOpen(false);
                addNotification("Objednávka úspěšně zpracována.")
                console.log("Odpověď ze serveru:", data);
            })
            .catch(error => {
                console.error('Chyba:', error.message);
            });
        } catch (error) {
            console.error('Chyba:', error.message);
        }
    };

    return (
        <>
        {!cartOpen && (<div className="cartOpen" onClick={() => setCartOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/></svg>
        </div>)}
        <div className={cartOpen ? "cart show" : "cart hidden"}>
            <div className="cartClose" onClick={() => setCartOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </div>
            <h2>Košík</h2>
            <ul>
                {cartItems.map((item, index) => (
                    <li key={index}>
                        {item.image && <img src={ getFileUrl(item.image) } height="50" alt={item.name} className="item-image" />}
                        {!item.image && <svg xmlns="http://www.w3.org/2000/svg" height="50" viewBox="0 -960 960 960" width="50"><path d="M160-120v-80h640v80H160Zm160-160q-66 0-113-47t-47-113v-400h640q33 0 56.5 23.5T880-760v120q0 33-23.5 56.5T800-560h-80v120q0 66-47 113t-113 47H320Zm0-80h240q33 0 56.5-23.5T640-440v-320H240v320q0 33 23.5 56.5T320-360Zm400-280h80v-120h-80v120ZM320-360h-80 400-320Z"></path></svg>}
                        <strong>{item.name}</strong>
                        <span className="item-price">{item.price} Kč</span>
                        <button className="btn btn-danger ml-3" onClick={() => removeFromCart(index)}>&times;</button>
                    </li>
                ))}
            </ul>

            <p className="title">Celkem: {cartPrice.toFixed(2)} Kč</p>
            <div className="d-flex justify-content-between">
                <button className="btn btn-success" onClick={() => sendCart(cartItems)}>Odeslat objednávku</button>
                <button className="btn btn-warning" onClick={clearCart}>Vyprázdnit košík</button>
            </div>
        </div>
        </>
    );
}

export default Cart;