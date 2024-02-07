import React, {useState, useEffect} from 'react'
import {Link, useNavigate } from 'react-router-dom'
import { useNotification } from './NotificationContext';

function Summary({date, redirect, showRefresh = false}) {
    const navigate = useNavigate();

    const [summary, setSummary] = useState({})
    const [mostSells, setMostSells] = useState([])
    const [showUzaverka, setShowUzaverka] = useState(false);
    const [missingMoney, setMissingMoney] = useState(0);
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

    const sendUzaverka = (cash, missing) => {
        fetch(`http://localhost:8000/accountant/end/${date}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cash_end: cash,
                missing_money_end: missing
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
        <>
        <div>
            Výpis platný ke dni: {date} {showRefresh && (<Link to={redirect}>Aktualizovat výsledky</Link>)}
            <h1>Denní tržby</h1>
            <ul>
                <li>Celkem prodaných produktů: {summary.product_sold}</li>
                <li>Celkem dokladů: {summary.receipt_count}</li>
                <li>Celkem tržba: {summary.total_income} Kč</li>
                <li>Nákup: {summary.product_bought}x - {summary.product_bought_money} Kč</li>
                <li>Odpis: {summary.product_wasted}x - {summary.product_wasted_money} Kč</li>
                <li>Manko: {summary.missing_money_end} Kč</li>
                <li>V obálce: {summary.cash_end} Kč</li>
            </ul>
            {!summary.ended && !showUzaverka && (<button className="btn btn-warning" onClick={() => setShowUzaverka(true)}>Provést uzávěrku</button>)}
            
            {showUzaverka && (
                <div class="uzaverka">
                    <h1>Uzávěrka</h1>
                    <label for="cash">Peníze v obálce:</label>
                    <input id="cash" type="number" className="form-control" value={cashMoney} onChange={(e) => setCashMoney(e.target.value)} placeholder="Celkem v obálce" />
                    <label for="missing">Manko:</label>
                    <input id="missing" type="number" className="form-control" value={missingMoney} onChange={(e) => setMissingMoney(e.target.value)}  placeholder="Manko" />
                    <button className="btn btn-success" onClick={() => sendUzaverka(cashMoney, missingMoney)}>Uzavřít</button>
                    <button className="btn btn-warning" onClick={() => setShowUzaverka(false)}>Zrušit</button>
                </div>
            )}
            
            <h1>Denní prodej</h1>
            <ul>
                {mostSells.map((product, index) => (
                    <li key={index}>{product.product_name} - {product.count}x - {product.price} Kč</li>
                ))}
            </ul>
        </div>
        </>
    )
}

export default Summary