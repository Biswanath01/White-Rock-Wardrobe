import axios from 'axios';
import React, { useState, useEffect, CSSProperties } from 'react';
import BounceLoader from "react-spinners/BounceLoader";
import { useNavigate, useParams } from 'react-router-dom';
import _ from 'lodash';
import Button from '@mui/material/Button';
import Navbar from './Navbar';
import { ToastContainer, toast } from 'react-toastify';
import './Shop.css';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Spinner from './Spinner';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';



export default function ItemDetails(props) {
    const params = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState();
    const [baseUrl, setBaseUrl] = useState(`https://fakestoreapi.com/products/${params.itemId}`);
    const [userRating, setUserRating] = useState(0);
    const [newRating, setNewRating] = useState(0);
    const [countReviews, setCountReviews] = useState(0);
    const [showStar, setShowStar] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [getReviews, setGetReviews] = useState();
    const [cartStatus, setCartStatus] = useState(false);
    const [cartItemIds, setCartItemIds] = useState();
    const [products, setProducts] = useState();
    const [similarItemsId, setSimilarItemsId] = useState([]);
    const [similarItems, setSimilarItems] = useState();
    const [noReviewsFound, setNoReviewsFound] = useState(false);
    

    //to show the item detail of a product according to the itemId
    useEffect(() => {
      // console.log(params.itemId);
      window.scrollTo(0, 0);
      let a = [];
      a.push(params.itemId);
      axios.post('/api/product-data-for-cart/', {
        itemId : a                                  //we cannot send the string but we have to send the array of string to the BackEnd
      })
        .then((res) => { 
          setDetails((prev) => res.data.data[0]);
          // console.log(res.data.data[0]);
        })
        .catch((err) => console.log(err));
    }, []);    

    //to get all the products for showing the similar products
    useEffect(() => {
      const handleGetProducts = async() => {
        await axios.get('/api/get-products/')
        .then((res) => {
          // console.log(res.data.products);
          setProducts((prev) => res.data.products);
        })
        .catch((err) => console.log(err));
      }
      handleGetProducts();
    }, []);
    
    useEffect(() => {
      handleSetSimilarProducts();
      window.scrollTo(0, 0);
    }, [products])
    
    // to get the ids of the similar products according to the category and push them in a array
    const handleSetSimilarProducts = () => {
      products && products.map((value, index) => {
        // if the catgeofry matches and the current itemId dont matches so that it will again not come in similar items
        if((details.category).toUpperCase() === (value.category).toUpperCase() && details.itemId !== value.itemId){
          setSimilarItemsId((prev) => [...prev, value.itemId]);
        }
      }) 
    };

    // for getting the reviews
    useEffect(()=>{
      const getReviewFromBackend = async() => {
        await axios.get(`/api/get-review/${params.itemId}/`)
        .then((res)=> {
          console.log(res.data);
          if(res.data.message === 'No reviews found for this product'){
            setNoReviewsFound((prev) => true);
          }
          else{
            setGetReviews((prev) => res.data.data);
          }
        })
        .catch((err)=> console.log(err));
      }
      getReviewFromBackend();
    }, []);
 
    useEffect(() => {
      console.log("Getting cart itemId from API") //to show add to/ delete from cart
      // we are calling get-cart-items because we already have the product data so we can easily map throught it. 
      axios.get(`/api/get-cart-items/${params.userId}`) 
      .then((res)=> {
        setCartItemIds((prev) => res.data.data);      //the array of Id of cart items
        // console.log(res.data.data);           
      })
      .catch((err)=> console.log(err));
    }, [cartStatus]);

    useEffect(() => {
      axios.post('/api/product-data-for-cart/', {
        itemId : similarItemsId
      })
      .then((res) => {
        console.log("Similar Prodcuts", res.data.data)
        setSimilarItems((prev) => res.data.data);
      })
      .catch((err) => console.log(err));
    }, [similarItemsId]);



    const handleReview = (e) =>{
      //for adding reviews
      axios.post('/api/add-review/', {
        userId : params.userId,
        review : reviews,
        itemId : params.itemId,
        userRating : userRating
      })
      .then((response)=> {
        console.log(response);
        if(response.data.success === true){
          //for modifying the total count of reviews and the average rate
            axios.post('/api/modify-reviews', {
              itemId : params.itemId,
              userRating : userRating
            })
            .then((res) => {
                console.log(res.data);
                if(res.data.success === true){
                  console.log(res.data.data);
                  // setCountReviews((prev) => res.data.data.rating.count);
                  // setReviews((prev) => res.data.data.rating.rate);
                  notifyReviewAdded();
                  const addDelay = setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                  return () => clearTimeout(addDelay);
                }
              })
            .catch((error) => console.log(error));
        }
        else if(response.data.message === "You cannot review more than once"){
          notifyCouldNotAddReview();
        }
        
      })
      .catch((err)=> console.log(err));
    }

    const handleAddToCart = (e, id) => {              //to add the items in the cart from the main page
      //pushing the data about the individual product into DB
      // console.log(id);
      axios.post('/api/add-to-cart/', {
        itemId: id,
        userId : params.userId
      })
        .then((res)=> {
          console.log(res.data);
          if(res.data.success === true){
            notifyAddtoCart();
          } 
        })
        .catch((err)=> console.log(err));
      setCartStatus((prev) => !prev);
    }

    const notifyAddtoCart = () => toast.success("Item Added to Cart!");

    const handleDeleteFromCart = (e, itemId)=> {
      axios.post('/api/delete-from-cart/', {
        userId : params.userId,
        itemId: itemId
      })
        .then((res)=> {
          console.log(res.data);
          if(res.data.success === true){
            notifyDeleteFromCart();
          }
        })
        .catch((err)=> console.log(err));
      setCartStatus((prev) => !prev);
    }

    const notifyDeleteFromCart = () => toast.success("Item Deleted from Cart!");
    const notifyReviewAdded = () => toast.success("Review Added!");
    const notifyCouldNotAddReview = () => toast.error("You cannot Review More than Once!");
   

    return (
      <div className='item-details'>
        {
          cartItemIds && cartItemIds ? 
          <Navbar userId = {params.userId} cartItemLength = {cartItemIds.length}/> :  
          <Navbar userId = {params.userId}/>      //for 1st time login when we dont have any items in cart
        }
        <h1>Item Details</h1>
        {details === null || details === undefined ? <Spinner loading = {true}/> : <Spinner loading = {false}/>}
        {
          details && 
          <div>
            <div 
              className='cart-items' 
              style={{border: "1px solid lightgrey", 
              margin: "20px", 
              display:"flex",
              width: "100%", 
              height: "400px"
            }}>
                <img src={details.imageUrl} style={{width:"19%", margin:"30px",  marginLeft: "50px", marginTop:"50px", maxWidth: window.innerWidth/3}}/>
                <div style={{margin: "60px 0px 0px 20px", width: "1000px", maxWidth: window.innerWidth/1.75}}>
                  <h3>{details.title}</h3> 
                  <p style={{alignItems : "justify", textJustify: "inter-word"}}>{details.description}</p>
                  <h3>Price: $ {details.price}</h3>
                  
                  {/* <h3>Itemid: {details.itemId}</h3> */}
                </div>

                <div className='items-reviews' style={{margin: "100px 0px 0px 40px", width: "20%", display:"flex", flexDirection: "column"}}>            
                  <h4>Rating: {details.rating.rate.toString().slice(0, 3)} ⭐</h4>                    
                  <h4>Reviews: {details.rating.count}</h4>
                  <p><i>Category: {(details.category).toUpperCase()}</i>  </p>
                </div>
            </div>
                <Button onClick={(event) => navigate(`/${params.userId}/checkout/?productIdList=${details.itemId}`)} 
                variant="contained" color="error" size="large" sx={{margin: "20px", backgroundColor: "orange"}}
                >Buy Now</Button>

                {
                  cartItemIds && cartItemIds.includes(params.itemId) ? 
                  <Button onClick={(event) => handleDeleteFromCart(event, params.itemId)}
                    variant="contained" color="error" size="large" 
                    sx={{margin: "20px", backgroundColor: "orange"}}>
                    Delete from Cart
                  </Button>
                :
                  <Button onClick={(event) => handleAddToCart(event, params.itemId)}
                    variant="contained" color="error" size="large" 
                    sx={{margin: "20px", backgroundColor: "orange"}}>
                    Add to Cart
                  </Button>
                }

          </div>
        }

        <h2>👉 Enter Your Product Review 👈</h2>
        <input 
          type="number" 
          placeholder='Enter your rating' 
          max="5" 
          min="1" 
          style={{width: "200px", color:"black"}}
          onChange={(e)=> {
            setUserRating(e.target.value);  
          }}
          onKeyDown={(event) => {event.preventDefault()}}
        />
  
        <div>
          <input type="text" placeholder='Write a Product Review:' 
            style={{width: "60%", height: "70px", borderRadius: "10px", fontSize: "15px", margin: "20px", color: "black"}}
            onChange = {(e)=>{
              setReviews((prev) => e.target.value);
            }}
            />
            <Button variant='contained' color="secondary" disabled={reviews.length === 0 || userRating === 0} 
            onClick={handleReview}>Add Review</Button>
        </div>

        <div style={{border: "2px solid grey", margin: "20px"}}>
          <h1>Reviews:</h1>
          {getReviews === null || getReviews === undefined && noReviewsFound !== true  ? <Spinner loading = {true}/> : <Spinner loading = {false}/>}
          {
            noReviewsFound === true ? 
            <h3>No reviews found for this Product🥲</h3> 
            :
            <div>
              { getReviews && getReviews.map((value, index) => {
                return (
                <div key={index} style={{margin : "10px auto 10px auto",  width: "70%"}}>
                    <Card sx={{backgroundColor : "blanchedalmond"}}>
                      <CardHeader 
                        avatar={
                          <Avatar src={value.dp} alt="userDp" sx={{border: "2.5px solid black", scale : "1.2"}}/> 
                        }
                        title =  {
                        <div style={{display : "flex"}}>
                          <h2>{value.userName.toUpperCase()}</h2>
                          <h4 style={{marginLeft : "auto"}}>{value.userRating}<StarBorderRoundedIcon fontSize='medium'/></h4>
                        </div>
                        }
                        subheader= {"Reviewed on " + (value.createdAt).toString().slice(0, 10) + ", " + (value.createdAt).toString().slice(11, 16)}
                        
                        
                        titleTypographyProps = {{
                          fontSize: "20px",
                          textAlign : "left"
                        }}
                        subheaderTypographyProps = {{
                          fontSize: "15px",
                          textAlign : "left",
                          color : "brown"
                        }}
                        sx= {{margin : "10px 0px 0px 10px"}}
                      />
                      <span></span>
                      
                      <CardContent sx= {{margin : "-10px 0px 0px 10px"}}>
                        <Typography variant="h5" color="darkblue" sx={{textAlign : "left"}}>
                          {value.message}
                        </Typography>
                      </CardContent>
                      
                    </Card>
                </div>)
              })}
            </div>
          }
        </div>

        {/* <h4>Review {index+1} : {value.userName}</h4>
                  <Avatar src={value.dp} alt="userDp" />
                  <p>{value.message}</p> */}

        <BounceLoader
          color="lightgreen"
          loading={true}
          size={150}  
          cssOverride = {CSSProperties = {
            // display: "block",
            margin: "0 auto",
            borderColor: "red",
          }}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <BounceLoader
          color="lightgreen"
          loading={true}
          size={150}  
          cssOverride = {CSSProperties = {
            margin: "0 0",
            marginLeft : "150px",
            borderColor: "red",
          }}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <BounceLoader
          color="lightgreen"
          loading={true}
          size={150}  
          cssOverride = {CSSProperties = {
            // margin: "auto auto",
            marginTop : "-150px",
            marginRight : "150px",
            float : "right",
            borderColor: "red",
          }}
          aria-label="Loading Spinner"
          data-testid="loader"
        />

        <div>
          <h1>SIMILAR PRODUCTS</h1>
          {similarItems === null || similarItems === undefined ? <Spinner loading = {true}/> : <Spinner loading = {false}/>}
          <div  style={{display:"grid", gridTemplateColumns: "auto auto"}} >
          {
              similarItems && similarItems.map((value, index) => {
                return (
                  <div className='similar-products' style={{border: "2px solid maroon", margin : "10px"}} 
                  onClick = {() => {
                    navigate(`/${params.userId}/${value.itemId}/item-details`)
                    window.location.reload();
                  }}>
                    <img className='item-image' src={value.imageUrl} style={{width:"30%", margin:"30px",  marginLeft: "50px", marginTop:"30px", maxWidth: window.innerWidth/3, cursor : "pointer"}} 
                      onClick={(e) =>{ 
                        navigate(`/${params.userId}/${value.itemId}/item-details`)
                        window.location.reload()}}
                    />
                    <div style={{margin: "50px 0px 0px 50px", width: "100%", maxWidth: window.innerWidth/2.5, cursor : "pointer"}} 
                      onClick={(e) => {
                        navigate(`/${params.userId}/${value.itemId}/item-details`)
                        window.location.reload()}}
                    >
                      <h4 key={index}>{value.title}</h4> 
                      {/* <h3 key={index}>{value.itemId}</h3>  */}
                      <p >{value.description.slice(0, 60)}.....</p>
                      <p>Reviews: {value.rating.count}</p>
                      <h4>{(value.rating.rate).toString().slice(0,3)}⭐</h4>
                      <p><i>Category: {value.category}</i> </p>
                      <h3>Price: $ {value.price}</h3>
                    </div>
                  </div>
                )
                })
              }
          </div>
        </div>  
      <ToastContainer theme="light" />
      </div>
    )
}
