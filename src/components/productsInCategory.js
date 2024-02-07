import React, {useState, useEffect} from 'react'
import { useCart } from './CartContext';
import { useNotification } from './NotificationContext';
import { getFileUrl } from './uploadFile';

function ProductsInCategory({category}) {
    const [products, setProducts] = useState([]);
    const { addToCart } = useCart();
    const [isEnded, setIsEnded] = useState(false);
    const { addNotification } = useNotification();

    useEffect(() => {
        const isEndedFetch = async () => {
            try {
                const response = await fetch(`http://localhost:8000/accountant/is-ended/${new Date().toISOString().split('T')[0]}`);
                const jsonData = await response.json();
                setIsEnded(jsonData);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }

        const fetchData = async () => {
            try {
                const response = await fetch(category ? `http://localhost:8000/product/category/${category}` : `http://localhost:8000/product`);
                const jsonData = await response.json();
                setProducts(jsonData);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }

        isEndedFetch();
        fetchData();
    }, [category]) //use Effect závisí na category

    const addAmountButtonHandle = (item) => {
        const id = item.id;

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

            setProducts(products.map(product => product.id === id ? {...product, amount: product.amount + 1} : product));
        })
    }

    const minusAmountButtonHandle = (item) => {
        const id = item.id;

        fetch(`http://localhost:8000/product/${id}/minus`, {
            method: 'POST',
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Chyba při odebírání produktu: ' + response.status);
            }

            setProducts(products.map(product => product.id === id ? {...product, amount: product.amount - 1} : product));
        })
    }

    const addToCartHandle = (product) => {
        addToCart(product);
        addNotification(`Produkt ${product.name} byl přidán do košíku.`);
    }

    return (
        <>
            <h1>{category}</h1>
            <ul className="products" data-category={category}>
                {products.map((product, index) => (
                    <li className="product" key={index}>
                        {!product.image && (<svg xmlns="http://www.w3.org/2000/svg" height="100" viewBox="0 -960 960 960" width="100"><path d="M160-120v-80h640v80H160Zm160-160q-66 0-113-47t-47-113v-400h640q33 0 56.5 23.5T880-760v120q0 33-23.5 56.5T800-560h-80v120q0 66-47 113t-113 47H320Zm0-80h240q33 0 56.5-23.5T640-440v-320H240v320q0 33 23.5 56.5T320-360Zm400-280h80v-120h-80v120ZM320-360h-80 400-320Z"/></svg>)}
                        {product.image && (<img src={getFileUrl(product.image)} alt={product.name} height="100" className="product__image" />)}
                        <span className="product__name">{product.name}</span>
                        <span className="product__price">{product.price} Kč</span>
                        <div className="product__amount">
                            {!isEnded && (<button className="btn btn-secondary" onClick={() => addAmountButtonHandle(product)}>+</button>) }
                            <input type="number" className="form-control" value={product.amount} readOnly={true} />
                            {!isEnded && (<button className="btn btn-secondary" onClick={() => minusAmountButtonHandle(product)}>—</button>) }
                        </div>
                        {product.amount > 0 && !isEnded && (<button className="btn btn-success" onClick={() => addToCartHandle(product)}>Prodat</button>)}
                    </li>
                ))}
            </ul>
        </>
    )
}

export default ProductsInCategory