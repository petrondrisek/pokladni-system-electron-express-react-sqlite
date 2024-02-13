import React, {useState, useEffect} from 'react'
import {Link, useNavigate } from 'react-router-dom'
import { useNotification } from './NotificationContext';

function Summary({date, redirect, showRefresh = false}) {
    const navigate = useNavigate();

    const [summary, setSummary] = useState({})
    const [mostSells, setMostSells] = useState([])
    const [showUzaverka, setShowUzaverka] = useState(false);
    const [cardMoney, setCardMoney] = useState(0);
    const [purchaseMoney, setPurchaseMoney] = useState(0);
    const [cashMoney, setCashMoney] = useState(0);
    const { addNotification } = useNotification();


    useEffect(() => {
        const fetchDataSummary = async () => {
            try {
                const response = await fetch(`http://localhost:8000/accountant/summary/${date}`)
                const jsonData = await response.json()
                setSummary(jsonData)
            } catch (error) {
                console.log(error)
            }
        }

        fetchDataSummary();

        const fetchDataMostSells = async () => {
            try {
                const response = await fetch(`http://localhost:8000/accountant/summary/${date}/product_sold`)
                const jsonData = await response.json()
                setMostSells(jsonData)
            } catch (error) {
                console.log(error)
            }
        }

        fetchDataMostSells();
    }, [date]);

    const sendUzaverka = (cash, card, purchase_price) => {
        fetch(`http://localhost:8000/accountant/end/${date}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cash_end: cash,
                card_end: card,
                purchase_price: purchase_price
            })
        }).then(response => {
            if (response.ok) {
                setShowUzaverka(false);
                navigate("/refresh/dashboard", { replace: true });
                addNotification("Uzávěrka byla odeslána");
            } else {
                console.error('Chyba:', response.statusText, response.status);
            }
        })
    }

    return (
        <div>
            Výpis platný ke dni: {date} {showRefresh && (<Link to={redirect}>Aktualizovat výsledky</Link>)}
            <p className="title">Denní tržby</p>
            <ul>
                <li>Celkem prodaných produktů: {summary.product_sold}</li>
                <li>Celkem dokladů: {summary.receipt_count}</li>
                <li>Celkem tržba: {parseFloat(summary.total_income).toFixed(2)} Kč</li>
                <li>Přidáno zboží: {summary.product_bought}x - {parseFloat(summary.product_bought_money).toFixed(2)} Kč</li>
                <li>Odpis: {summary.product_wasted}x - {parseFloat(summary.product_wasted_money).toFixed(2)} Kč</li>
                <li>Nákup: {summary.purchase_end} Kč</li>
                <li>Platba kartami: {summary.card_end} Kč</li>
                <li>Platba hotovostí: {summary.cash_end} Kč</li>
                <li>Manko: {parseFloat(((summary.card_end ? summary.card_end : 0) + (summary.cash_end ? summary.cash_end : 0)) - summary.total_income).toFixed(2)} Kč</li>
                <li>V obálce: {parseFloat(summary.total_income - summary.card_end - summary.purchase_end).toFixed(2)} Kč</li>
            </ul>
            {!summary.ended && !showUzaverka && (<button className="btn btn-warning" onClick={() => setShowUzaverka(true)}>Provést uzávěrku</button>)}
            
            {showUzaverka && (
                <div class="uzaverka">
                    <p className="title">Uzávěrka</p>
                    <label for="cash">Peníze v hotovosti:</label>
                    <input id="cash" type="number" className="form-control" value={cashMoney} onChange={(e) => setCashMoney(e.target.value)} placeholder="Celkem v obálce" />
                    <label for="card">Placeno kartou:</label>
                    <input id="card" type="number" className="form-control" value={cardMoney} onChange={(e) => setCardMoney(e.target.value)}  placeholder="Placeno kartou" />
                    <label for="purchase">Utraceno za nákupy:</label>
                    <input id="purchase" type="number" className="form-control" value={purchaseMoney} onChange={(e) => setPurchaseMoney(e.target.value)}  placeholder="Utraceno za nákupy" />
                    <button className="btn btn-success" onClick={() => sendUzaverka(cashMoney, cardMoney, purchaseMoney)}>Uzavřít</button>
                    <button className="btn btn-warning" onClick={() => setShowUzaverka(false)}>Zrušit</button>
                </div>
            )}
            
            <p className="title">Denní prodej</p>
            <ul>
                {mostSells.map((product, index) => (
                    <li key={index}>{product.product_name} - {product.count}x - {product.price} Kč</li>
                ))}
            </ul>
        </div>
    )
}

export default Summary