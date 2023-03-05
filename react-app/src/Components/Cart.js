import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import { styled } from '@mui/material/styles';
import { ShoppingCart } from "phosphor-react";
import './navbar.css'
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import _ from 'lodash';
import Navbar from './Navbar';
import './Shop.css';
import { ToastContainer, toast } from 'react-toastify';
import Spinner from './Spinner';



export default function Cart(props) {
  const navigate = useNavigate();
  const params = useParams();
  const [baseUrl, setBaseUrl] = useState("https://fakestoreapi.com/products");
  const [cartDataId, setCartDataId] = useState();
  const [productData, setProductData] = useState();
  const [buyItemList, setBuyItemList] = useState([]);
  const [itemListLength, setItemListLength] = useState(0);
  const [selectedItemsPrice, setSelectedItemsPrice] = useState(0);
  const [disabledCheckbox, setDisabledCheckbox] = useState(true);
  const [cartStats, setCartStats] = useState(true);

  useEffect(() => {
      const getCartItems = async()=> {
        await axios.get(`/api/get-cart-items/${params.userId}`)
          .then((res) => {
            console.log(res.data.data);
            setCartDataId((prev) => res.data.data);       //only ids of the cart items
            axios.post('/api/product-data-for-cart/', {
              itemId : res.data.data            //sending the array of itemId to the backend to send 
            })                                  //the details of the items whose cart ids(that we have sent just now) 
                                                //match with the id in the product model
              .then((response)=>{
                console.log(response.data.data);
                if(response.data.message === "No products in the cart" || response.data.data.length === 0 || response.data.success === false){
                  setCartStats((prev) => false);
                }
                setProductData((prev) => response.data.data);   //all the PRODUCT data that are present in the cart
              })
              .catch((err)=>{
                console.log(err);
              })
          })
          .catch((err) => console.log(err));
      }
      getCartItems();
  }, [])


  useEffect(() => {
    // console.log(buyItemList);
    // setItemListLength(prev=> buyItemList.length);
  }, [buyItemList])

  const handleDeleteFromCart = (e, id) =>{
    axios.post('/api/delete-from-cart/', {
      itemId : id,
      userId : params.userId
    })
    .then((res)=> {
      console.log(res.data);
      if(res.data.success === true){
        notifyDeleteFromCart();
      }
    })
    .catch((err)=> console.log(err));
    const addDelay = setTimeout(() => {
      window.location.reload();
    }, 500);
    return () => clearTimeout(addDelay);
  }
  
  const notifyDeleteFromCart = () => toast.success("Item Deleted from Cart!");

  const handlelogout = (e) =>{
    localStorage.removeItem('store');
    navigate('/');
  }
  
  const handleBuyIndividual = (e, itemId) =>{
    let itemPrice = 0;
    productData && productData.map((value, index)=> {       //to find the price of individual selected items
      if(value.itemId === itemId){
        itemPrice = value.price;
      }
    })

    if(e.target.checked){
      // console.log(itemId);
      // buyItemList.push(itemId);
      setBuyItemList(prev=> [...prev, itemId]);
      setItemListLength(prev=> prev+1);             //finding the length of the individual list of items
      setSelectedItemsPrice(prev=> prev+itemPrice); //to add the prices of indivial items      
    }
    else{
      let index = buyItemList.indexOf(itemId);
      let itemList = _.cloneDeep(buyItemList)
      itemList.splice(index, 1);
      setBuyItemList(prev=> itemList);
      setItemListLength(prev=> prev-1);
      setSelectedItemsPrice(prev=> prev-itemPrice);
    }
  }

  const handleBuySelected = (e) => {
    let a = buyItemList.join(",");
    navigate(`/${params.userId}/checkout/?productIdList=${a}`)
  }

  const handleBuyAll = (e) => {
    let buyAllItemsId = [];
    productData && productData.map((value, index)=> {
      buyAllItemsId.push(value.itemId);
    })
    let a = buyAllItemsId.join(",");
    navigate(`/${params.userId}/checkout/?productIdList=${a}`)
  }

  const handleDeleteMulitple = () => {
    console.log(buyItemList);         //selected item list
    axios.post('/api/delete-multiple-items/', {
      userId : params.userId,
      itemIdList : buyItemList
    })
    .then((res) => {
      console.log(res.data);
      if(res.data.success === true){
        notifyDeleteFromCart();
        window.location.reload();
      }
    })
    .catch((err)=> console.log(err));
    // const addDelay = setTimeout(() => {
      
    // }, 500);
    // return () => clearTimeout(addDelay);
  }
  

  return (
    <div className='cart'>
      
      <Navbar userId = {params.userId}/>
      <h1>Your Cart</h1>
      {
        cartStats === true ?
        <div>
          <Button onClick={handleBuyAll} 
            variant="contained" color="secondary" size="large" sx={{margin: "20px"}}
            >Buy All</Button>
          <Button disabled={buyItemList.length===0} onClick={handleBuySelected} 
            variant="contained" color="secondary" size="large" sx={{margin: "20px"}}
            >Buy Selected</Button>
          <Button disabled={buyItemList.length===0} onClick={handleDeleteMulitple} 
            variant="contained" color="error" size="large" sx={{margin: "20px"}}
            >Delete From Cart</Button>

          {
            disabledCheckbox ?
            <Button 
              variant="contained" color="success" size="large" sx={{margin: "20px"}}
              onClick={(event) => {
                setDisabledCheckbox(prev=> !prev);
              }} 
            >Enable Checkbox</Button> : 
            <Button 
              variant="contained" color="error" size="large" sx={{margin: "20px"}}
              onClick={(event) => {
                setDisabledCheckbox(prev=> !prev);
              }} 
            >Disable Checkbox</Button>
          }

          {itemListLength > 0 && <p>You have selected {itemListLength} items</p>}
          {itemListLength > 0 && <p>Your total amount is: $ {parseFloat(selectedItemsPrice).toFixed(2)}</p>}

          <div>
            {console.log(productData)}
            {productData === null || productData === undefined ? <Spinner loading = {true}/> : <Spinner loading = {false}/>}
            {productData && productData.map((key, index)=>(
              <div 
                className='cart-items' 
                key={index}
                style={{border: "1px solid lightgrey", 
                margin: "10px", 
                display:"flex",
                width: "100%", 
                height: "350px"}}
              >
                  <img src={key.imageUrl} style={{width:"19%", margin:"30px",  marginLeft: "50px", marginTop:"30px", maxWidth: window.innerWidth/3, cursor : "pointer"}} 
                    onClick={(e) => navigate(`/${params.userId}/${key.itemId}/item-details`)}/>
                  <div style={{margin: "50px 0px 0px 50px", width: "100%", maxWidth: window.innerWidth/1.5, cursor : "pointer"}} 
                    onClick={(e) => navigate(`/${params.userId}/${key.itemId}/item-details`)}>
                    <h3 key={index}>{key.title}</h3> 
                    {/* <h3 key={index}>{key.itemId}</h3>  */}
                    {/* <p style={{}}>{key.description}</p> */}
                    {/* <h4>Reviews: {key.rating.count}</h4> */}
                    {/* <h3>{key.rating.rate}⭐</h3> */}
                    <p><i>Category: {key.category}</i>  </p>
                    <h3>Price: $ {key.price}</h3>
                  </div>
                  <input type="checkbox" disabled={disabledCheckbox}
                  style={{width: "50px", margin: "40px"}} 
                  onChange={(e)=> handleBuyIndividual(e, key.itemId)}/>
                  
                  <Button sx={{margin: "20px", marginTop: window.innerHeight/42 ,width: "30%", height: "40px"}} 
                  variant="contained" color="secondary" size="large"
                  onClick={(e)=> navigate(`/${params.userId}/checkout/?productIdList=${key.itemId}`)}
                  >Buy Item</Button>
                  <Button sx={{margin: "20px", marginTop: window.innerHeight/42 ,width: "30%", height: "40px"}} 
                  variant="contained" color="error" size="large" 
                  onClick={(e)=> handleDeleteFromCart(e, key.itemId)}
                  >Remove from Cart</Button>
                </div>
            ))}
            </div>
        </div> :
      <div>You have no items in your cart</div>
     }
     <ToastContainer theme="light" />
    </div>


  )
}
