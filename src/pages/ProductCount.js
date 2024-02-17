import React, {useState, useEffect} from 'react'
import { getFileUrl } from '../components/uploadFile';
import { Link } from 'react-router-dom';
import { useAppContext } from '../components/AppRouterContext';

export default function ProductCount() {
    const [products, setProducts] = useState([])
    const { getProductCount, addToProductCount, removeAllProductCount } = useAppContext()
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/product', {
                    method: 'POST'
                });
                const jsonData = await response.json();
                setProducts(jsonData);
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, []);

    return (
        <section className="productPage container container--main">
            <Link to="/">← Vrátit se zpět</Link>
            <button className="btn btn-danger m-3" onClick={() => removeAllProductCount()}>Vyprázdnit záznamy</button>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Název produktu</th>
                        <th>Obrázek</th>
                        <th>Skutečné množství</th>
                        <th>Napočítané množství</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td>{product.id}</td>
                            <td><strong>{product.name}</strong></td>
                            <td>{product.image ? <img src={getFileUrl(product.image)} height="50px" alt={product.name} /> : ''}</td>
                            <td>{product.amount}</td>
                            <td><input type="number" className="form-control" value={getProductCount(product.id)} onChange={ (e) => addToProductCount({id: product.id, value: e.target.value}) }/></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    )
}