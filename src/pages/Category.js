import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserInfo } from '../components/UserContext';
import { Modal, Button } from 'react-bootstrap'

function Category(){
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const { isLoggedIn } = useUserInfo();

    //Update modal
    const [updateShow, setUpdateShow] = useState(false);
    const [updateName, setUpdateName] = useState('');
    const [updateId, setUpdateId] = useState(-1);
    const [updateOrder, setUpdateOrder] = useState(99999);

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
    }, []);

    const deleteRow = (id) => {
        fetch(`http://localhost:8000/category/delete/${id}`, {
            method: 'DELETE'
        }).then((response) => {
            if(response.status === 200){
                setCategories(categories.filter(category => category.id !== id))
            }
            else console.error("Nepodařilo se smazat řádek!");
        })
    }

    const [newCategoryInput, setNewCategoryInput] = useState('')

    const handleNewCategoryInput = (event) => {
        setNewCategoryInput(event.target.value);
    }

    const handleNewCategoryButton = async () => {
        try {
            const response = await fetch('http://localhost:8000/category/add', {
                method: 'PUT',
                body: JSON.stringify({
                    category: newCategoryInput
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error('Chyba při přidávání kategorie: ' + response.status);
            }
    
            const data = await response.json();
    
            setCategories([...categories, { id: data.id, category: newCategoryInput }]);
            setNewCategoryInput('');
        } catch (error) {
            console.error('Chyba:', error.message);
        }
    };

    const updateRowModal = (category) => {
        setUpdateId(category.id);
        setUpdateName(category.category);
        setUpdateOrder(category.order);

        setUpdateShow(true);
    }

    const updateCategoryHandle = async () => {
        try {
            const response = await fetch(`http://localhost:8000/category/update/${updateId}`, {
                method: 'POST',
                body: JSON.stringify({
                    category: updateName,
                    order: updateOrder
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error('Chyba při aktualizování kategorie: ' + response.status);
            }

            setCategories(categories.map(category => category.id === updateId ? {
                id: updateId,
                category: updateName,
                order: updateOrder
            } : category));
            setUpdateShow(false);

        } catch (error) {
            console.error('Chyba:', error.message);
        }
    }

    const handleUpdateClose = () => {
        setUpdateShow(false);
    }

    return (
        <section className="category container container--main">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Název kategorie</th>
                        <th>Pořadí</th>
                        <th>Akce</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td><input type="text" className="form-control" onChange={handleNewCategoryInput} value={newCategoryInput} placeholder="Název kategorie" /></td>
                        <td></td>
                        <td><button type="button" className="btn btn-primary" onClick={handleNewCategoryButton}>Vytvořit</button></td>
                    </tr>
                    {categories.map((category, index) => (
                        <tr key={index}>
                            <td>{category.id}</td>
                            <td><strong>{category.category}</strong></td>
                            <td>{category.order}</td>
                            <td>
                                <span className="font-weight-bold text-warning cursor-pointer" onClick={() => updateRowModal(category)}>Upravit</span>
                                &nbsp;
                                <span className="font-weight-bold text-danger cursor-pointer" onClick={() => deleteRow(category.id)}>Smazat</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={updateShow} onHide={handleUpdateClose}>
                <Modal.Header closeButton>
                <Modal.Title>Upravit kategorii</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label htmlFor="name">Název kategorie:</label>
                    <input type="text" id="name" className="form-control-plaintext" readOnly={true} value={updateName} onChange={(e) => setUpdateName(e.target.value)}/>
                    
                    <label htmlFor="order">Pořadí:</label>
                    <input type="number" id="order" className="form-control" onChange={(e) => setUpdateOrder(e.target.value)} value={updateOrder} />
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={() => updateCategoryHandle(updateId, updateName, updateOrder)}>
                    Upravit kategorii
                </Button>
                <Button variant="secondary" onClick={handleUpdateClose}>
                    Zavřít
                </Button>
                </Modal.Footer>
            </Modal>
        </section>
    )
}

export default Category