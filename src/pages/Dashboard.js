import React, {useState, useEffect} from 'react'
import ProductsInCategory from '../components/productsInCategory'
import Summary from '../components/summary'

function Dashboard(){
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

    return (
        <section className="dashboard container">
            <div className="dashboard__products">
                {categories.map((category, index) => {
                    return <ProductsInCategory key={index} category={category.category} />
                })}
            </div>
            <div className="dashboard__summary">
                <Summary date={new Date().toISOString().split('T')[0]} redirect="/refresh/dashboard" showRefresh={true} />
            </div>
        </section>
    )
}

export default Dashboard