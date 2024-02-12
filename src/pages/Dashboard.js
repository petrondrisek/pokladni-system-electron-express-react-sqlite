import React, {useState, useEffect} from 'react'
import ProductsInCategory from '../components/productsInCategory'
import Summary from '../components/summary'
import { Link } from 'react-router-dom'

function Dashboard(){
    const [categories, setCategories] = useState([]);
    const [searchBar, setSearchBar] = useState('');

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

    return (
        <section className="dashboard container container--main">
            <div className="dashboard__products">
                <div className="d-flex">
                    <input type="text" placeholder="Hledat mezi produkty ..." className="form-control" onChange={(e) => setSearchBar(e.target.value)}/>
                    <Link to="/product/count"><button className="btn btn-warning">Režim počítání</button></Link>
                </div>
                {categories.map((category, index) => {
                    return <ProductsInCategory key={index} category={category.category} search={searchBar} />
                })}
            </div>
            <div className="dashboard__summary">
                <Summary date={new Date().toISOString().split('T')[0]} redirect="/refresh/dashboard" showRefresh={true} />
            </div>
        </section>
    )
}

export default Dashboard