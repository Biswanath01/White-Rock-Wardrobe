import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import './Shop.css';
import Navbar from './Navbar';
import styled, { keyframes } from 'styled-components';
import { bounce } from 'react-animations';
import { fadeIn } from 'react-animations'
import Spinner from './Spinner';




export default function Category() {
    const params = useParams();
    const navigate = useNavigate();
    var category = (params.category).toUpperCase();
    const [products, setProducts] = useState();
    const [categoryDetails, setCategoryDetails] = useState([]);

    const bounceAnimation = keyframes`${bounce}`;
 
    const BouncyDiv = styled.div`
    animation: 1s ${bounceAnimation};
    `;

    useEffect(() => {
      axios.post('/api/get-specific-category', {
        category : params.category.toLowerCase()
      })
      .then((res) => {
        console.log(res.data.products);
        setProducts((prev) => res.data.products);
      })
      .catch((err) => console.log(err));
    }, []);

    // useEffect(() => {
    //     let a = {};
    //     products && products.map((value, index) => {
    //         if((value.category).toLowerCase() === category.toLowerCase()){
    //             // console.log(value.category);
    //             setCategoryDetails((prev) => [...prev, value]);
    //         }
    //     })
    // }, [products])
    

    return (
        <div style={{height : "100%"}}>
            <Navbar userId = {params.userId} />
            {console.log(products)}
            <div className='category'>
                {products === null || products === undefined ? <Spinner loading = {true}/> : <Spinner loading = {false}/>}
                {products !== [] || products !==null || products !== undefined ? 
                    <div> 
                        {category ? <h1>Category : {category}</h1> : <h1>No such category available</h1>}     
                        
                        <div className='products'> 
                                { products && products.map((value, index) => {
                                    return (      
                                    <div 
                                        key={index}
                                        className='shop-items' 
                                        style={{border: "2px solid maroon", margin: "5px", display:"flex", width: "100%", height: "350px"}}
                                        onClick = {() => navigate(`/${params.userId}/${value.itemId}/item-details`)}
                                        >
                                            <img className='item-image' src={value.image} onClick= {()=>{
                                            navigate(`/${params.userId}/${value.itemId}/item-details`);
                                            }}/>
                                            <div className='items' style={{margin: "30px 5px 10px 20px", marginLeft: "20px" ,width: "100%", maxWidth: window.innerWidth/2.5}} onClick= {()=>{
                                                navigate(`/${params.userId}/${value.itemId}/item-details`);
                                                }}>
                                                <h3 key={index}>{value.title}</h3> 
                                                <p>{value.description.slice(0, 60)}....</p>
                                            </div>

                                        <div className='items-reviews' style={{margin: "10% 5px 10px 10px", marginLeft: "20px" ,width: "100%"}}>
                                            <div>
                                                {/* {
                                                showStar && showStar.map((key, newkey)=> {
                                                    return (value <= Math.round(key.rate) ? <span key={value}>⭐</span> : <span key={value}>⚝ </span>
                                                    )
                                                })
                                                } */}
                                                <span>⭐{value.rate}</span>
                                            </div>
                                            <h5>Reviews: {value.count}</h5>
                                            <p><i>Category: {value.category}</i>  </p>
                                            <h3>Price: $ {value.price} </h3>   
                                        </div>
                                    </div>
                                    )
                                })}
                                
                        </div>
                    </div>
                 : 
                 <div>
                    <h1>No such products available</h1>
                    
                 </div>
                }
            </div>
        </div>
    )
}
