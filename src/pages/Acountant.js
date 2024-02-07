import React, {useState} from 'react'
import Summary from "../components/summary";

function Acountant(){
    const [date, setDate] = useState('');
    const [records, setRecords] = useState([])
    const [showStats, setShowStats] = useState(false);

    const dateChooseHandle = () => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/accountant/date/${date}`);
                const jsonData = await response.json();
                setRecords(jsonData);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }

        fetchData();
    }

    return (
        <section className="accountant container">
            <p>Vyberte období: </p>
            <div className="d-flex gap-3">
                <input type="date" className="form-control w-100" value={date} onChange={(e) => setDate(e.target.value)}/>
                <button className="btn btn-primary w-100" onClick={dateChooseHandle}>Vyhledat záznamy</button>
                <button className="btn btn-secondary w-100" onClick={() => setShowStats(!showStats)}>Zobrazit statistiky</button>
            </div>

            {date !== '' && showStats && (<Summary date={date} redirect="/refresh/accountant/" />)}


            <table className="table mt-3 table-striped">
                <thead>
                    <tr>
                        <th>Datum</th>
                        <th>LogID</th>
                        <th>Produkt</th>
                        <th>Cena</th>
                        <th>Akce</th>
                    </tr>
                </thead>
                <tbody>
                    {!records.length && date !== ''&& (
                        <tr>
                            <td colSpan="5">Žádné záznamy ze zadaného data {date}</td>
                        </tr>
                    )}
                    {!records.length && date === '' && (
                        <tr>
                            <td colSpan="5">Vyberte prosím, za které období zobrazit záznamy</td>
                        </tr>
                    )}
            
                    {records.map((record) => (
                        <tr>
                            <td>{record.date}</td>
                            <td>{record.log_id}</td>
                            <td>{record.product_name} (ID: {record.product_id})</td>
                            <td>{record.price} Kč</td>
                            <td>
                                {record.type === 'amount-add' ? `Bylo přidáno +${record.amount} kusů množství k produktu` : ''}
                                {record.type === 'amount-minus' ? `Bylo odebráno -${record.amount} kusů množství k produktu` : ''}
                                {record.type === 'order' ? `Produkt byl prodán, -1 kus množství byl odebrán` : ''}
                                {record.type === 'day-end' ? `Uzávěrka provedena, celkem v obálce bylo ${record.price} Kč, manko bylo ${record.amount} Kč` : ''}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    )
}

export default Acountant