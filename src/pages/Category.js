import React, {useState, useEffect} from 'react'

function Category(){
    const [categories, setCategories] = useState([]);

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

    const handleNewCategoryButton = () => {
        fetch('http://localhost:8000/category/add', {
            method: 'PUT',
            body: JSON.stringify({
                category: newCategoryInput
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Chyba při přidávání kategorie: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            setCategories([...categories, {id: data.id, category: newCategoryInput}]);
            setNewCategoryInput('')
        })
        .catch(error => {
            console.error('Chyba:', error.message);
        });
    }

    return (
        <section className="category container">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Název kategorie</th>
                        <th>Akce</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td><input type="text" className="form-control" onChange={handleNewCategoryInput} value={newCategoryInput} placeholder="Název kategorie" /></td>
                        <td><button className="btn btn-primary" onClick={handleNewCategoryButton}>Vytvořit</button></td>
                    </tr>
                    {categories.map((category, index) => (
                        <tr key={index}>
                            <td>{category.id}</td>
                            <td><strong>{category.category}</strong></td>
                            <td><span className="font-weight-bold text-danger cursor-pointer" onClick={() => deleteRow(category.id)}>Smazat</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    )
}

export default Category