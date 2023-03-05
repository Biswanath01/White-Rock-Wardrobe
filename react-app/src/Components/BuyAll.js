import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';


export default function BuyAll() {

  const [data, setData] = useState();
  const [pData, setpData] = useState();
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(()=> {
    axios.get('/api/get-items')
    .then((res)=>{ 
      console.log(res.data.data)
      setData(prev=> res.data.data)
      res.data.data && res.data.data.map((value, err)=> {
        setTotalPrice(prev=> prev + value.price)
      })
    })
    .catch((err)=> console.log(err));
    
    
  }, [])

  useEffect(()=> {
    axios.get('/api/get-products')
    .then((res)=> {
      console.log(res.data)
      setpData(prev=> res.data.products[0])})
  }, [])

  

  return (
    <div>
        <h1>Okay so Lets Buy All</h1>
        <div>
            
            {data && data.map((key, index)=>(
              
              <div 
                className='cart-items' 
                key={index}
                style={{border: "1px solid lightgrey", 
                margin: "10px", 
                display:"flex",
                width: "100%", 
                height: "350px"}}
              >
                  <img src={key.image} style={{width:"19%", margin:"30px",  marginLeft: "50px", marginTop:"30px", maxWidth: window.innerWidth/3}}/>
                  <div style={{margin: "50px 0px 0px 50px", width: "100%", maxWidth: window.innerWidth/1.5}}>
                    <h3 key={index}>{key.title}</h3> 
                    {/* <p style={{}}>{key.description}</p> */}
                    {/* <h4>Reviews: {key.rating.count}</h4> */}
                    <p> <i>Category: {key.category}</i>  </p>
                    <h3>{key.rating.rate}⭐</h3>
                    <h3>Price: $ {key.price}</h3>
                      
                  </div>
                  <div className='items-reviews' style={{margin: "50px", marginLeft: "20px" ,width: "20%", display:"flex", flexDirection: "column", marginTop:"150px"}}>            
                  </div>
                </div>
            ))}
            <p>The total amount is: ${totalPrice && totalPrice}</p>
              
            <Button onClick={(event) => navigate()} 
            variant="contained" color="error" size="large" sx={{margin: "20px"}}
            >Checkout</Button>


          </div>
            {pData && <img src={pData.image} />}
    </div>
  )
}
