import React from 'react'
import RefreshRoute from './components/RefreshRoute'
import Navbar from './components/navbar'
import { CartProvider } from './components/CartContext';
import Cart from './components/cart';
import { NotificationProvider } from './components/NotificationContext';
import NotificationDisplay from './components/NotificationDisplay';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Category from './pages/Category';
import Product from './pages/Product';
import Acountant from './pages/Acountant';

function App() {
  return (
    <Router>
      <NotificationProvider>
        <Navbar />
        <CartProvider>
              <Cart />
              <Routes>
                <Route path="/" element={<Dashboard/>}/>
                <Route path="/category" element={<Category/>}/>
                <Route path="/product" element={<Product/>}/>
                <Route path="/accountant" element={<Acountant/>}/>
                <Route path="/refresh/:linkTo" element={<RefreshRoute />} />
              </Routes>
        </CartProvider>
        <NotificationDisplay/>
      </NotificationProvider>
    </Router>
  );
}

export default App;
