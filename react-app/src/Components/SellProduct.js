import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ShoppingCart } from "phosphor-react";
import './Shop.css';
import './navbar.css'
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';


export default function SellProduct(props) {
    const navigate = useNavigate();
    const params = useParams();
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [price, setPrice] = useState(0);
    const [title, setTitle] = useState("");
    const [productImage, setProductImage] = useState(); 
    const [imageUrl, setImageUrl] = useState();
    const [picUploaded, setPicUploaded] = useState(false);
    useEffect(() => {
        if(productImage){
            setImageUrl(prev => URL.createObjectURL(productImage));
        } 
        else return;
      }, [productImage]);

    const handleSaveProductDetails = (e) =>{
        e.preventDefault();
        let formData = new FormData();
        formData.append("userId", params.userId);
        formData.append("category", category);
        formData.append("description", description);
        formData.append("title", title);
        formData.append("price", price);
        formData.append("image", productImage, productImage.name);
        formData.append("count", 0);
        formData.append("rate", 0);             //new products have 0 reviews
        console.log(formData);
        
        axios.post('/api/sell-product-data/', formData)
            .then((res)=> {
                console.log(res.data);
                if(res.data.message === "Selling Product added to DB"){
                    notifyProductAddedtoDB();
                    const addDelay = setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                    return () => clearTimeout(addDelay);
                }
            })
            .catch((err)=> {
                console.log(err);
                notifyErrorSaving();
            })
        
        //for displaying the category in home page bar
        axios.post('/api/add-new-category', {
            category : category.toLowerCase()
        })
        .then((response) => console.log(response))
        .catch((err) => console.log(err))
    }

    const notifyProductAddedtoDB = () => toast.success("Product added to DB!");
    const notifyErrorSaving = (msg) => toast.error("There is some error in adding the product to DB!");

    const handleUploadImage = (event) => {
    // console.log("Hey");
    setProductImage(event.target.files[0]);
    // console.log(event.target.files[0]);
    setPicUploaded(true);
    }

  return (
    <div className='sell-products' style={{height: window.innerHeight}}>
        <Navbar userId = {params.userId}/>
        <h1>Sell Items</h1>
        <h4 style={{textDecoration : "underline"}}>Enter Details About the Product You Want to Sell</h4>
        <div style={{display : "flex", flexDirection : "column", width:"50%", margin:"auto", color:"white"}}>
            <TextField error label="Category" color="secondary" sx={{margin: "5px"}} onChange={(e)=>{
                setCategory(e.target.value.toLowerCase())
            }} 
                InputProps={{style:{fontSize : "15px", color: "white"}}} InputLabelProps={{style:{fontSize : "15px"}}}
            />
            <TextField error label="Product Title" color="secondary" sx={{margin: "5px"}} onChange={(e)=>{
                setTitle(e.target.value)
            }}
                InputProps={{style:{fontSize : "15px", color: "white"}}} InputLabelProps={{style:{fontSize : "15px"}}}
            />
            <TextField error label="Product Description" color="secondary" sx={{margin: "5px"}} onChange={(e)=>{
                setDescription(e.target.value)
            }}
                InputProps={{style:{fontSize : "15px", color: "white"}}} InputLabelProps={{style:{fontSize : "15px"}}}
            />
            <TextField error type="number" label="Price (in $)" color="secondary" sx={{margin: "5px"}} onChange={(e)=>{
                setPrice(e.target.value)
            }}
                InputProps={{style:{fontSize : "15px", color: "white"}}} InputLabelProps={{style:{fontSize : "15px"}}}
            />
            <h4 style={{margin: "10px 400px 20px 0px"}}>Enter Image of the Product:</h4>
            <input type="file" style={{marginLeft : "10px"}} accept='image/*' onChange={handleUploadImage}/>
            {picUploaded && 
                <img 
                    src={imageUrl}
                    style={{width: "50px", height: "50px" ,borderRadius: "50%", margin: "10px 200px 20px 10px"}}
                />
            }
            
            <Button variant="contained" disabled={!imageUrl || !category || !title || !price} size="large" color="secondary" onClick={handleSaveProductDetails}>Submit</Button>
        </div> 
        <ToastContainer />
    </div>
  )
}
