import React, {useState, useEffect} from 'react'
import { uploadFile, getFileUrl } from '../components/uploadFile';
import { useNavigate } from 'react-router-dom'
import { useUserInfo } from '../components/UserContext';

function Product(){
    const [categories, setCategories] = useState([]);

    const navigate = useNavigate();
    const { isLoggedIn } = useUserInfo();

    useEffect(() => {
        if(!isLoggedIn){
            navigate('/');
            return;
        }
    }, [isLoggedIn, navigate])

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await fetch('http://localhost:8000/category');
              const jsonData = await response.json();
              setCategories(jsonData);
            } catch (error) {
              console.error('Error fetching data: ', error);
            }
          };
      
          fetchData();
    }, [categories]);


    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await fetch('http://localhost:8000/product', {
                method: 'POST',
              });
              const jsonData = await response.json();
              setProducts(jsonData);
            } catch (error) {
              console.error('Error fetching data: ', error);
            }
          };
      
          fetchData();
    }, []);

    const deleteRow = (id) => {
        fetch(`http://localhost:8000/product/delete/${id}`, {
            method: 'DELETE'
        }).then((response) => {
            if(response.status === 200){
                setProducts(products.filter(product => product.id !== id))
            }
            else console.error("Nepodařilo se smazat řádek!");
        })
    }

    const [newProductNameInput, setNewProductNameInput] = useState('')
    const [newProductPriceInput, setNewProductPriceInput] = useState(0)
    const [newProductAmountInput, setNewProductAmountInput] = useState(0)
    const [newProductCategoryInput, setNewProductCategoryInput] = useState('')
    const [newProductImageInput, setNewProductImageFile] = useState(null);

    const handleNewProductNameInput = (event) => {
        setNewProductNameInput(event.target.value);
    }

    const handleNewProductPriceInput = (event) => {
        setNewProductPriceInput(event.target.value);
    }

    const handleNewProductAmountInput = (event) => {
        setNewProductAmountInput(event.target.value);
    }
    
    const handleNewProductCategoryInput = (event) => {
        setNewProductCategoryInput(event.target.value);
    }

    const handleNewProductImageChange = (event) => {
        setNewProductImageFile(event.target.files[0]);
    }

    const handleNewProductButton = async () => {
        try {
            const body = {
                name: newProductNameInput,
                price: newProductPriceInput,
                amount: newProductAmountInput,
                category: newProductCategoryInput
            };
    
            if (newProductImageInput) {
                const imageData = await uploadFile(newProductImageInput, 'products', ['png', 'jpg', 'jpeg']);
                body.image = imageData.fileURL;
            }
    
            const response = await fetch('http://localhost:8000/product/add', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
    
            if (!response.ok) {
                throw new Error('Chyba při přidávání produktu: ' + response.status);
            }
    
            const data = await response.json();
    
            setProducts(prevProducts => [
                ...prevProducts,
                {
                    id: data.id, 
                    name: newProductNameInput,
                    price: newProductPriceInput,
                    amount: newProductAmountInput,
                    category: newProductCategoryInput,
                    image: body.image || null
                }
            ]);
    
            setNewProductNameInput('');
            setNewProductPriceInput(0);
            setNewProductAmountInput(0);
        } catch (error) {
            console.error('Chyba:', error.message);
        }
    };

    return (
        <section className="productPage container container--main">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Název produktu</th>
                        <th>Obrázek</th>
                        <th>Cena</th>
                        <th>Množství</th>
                        <th>Kategorie</th>
                        <th>Akce</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td><input type="text" className="form-control" onChange={handleNewProductNameInput} value={newProductNameInput} placeholder="Název produktu" /></td>
                        <td><input type="file" onChange={handleNewProductImageChange} accept='image/*'/></td>
                        <td><input type="number" className="form-control" onChange={handleNewProductPriceInput} value={newProductPriceInput} placeholder="Cena produktu" /></td>
                        <td><input type="number" className="form-control" onChange={handleNewProductAmountInput} value={newProductAmountInput} placeholder="Množství produktu" /></td>
                        <td>
                            <select className="form-control" onChange={(event) => handleNewProductCategoryInput(event)}>
                                <option value="">Vyberte kategorii ...</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category.category}>{category.category}</option>
                                ))}
                            </select>
                        </td>
                        <td><button className="btn btn-primary" onClick={handleNewProductButton}>Vytvořit</button></td>
                    </tr>
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td>{product.id}</td>
                            <td><strong>{product.name}</strong></td>
                            <td>{product.image ? <img src={getFileUrl(product.image)} height="50px" alt={product.name} /> : ''}</td>
                            <td>{product.price}</td>
                            <td>{product.amount}</td>
                            <td>{product.category}</td>
                            <td><span className="font-weight-bold text-danger cursor-pointer" onClick={() => deleteRow(product.id)}>Smazat</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    )
}

export default Product