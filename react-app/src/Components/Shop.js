import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './navbar.css'
import { useNavigate, useParams } from 'react-router-dom';
import './Shop.css';
import _, { toInteger } from 'lodash';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HashLoader from "react-spinners/HashLoader";
import DotLoader from "react-spinners/DotLoader";
import TextField from '@mui/material/TextField';
import Navbar from './Navbar';
import { override } from "./Override.ts";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Spinner from './Spinner';


export default function Shop(props) {
  // const [baseUrl, setBaseUrl] = useState("https://fakestoreapi.com/products?limit=50");
  const [data, setData] = useState([]);
  const [userDetails, setUserDetails] = useState();
  const navigate = useNavigate();
  const params = useParams();
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currPage, setCurrPage] = useState(0);
  const [nextPage, setNextPage] = useState(itemsPerPage);
  const [isPriceAscending, setIsPriceAscending] = useState(false);
  const [isReviewAsc, setIsReviewAsc] = useState(false);
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState("");
  const [showStar, setShowStar] = useState([]);
  const [cartStatus, setCartStatus] = useState(false);
  const [cartItemIds, setCartItemIds] = useState();
  const [userName, setUserName] = useState("");           //to show welcome username
  // const [categories, setCategories] = useState();
  let [loading, setLoading] = useState(true);
  let [loadingDot, setLoadingDot] = useState(false);
  let [color, setColor] = useState("#ffffff");
  const [searchedItemIds, setSearchedItemIds] = useState();
  const [searchProduct, setSearchProduct] = useState();

  // for fetching the user details and showing stars
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("store"));
    let s = [];
    for(let i=1; i<=5; i++){
      s.push(i);
    }
    setShowStar((prev) => s);
    // console.log("This is " + user.userName);
    if(user)
    {
      setUserDetails(user.userName);        //for showing Welcome username;
      if(user.userId !== params.userId){
        navigate("/");
      }
    } 
    else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
      getProducts(); 
  }, [])
  
  useEffect(() => {
    const addDelay = setTimeout(() => {
      getSearchProductIds(search);
    }, 1000);
    return () => clearTimeout(addDelay);
  }, [search]);

  useEffect(() => {
    axios.post('/api/product-data-for-cart', {
      itemId : searchedItemIds
    })
    .then((res) => setData((prev) => res.data.data))
    .catch((err) => console.log(err));
  }, [searchedItemIds])
  


  useEffect(()=> {
    setLocation((prev) => (Intl.DateTimeFormat().resolvedOptions().timeZone.split("/")[0]));
  }, []);
  
  //to show add to/delete from from cart
  useEffect(() => {
    const getCartItems = async() => {
      console.log("Getting cart itemId from backend");  // we are calling get-cart-items becuase we already have the product data so we can easily map throught it. 
      await axios.get(`/api/get-cart-items/${params.userId}`) 
      .then((res)=> {
        setCartItemIds((prev) => res.data.data);      //the array of Id of cart items
        // console.log(res.data.data);           
      })
      .catch((err)=> console.log(err));
    }
    getCartItems();
  }, [cartStatus]);

  const getSearchProductIds = async (searchTerm) => {
    await axios.post(`/api/get-search/`, {
      search : search
    })
      .then((res) => {
        if(res === null){
          <Spinner loading = {true}/>
        }
        else{
          <Spinner loading = {false}/>
        }
          setSearchedItemIds((prev) => res.data.data)
      })
      .catch((err) => console.log(err));
  }

  //to get all the products from the backend
  const getProducts = async() => {
    await axios.get('/api/get-products/')         
      .then((res)=>{
        if(res===null){
          setLoading(true);
        }
        else{
          setLoading(false);
          // console.log(res.data.products);
          setData((prev) => res.data.products);
        }
      })
      .catch((err)=>{
        console.log(err);
      })
  };

  const handlelogout = (e) =>{
    localStorage.removeItem('store');
    navigate('/');
  }
 
  const handlePageChange = (event, page) => {       //pagination purposes
      // console.log(page);
      setCurrPage((page-1)*itemsPerPage);
      setNextPage((page)*itemsPerPage);
      window. scrollTo({                            //to smoothly go to top of a window when clicking on next page in pagination
        top : 0,
        behavior: "smooth"
      });
  }

  const handlePriceSort = () => {                 //sorting according to price
    setIsPriceAscending((prev) => !prev);
    var newData = _.cloneDeep(data);
    newData && newData.sort(function(x, y){
      return isPriceAscending ? x.price - y.price : y.price - x.price;
    });
    setData((prev) => newData);
  }

  const handleReviewSort = () => {                 //sorting according to reviews
    setIsReviewAsc((prev) => !prev);
    var newData = _.cloneDeep(data);
    newData && newData.sort(function(x, y){
      return isReviewAsc ? x.rate - y.rate : y.rate - x.rate;
    })
    setData((prev) => newData);
  }

  const handleSearch = (searchval) =>{              //search bar implementation
    setSearch((prev)=> searchval);
  }

  const handleAddToCart = (e, id) => {              //to add the items in the cart from the main page
    //pushing the data about the individual product into DB
    console.log(id);
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

  const pageRefresh = () => {
    setCartStatus((prev) => !prev);
  }

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

  const showPriceAcctoLoc = () =>{

  }

  const notifyAddtoCart = () => toast.success("Item Added to Cart!");
  const notifyDeleteFromCart = () => toast.success("Item Deleted from Cart!");

  // const override: CSSProperties = {
  //   display: "block",
  //   margin: "0 auto",
  //   borderColor: "red",
  // };

  const handleNoDp = () => {
    navigate(`/${params.userId}/create-profile`);
  }


  return(
    <div className='shop'>
      {
        cartItemIds && cartItemIds ? 
        <Navbar userId = {params.userId} cartItemLength = {cartItemIds.length}/> :  
        <Navbar userId = {params.userId}/>      //for 1st time login when we dont have any items in cart
      }
        <div className='shop-title'>   
          {userDetails && 
            <h3 style={{position: "absolute", right: "10px", backgroundColor: "rgb(28, 38, 53)"}}>Welcome {userDetails} 😁</h3>
          }
          <div className='shop-title'>   
            <h1>WHITE ROCK WARDROBE</h1>
            <p style={{margin: "-10px 0px 20px 172px"}}>Shopping Made Easy, Simple and Enjoyable</p>
          </div>
        </div>
       
        {loading ? 
        // <HashLoader
        //   color="red"
        //   loading={loading}
        //   cssOverride={override}
        //   size={150}
        //   aria-label="Loading Spinner"
        //   data-testid="loader"
        // />  
        <Spinner loading = {true}/>
        // <DotLoader           //for implementing the search bar
        //   color="red"
        //   loading={loadingDot}
        //   cssOverride={override}
        //   size={150}
        //   aria-label="Loading Spinner"
        //   data-testid="loader"
        // />
          :
          <div>
            <Spinner loading = {false}/>
            <TextField
              error
              label="Search..." color="secondary" 
              sx={{width:"50%", margin : "10px 0px 20px 0px"}}
              fontSize = "large"
              onChange={(e)=>{
                handleSearch(e.target.value);
            }}
              InputProps={{style:{fontSize : "14px", color:"white"}}} InputLabelProps={{style:{fontSize : "12px", marginTop: "3px"}}}
            />
              <div>
                <Button variant="contained" color="secondary" size='large' sx={{margin:"5px", fontSize: "10px"}} onClick={handlePriceSort}>Sort {isPriceAscending ? "Ascending @Price" : "Descending @Price"}</Button>
                <Button variant="contained" color="secondary" size='large' sx={{margin:"5px", fontSize: "10px"}} onClick={handleReviewSort}>Sort {isReviewAsc ? "Ascending @Rating" : "Descending @Rating"} </Button>
              </div>
          </div>
      }
        <div className='products'> 
          {/* {console.log(cartItems)} */}
          
            {data && data.slice(currPage, nextPage).map((key, index)=>{
              return (      
                <div 
                  key={index}
                  className='shop-items' 
                  style={{border: "2px solid maroon", margin: "5px", display:"flex", width: "100%", height: "350px"}}
                  onClick = {() => navigate(`/${params.userId}/${key.itemId}/item-details`)}
                >
                    <img className='item-image' src={Object.keys(key).includes("image") ? key.image : key.imageUrl} onClick= {()=>{
                      navigate(`/${params.userId}/${key.itemId}/item-details`);
                    }}/>
                    <div className='items' style={{margin: "10% 5px 10px 10px", marginLeft: "20px" ,width: "100%", maxWidth: window.innerWidth/2.5}} onClick= {()=>{
                      navigate(`/${params.userId}/${key.itemId}/item-details`);
                    }}>
                      <h3 key={index}>{key.title}</h3> 
                      <p>{key.description.slice(0, 60)}....</p>
                    </div>
                    <div className='items-reviews' style={{margin: "10% 5px 10px 10px", marginLeft: "20px" ,width: "100%"}}>
                      <div>
                        
                        { Object.keys(key).includes("rate") ?   
                        //for handling the get products and only data.rate
                          showStar && showStar.map((value, newkey)=> {
                            return (value <= Math.round(key.rate) ? <span key={value}>⭐</span> : <span key={value}>⚝ </span>
                            // return (value <= toInteger((key.rate)) ? <span>⭐</span> : 
                            //   <span> toInteger((((key.rate*10))%10)%5) > 2 ? <span>Half</span> : <span>blank</span></span>  
                            // )
                            )
                          }) : 
                          //for handling the product data for cart and only data.rating.rate
                          showStar && showStar.map((value, newkey)=> {
                            return (value <= Math.round(key.rating.rate) ? <span key={value}>⭐</span> : <span key={value}>⚝ </span>
                            )
                          })
                        }
                        <span>{Object.keys(key).includes("rate") ? key.rate.toString().slice(0, 3) : key.rating.rate.toString().slice(0, 3)}</span>
                      </div>
                      <h5>Reviews: {Object.keys(key).includes("rate") ? key.count : key.rating.count}</h5>
                      <p><i>Category: {key.category}</i>  </p>
                      <h3>Price: $ {key.price} </h3>
                      
                      { cartItemIds && cartItemIds.includes(key.itemId) ?
                      <Button variant="contained" color="error" size="large" sx={{margin: "15px", backgroundColor: "orange"}}
                        onClick={(e) => {
                        handleDeleteFromCart(e, key.itemId) 
                      }}>Delete from Cart</Button> :
                      
                      <Button variant="contained" color="success" size="large" sx={{margin: "10px", backgroundColor: "mediumgreen"}}
                        onClick={(e) => {
                        handleAddToCart(e, key.itemId)
                      }}>Add to Cart</Button>}
                  </div>
                </div>
              )
            })}

            <Pagination count={Math.ceil(itemsPerPage*8/itemsPerPage)} 
              variant="outlined" 
              color="secondary" 
              onChange={handlePageChange}
              sx = {{ position: "fixed", bottom: "0", left: "38%", background:"white" }}/>
        </div>
        <ToastContainer theme="light" />
    </div>
  )
}
