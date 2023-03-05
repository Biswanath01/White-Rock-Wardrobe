import React, { useEffect, useState } from "react";
import './App.css';
import {BrowserRouter as Router, Routes, Route, Form, useParams } from 'react-router-dom';
import Navbar from "./Components/Navbar";
import Cart from "./Components/Cart";
import Shop from "./Components/Shop";
import Calculator from "./Components/Calculator";
import SellProduct from "./Components/SellProduct";
import ItemDetails from "./Components/ItemDetails";
import Auth from "./Components/Auth";
import CheckoutPage from "./Components/CheckoutPage";
import BuyAll from "./Components/BuyAll";
import Profile from "./Components/Profile";
import CreateProfile from "./Components/CreateProfile";
import ErrorPage from "./ErrorPage";
import Category from "./Components/Category";
import Footer from "./Components/Footer";
import Alarm from "./Components/Alarm";


function App() {
  const params = useParams();
  

  return (
    <div className="App" style={{backgroundColor : "rgb(22, 32, 51)"}}>
      <Router>        
        <Routes>
          <Route path="/" element={<Auth/>} />
          <Route path='/:userId/create-profile' element = {<CreateProfile />} />
          <Route path="/:userId/shop" element={<Shop />} />
          <Route path="/:userId/cart" element={<Cart />} />
          <Route path="/:userId/category/:category" element={<Category />} />
          <Route path="/:userId/sell-product" element={<SellProduct />} />
          <Route path='/:userId/:itemId/item-details' element={<ItemDetails />} />
          <Route path='/:userId/checkout/' element = {<CheckoutPage />} />
          <Route path='/:userId/profile' element = {<Profile />} />
          <Route path='/calculator' element={<Calculator/>} />
          <Route path='/alarm' element={<Alarm/>} />
          <Route path='*' element = {<ErrorPage/>}/>
  
          {/* <Route path='/:userId/buy-all' element = {<BuyAll />} /> */}
        </Routes>
      </Router>
        <Footer/>
    </div>
  );
}

export default App;
