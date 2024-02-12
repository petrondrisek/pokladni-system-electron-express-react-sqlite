import React, {useEffect, useState, useCallback} from 'react'
import Summary from "../components/summary";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { useUserInfo } from '../components/UserContext';

function Acountant(){
    const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]);
    const [pageRecords, setPageRecords] = useState(1);
    const [records, setRecords] = useState([])
    const [showStats, setShowStats] = useState(false);
    const { date } = useParams();

    /*Vyhledávání v logu*/
    const [toggleSearch, setToggleSearch] = useState(false);
    const [searching, setSearching] = useState(false);
    const [searchType, setSearchType] = useState('');
    const [searchProductId, setSearchProductId] = useState('');
    const [searchProductName, setSearchProductName] = useState('');
    const [searchAmount, setSearchAmount] = useState('');
    const [searchDate, setSearchDate] = useState('');

    const navigate = useNavigate();
    const { isLoggedIn } = useUserInfo();

    useEffect(() => {
        if(!isLoggedIn){
            navigate('/');
            return;
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        if(date){
            setDateInput(date);
        }
    }, [date]);

    const handleInput = (e) => {
        setDateInput(e.target.value);
        setSearching(false);
    }

    const deleteRow = (id) => {
        fetch(`http://localhost:8000/accountant/delete/${id}`, {
            method: 'DELETE',
        }).then((response) => {
            if(response.status === 200){
                setRecords(records.filter(record => record.id !== id));
            } else console.error("Nepodařilo se smazat řádek");
        })
    }

    const handleSearch = useCallback((date, page) => {
        setToggleSearch((prevToggleSearch) => !prevToggleSearch);
    
        let body = {};
        if(searchType !== null) body.type = searchType;
        if(searchProductId !== null) body.product_id = searchProductId;
        if(searchProductName !== null) body.product_name = searchProductName;
        if(searchAmount !== null) body.amount = searchAmount;
        if(searchDate !== null) body.date = searchDate;
        else if(searchDate === '?') body.date = '?';
        else body.date = `${new Date().toISOString().split('T')[0]}`;
    
        try{ 
            fetch(`http://localhost:8000/accountant/search/${date}/${page}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then((response) => {
                if(response.status === 200){
                    return response.json();
                } else throw new Error("Nepodařilo se vyhledávat");
            }).then((data) => {
                setRecords(data);
                setSearching(true);
            })
        } catch(error){
            console.error('Error fetching data: ', error);
        }
    }, [searchType, searchProductId, searchProductName, searchAmount, searchDate, setToggleSearch, setRecords, setSearching]);
    
    useEffect(() => {
        if(searching) {
            handleSearch(dateInput, pageRecords);
        } else {
            const fetchData = async () => {
                try {
                    const response = await fetch(pageRecords ? 
                        `http://localhost:8000/accountant/date/${dateInput}/${pageRecords}` : 
                        `http://localhost:8000/accountant/date/${dateInput}`);
                    const jsonData = await response.json();
                    setRecords(jsonData);
                } catch (error) {
                    console.error('Error fetching data: ', error);
                }
            }
    
            fetchData();
        }
    }, [dateInput, pageRecords, handleSearch, searching]); // fetchData se spustí vždy, když se změní dateInput nebo page


    return (
        <section className="accountant container container--main">
            <p>Vyberte období: </p>
            <div className="d-flex gap-3">
                <input type="date" className="form-control w-100" value={dateInput} onChange={handleInput} />
                <button className="btn btn-secondary w-100" onClick={() => setShowStats(!showStats)}>Zobrazit statistiky</button>
            </div>

            {dateInput !== '' && showStats && (<Summary date={dateInput} redirect={"/refresh/accountant/"+dateInput} />)}


            <h1>Zakončení skladu:</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Datum</th>
                        <th>Produkt</th>
                        <th>Množství</th>
                    </tr>
                </thead>
                <tbody>
                    {!records.length && dateInput !== ''&& (
                        <tr>
                            <td colSpan="3">Žádné záznamy ze zadaného data {dateInput}</td>
                        </tr>
                    )}
                    {!records.length && dateInput === '' && (
                        <tr>
                            <td colSpan="3">Vyberte prosím, za které období zobrazit záznamy</td>
                        </tr>
                    )}
                    {records.map((record) => (
                        record.description !== null && record.type === 'day-end' && 
                        JSON.parse(record.description).map((rec, index) => (
                            <tr key={`${record.date}_${rec.id}_${index}`}>
                                <td>{record.date}</td>
                                <td>{rec.name} (ID: {rec.id})</td>
                                <td>{rec.amount}</td>
                            </tr>
                        ))
                    ))}
                </tbody>
            </table>

            <h1>Akce log:</h1>
            {!(toggleSearch || searching) && (<button className="btn btn-secondary float-right" onClick={() => setToggleSearch(true)}>Zobrazit filtr</button>)}
            
            {(toggleSearch || searching) && (
                <section className="bg-light p-3 position-relative">
                <div className="pt-3">
                    <button type="button" className="btn-close closeAccountFilter" onClick={() => setToggleSearch(false)} aria-label="Close"></button>
                    <label htmlFor="type">Typ záznamu</label>
                    <select id="type" className="form-select" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                        <option value="">Nehledat</option>
                        <option value="order">Nákup</option>
                        <option value="amount-add">Přidání stavu zboží</option>
                        <option value="amount-minus">Odebražení stavu zboží</option>
                        <option value="day-end-purchase">Uzávěrka - nákup</option>
                        <option value="day-end">Uzávěrka</option>
                    </select>

                    <label htmlFor="productID">Produkt ID</label>
                    <input type="number" id="productID" className="form-control" value={searchProductId} onChange={(e) => setSearchProductId(e.target.value)} />

                    <label htmlFor="productName">Název produktu</label>
                    <input type="text" id="productName" className="form-control" value={searchProductName} onChange={(e) => setSearchProductName(e.target.value)} />
                
                    <label htmlFor="amount">Množství</label>
                    <input type="number" id="amount" className="form-control" value={searchAmount} onChange={(e) => setSearchAmount(e.target.value)} />

                    <label htmlFor="date">Datum (pro zobrazení všech dat zadejte ?, formát YYYY-MM-DDTHH-II-SS)</label>
                    <input type="text" id="date" className="form-control" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
                    <button className="btn btn-secondary mt-3" onClick={() => { setPageRecords(1); handleSearch(dateInput, 1); } }>Hledat</button>
                </div>
                </section>
            )}
            
            <table className="table mt-3 table-striped">
                <thead>
                    <tr>
                        <th>Datum</th>
                        <th>LogID</th>
                        <th>Produkt</th>
                        <th>Cena</th>
                        <th>Poznámka</th>
                        <th>Provedeno</th>
                        <th>Akce</th>
                    </tr>
                </thead>
                <tbody>
                    {!records.length && dateInput !== ''&& (
                        <tr>
                            <td colSpan="7">{searching ? 'Ve filtru nenalezeny žádné další záznamy.' : `Žádné záznamy ze zadaného data ${dateInput}`}</td>
                        </tr>
                    )}
                    {!records.length && dateInput === '' && (
                        <tr>
                            <td colSpan="7">Vyberte prosím, za které období zobrazit záznamy</td>
                        </tr>
                    )}
            
                    {records.map((record, index) => (
                        <tr key={index}>
                            <td>{record.date}</td>
                            <td>{record.log_id}</td>
                            <td>{record.product_name} (ID: {record.product_id})</td>
                            <td>{record.price} Kč</td>
                            <td>{record.type !== 'day-end' ? record.description : ''}</td>
                            <td>
                                {record.type === 'amount-add' ? `Bylo přidáno +${record.amount} kusů množství k produktu` : ''}
                                {record.type === 'amount-minus' ? `Bylo odebráno -${record.amount} kusů množství k produktu` : ''}
                                {record.type === 'order' ? `Produkt byl prodán, -1 kus množství byl odebrán` : ''}
                                {record.type === 'day-end-purchase' ? `Uzávěrka provedena, nákup byl ukončen s ${record.price} Kč` : ''}
                                {record.type === 'day-end' ? `Uzávěrka provedena, celkem v hotovosti bylo ${record.price} Kč, platba kartami byla ${record.amount} Kč` : ''}
                            </td>
                            <td><span className="font-weight-bold text-danger cursor-pointer" onClick={() => deleteRow(record.id)}>Smazat</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="d-flex justify-content-between">
                {pageRecords > 1 ? (<button className="btn btn-primary" onClick={() => setPageRecords(parseInt(pageRecords) - 1)}>Předchozí stránka</button>) : <span></span>}
                <span>Aktuální stránka: {pageRecords}</span>
                <button className="btn btn-primary" onClick={() => setPageRecords(parseInt(pageRecords) + 1)}>Další stránka</button>
            </div>
        </section>
    )
}

export default Acountant