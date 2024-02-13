import React, {useState, useEffect} from 'react'
import { useCart } from './CartContext';
import { useNotification } from './NotificationContext';
import { getFileUrl } from './uploadFile';
import { Modal, Button } from 'react-bootstrap'
import DateTime from './DateTime';

function ProductsInCategory({category, search = ''}) {
    const [products, setProducts] = useState([]);
    const { addToCart } = useCart();
    const [isEnded, setIsEnded] = useState(false);
    const { addNotification } = useNotification();

    /*Modals*/
    const [addShow, setAddShow] = useState(false);
    const [addProductId, setAddProductId] = useState(null);
    const [addReason, setAddReason] = useState('');
    const [addAmount, setAddAmount] = useState(1);
    const handleAddClose = () => setAddShow(false);
    const handleAddShow = () => setAddShow(true);

    const [minusShow, setMinusShow] = useState(false);
    const [minusProductId, setMinusProductId] = useState(null);
    const [minusReason, setMinusReason] = useState('');
    const [minusAmount, setMinusAmount] = useState(1);
    const handleMinusClose = () => setMinusShow(false);
    const handleMinusShow = () => setMinusShow(true);

    useEffect(() => {
        const isEndedFetch = async () => {
            try {
                const response = await fetch(`http://localhost:8000/accountant/is-ended/${DateTime.getDate()}`);
                const jsonData = await response.json();
                setIsEnded(jsonData);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }

        isEndedFetch();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = category ? `http://localhost:8000/product/category/${category}` : `http://localhost:8000/product`;

                const body = search ? JSON.stringify({ "search": search }) : undefined;

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: body 
                });
                
                const jsonData = await response.json();

                setProducts(jsonData);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }
        
        fetchData();
    }, [category, search]) //use Effect závisí na category

    const handleClickAdd = (item) => {
        setAddProductId(item.id);
        handleAddShow();
    }

    const handleClickMinus = (item) => {
        setMinusProductId(item.id);
        handleMinusShow();
    }

    const addAmountButtonHandle = (id, amount, reason) => {
        const item = products.find(product => product.id === id);
        item.add_amount = amount;
        item.description = reason;

        fetch(`http://localhost:8000/product/${id}/add`, {
            method: 'POST',
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Chyba při přidávání produktu: ' + response.status);
            }

            setProducts(products.map(product => product.id === id ? {...product, amount: parseInt(product.amount) + parseInt(addAmount)} : product));
        })

        addNotification(`Produkt ${item.name} byl naskladněn`);
        setAddShow(false);
    }

    const minusAmountButtonHandle = (id, amount, reason) => {
        const item2 = products.find(product => product.id === id);
        item2.minus_amount = amount;
        item2.description = reason;

        fetch(`http://localhost:8000/product/${id}/minus`, {
            method: 'POST',
            body: JSON.stringify(item2),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Chyba při odebírání produktu: ' + response.status);
            }

            setProducts(products.map(product => product.id === id ? {...product, amount: parseInt(product.amount) - parseInt(minusAmount)} : product));
        })

        addNotification(`Produkt ${item2.name} byl odepsán`);
        setMinusShow(false);
    }

    const addToCartHandle = (product) => {
        addToCart(product);
        addNotification(`Produkt ${product.name} byl přidán do košíku.`);
    }

    return (
        <>
            <p className="title">{category}</p>
            <ul className="products" data-category={category}>
                {products.map((product, index) => (
                    <li className="product" key={index}>
                        {!product.image && (<svg xmlns="http://www.w3.org/2000/svg" height="100" viewBox="0 -960 960 960" width="100"><path d="M160-120v-80h640v80H160Zm160-160q-66 0-113-47t-47-113v-400h640q33 0 56.5 23.5T880-760v120q0 33-23.5 56.5T800-560h-80v120q0 66-47 113t-113 47H320Zm0-80h240q33 0 56.5-23.5T640-440v-320H240v320q0 33 23.5 56.5T320-360Zm400-280h80v-120h-80v120ZM320-360h-80 400-320Z"/></svg>)}
                        {product.image && (<img src={getFileUrl(product.image)} alt={product.name} height="100" className="product__image" />)}
                        <span className="product__name">{product.name}</span>
                        <span className="product__price">{product.price} Kč</span>
                        <div className="product__amount">
                            {!isEnded && (<button className="btn btn-secondary" onClick={() => handleClickAdd(product)}>+</button>) }
                            <input type="number" className="form-control p-0" value={product.amount} readOnly={true} />
                            {!isEnded && (<button className="btn btn-secondary" onClick={() => handleClickMinus(product)}>—</button>) }
                        </div>
                        {product.amount > 0 && !isEnded && (<button className="btn btn-success" onClick={() => addToCartHandle(product)}>Prodat</button>)}
                    </li>
                ))}
            </ul>

            <Modal show={addShow} onHide={handleAddClose}>
                <Modal.Header closeButton>
                <Modal.Title>Přidat množství</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label htmlFor="amountAdd">Počet kusů produktu, které chcete přidat:</label>
                    <input type="number" id="amountAdd" className="form-control" value={addAmount} onChange={(e) => setAddAmount(e.target.value)}/>
                    
                    <label htmlFor="addReason">Poznámka:</label>
                    <input type="text" id="addReason" className="form-control" onChange={(e) => setAddReason(e.target.value)} value={addReason} />
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={() => addAmountButtonHandle(addProductId, addAmount, addReason)}>
                    Přidat množství
                </Button>
                <Button variant="secondary" onClick={handleAddClose}>
                    Zavřít
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={minusShow} onHide={handleMinusClose}>
                <Modal.Header closeButton>
                <Modal.Title>Odepsat množství</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label htmlFor="amountMinus">Počet kusů produktu, které chcete odepsat:</label>
                    <input type="number" id="amountMinus" className="form-control" value={minusAmount} onChange={(e) => setMinusAmount(e.target.value)}/>
                    
                    <label htmlFor="minusReason">Poznámka:</label>
                    <input type="text" id="minusReason" className="form-control" onChange={(e) => setMinusReason(e.target.value)} value={minusReason} />
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={() => minusAmountButtonHandle(minusProductId, minusAmount, minusReason)}>
                    Odepsat množství
                </Button>
                <Button variant="secondary" onClick={handleMinusClose}>
                    Zavřít
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ProductsInCategory