import React, {useState, useEffect} from 'react'
import { uploadFile, getFileUrl } from '../components/uploadFile';
import { useNavigate } from 'react-router-dom'
import { useUserInfo } from '../components/UserContext';
import { Modal, Button } from 'react-bootstrap'

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
                    image: body.image || null,
                    order: 99999
                }
            ]);
    
            setNewProductNameInput('');
            setNewProductPriceInput(0);
            setNewProductAmountInput(0);
        } catch (error) {
            console.error('Chyba:', error.message);
        }
    };

    //Update modal
    const [updateShow, setUpdateShow] = useState(false);
    const [updateId, setUpdateId] = useState(-1);
    const [updateName, setUpdateName] = useState('');
    const [updatePrice, setUpdatePrice] = useState(0);
    const [updateCategory, setUpdateCategory] = useState('');
    const [updateOrder, setUpdateOrder] = useState(99999);

    const handleUpdateClose = () => {
        setUpdateShow(false);
    }

    const updateProductHandle = async () => {
        try {
            const response = await fetch(`http://localhost:8000/product/update/${updateId}`, {
                method: 'POST',
                body: JSON.stringify({
                    name: updateName,
                    price: updatePrice,
                    category: updateCategory,
                    order: updateOrder
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error('Chyba při aktualizování produktu: ' + response.status);
            }

            setProducts(products.map(product => product.id === updateId ? {
                id: updateId,
                name: updateName,
                price: updatePrice,
                category: updateCategory,
                order: updateOrder,
                amount: product.amount,
                image: product.image
            } : product));

            setUpdateShow(false);
        } catch (error) {
            console.error('Chyba:', error.message);
        }
    }

    const updateRowModal = (product) => {
        setUpdateId(product.id);
        setUpdateName(product.name);
        setUpdatePrice(product.price);
        setUpdateCategory(product.category);
        setUpdateOrder(product.order);

        setUpdateShow(true);
    }
    

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
                        <th>Pořadí</th>
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
                        <td></td>
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
                            <td>{product.order}</td>
                            <td>{product.category}</td>
                            <td>
                                <span className="font-weight-bold text-warning cursor-pointer" onClick={() => updateRowModal(product)}>Upravit</span>
                                &nbsp;
                                <span className="font-weight-bold text-danger cursor-pointer" onClick={() => deleteRow(product.id)}>Smazat</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={updateShow} onHide={handleUpdateClose}>
                <Modal.Header closeButton>
                <Modal.Title>Upravit produkt</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label htmlFor="name">Nový název produktu</label>
                    <input type="text" id="name" className="form-control" value={updateName} onChange={(e) => setUpdateName(e.target.value)}/>
                    
                    <label htmlFor="price">Cena:</label>
                    <input type="number" id="price" className="form-control" onChange={(e) => setUpdatePrice(e.target.value)} value={updatePrice} />

                    <label htmlFor="order">Pořadí:</label>
                    <input type="number" id="order" className="form-control" onChange={(e) => setUpdateOrder(e.target.value)} value={updateOrder} />
                
                    <label htmlFor="category">Kategorie:</label>
                    <select id="category" className="form-control" onChange={(event) => setUpdateCategory(event.target.value)}>
                                {categories.map((category, index) => (
                                    <option key={index} value={category.category} selected={category.category === updateCategory}>{category.category}</option>
                                ))}
                    </select>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={() => updateProductHandle(updateId, updateName, updateOrder)}>
                    Upravit produkt
                </Button>
                <Button variant="secondary" onClick={handleUpdateClose}>
                    Zavřít
                </Button>
                </Modal.Footer>
            </Modal>
        </section>
    )
}

export default Product