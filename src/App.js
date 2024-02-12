import React from 'react'
import RefreshRoute from './components/RefreshRoute'
import Navbar from './components/navbar'
import { CartProvider } from './components/CartContext';
import Cart from './components/cart';
import { NotificationProvider } from './components/NotificationContext';
import NotificationDisplay from './components/NotificationDisplay';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import UserDisplay from './components/UserDisplay';

import Dashboard from './pages/Dashboard';
import Category from './pages/Category';
import Product from './pages/Product';
import Acountant from './pages/Acountant';
import SimplePassword from './components/SimplePassword';
import ProductCount from './pages/ProductCount';

function App() {
  return (
    <Router>
      <NotificationProvider>
        <UserProvider>
          <UserDisplay/>
          <Navbar />
            <CartProvider>
                  <Cart />
                  <Routes>
                    <Route path="/" element={<Dashboard/>}/>
                    <Route path="/category" element={<Category/>}/>
                    <Route path="/product" element={<Product/>}/>
                    <Route path="/product/count" element={<ProductCount/>}/>
                    <Route path="/accountant/:date?" element={<Acountant/>}/>
                    <Route path="/refresh/:linkTo" element={<RefreshRoute />} />
                    <Route path="/password/:linkTo" element={<SimplePassword />} />
                  </Routes>
            </CartProvider>
        </UserProvider>
        <NotificationDisplay/>
      </NotificationProvider>
    </Router>
  );
}

export default App;
