import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
//import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import './Checkout.css';
import 'react-toastify/dist/ReactToastify.css';
import PaymentModal from "./PaymentModal";
import SyncLoader from "react-spinners/SyncLoader";
import Navbar from "./Navbar";
import './Shop.css';
import Spinner from './Spinner';
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';

export default function CheckoutPage(props){
    const params = useParams();
    const navigate = useNavigate();
    const [qParams, setQParams] = useSearchParams();
    const [itemData, setItemData] = useState();
    const [showPayment, setShowPayment] = useState(false);
    const [productData, setProductData] = useState();
    const [cardNo, setCardNo] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [addressStatus, setAddressStatus] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState(0);
    const [userName, setUserName] = useState();
    let [loading, setLoading] = useState(false);
    let [navigatingTitle, setNavigatingTitle] = useState("");
    

    useEffect(() => {
        axios.post('/api/get-user-details/', {
            userId : params.userId
        })
        .then((res) => setUserName((prev) => res.data.data.userName))
        .catch((err) => console.log(err));
    }, []);


    // useEffect(() => {
    //   let a = 5;
      
    //     setTimeout(() => {
    //         setNavigatingTitle((prev) => "Navigating to Main page in " + a);
    //         a=a-1;
    //     }, 1000);
    // }, [])
    
    

    useEffect(() => {
        // const productId = qParams.get("productId"); 
        // axios.get(`/api/get-items/?productId=${productId}`)
        //     .then((res) => {
        //         setItemData(res.data.data[0]);
        //         console.log(res.data.data[0]);
        //     })
            
        //     .catch((err) => console.log(err));
        const productIdList = qParams.get("productIdList").split(",");
        console.log("productIdList", productIdList);
        setItemData((prev) => productIdList);


        axios.post('/api/product-data-for-cart/', {         //handle the object of array of itemID in the backend
            itemId : productIdList          
        })         
            .then((res) => {
                // console.log(res.data.data);
                setProductData((prev)=> res.data.data);
            })
            .catch((err) => console.log(err));       
    }, []);    

    useEffect(() => {                    //to find the total price of all the products to buy
        productData && productData.map((value, index) => {     
            setTotalPrice((prev) => (prev) + value.price);
            // console.log(value.price);
        })
    }, [productData])
    

    const handlePayment = async(event) => {
        const productIdList = qParams.get("productIdList").split(",");
        await axios.post('/api/delete-multiple-items/', {
            userId : params.userId,
            itemIdList : productIdList
        })
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        
        itemData.map(async(value, index) => {
            await axios.post('/api/save-purchase-details/', {       //mind that there will be only 1 round brackets in axios.post NOT 2
                userId : params.userId,
                itemId : value
            })
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err));
        })

        setLoading(true);
        toast.success("Payment Successful!😁 Your products will be delivered to you soon...");

        setNavigatingTitle((prev) => "Navigating to Main page in " + 5 + " seconds...");

        let j = 4;
        for(let i = 4; i>=1; i--){
            setTimeout(() => {
                setNavigatingTitle((prev) => "Navigating to Main page in " + i + " seconds...");
            }, (j-i+1)*1000);
        }
        
        // setTimeout(() => {
        //     setNavigatingTitle((prev) => "Navigating to Main page in " + 4 + " seconds");
        //     // a=a-1;
        // }, 1000);
        // setTimeout(() => {
        //     setNavigatingTitle((prev) => "Navigating to Main page in " + 3 + " seconds");
        //     // a=a-1;
        // }, 2000);
        // setTimeout(() => {
        //     setNavigatingTitle((prev) => "Navigating to Main page in " + 2 + " seconds");
        //     // a=a-1;
        // }, 3000);
        // setTimeout(() => {
        //     setNavigatingTitle((prev) => "Navigating to Main page in " + 1 + " seconds");
        //     // a=a-1;
        // }, 4000);
        

        setTimeout(() => {
            navigate(`/${params.userId}/shop`);
        }, 5000);
    }

    const handleModal = () => {
        setShowPayment(false);
    }

    const handleDeliveryAddress = (event) => {
        setDeliveryAddress((prev) => event.target.value);
        // console.log(event.target.value);
    }

    const handlePaymentModalClose = () => {
        setShowPayment((prev) => false);
    };

    const setPaymentMethodClick = (event) => {
        setPaymentMethod((prev) => event.target.value);
    }

    // const paymentMethod = () => {
    //     setPaymentMethod((prev))
    // }

    const setCardNoFn = (no) => {
        setCardNo((prev) => no);
        // console.log(no);
    }
    
    const override: CSSProperties = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
    };


    return(
        <div className="checkout-page" style={{height: "100%"}}>
            <Navbar userId = {params.userId}/>
            <h1>Checkout Page</h1>
            {productData ? 
            <div>
                <Spinner loading = {false}/>
            <div style={{border: "2px solid orange", width: "30%", margin: "auto", marginTop: "10px"}}>
                <h4 style={{textDecoration: "underline"}}>Order Summary</h4>
                <div className="order-summary">
                    {productData && <p>Items : {productData.length}</p>}
                    {productData && <p>Total : $ {parseFloat(totalPrice).toFixed(2)}</p>}
                </div>
            </div>
            <input type="text" placeholder="Enter Delivery Address:" onChange={handleDeliveryAddress} style={{margin: "10px", color:"black"}}/>
            <Button variant="contained" color="secondary" disabled={deliveryAddress.length ===0} onClick={(e) => setAddressStatus((prev) => true)}>Submit</Button>
            {productData && addressStatus && <p style={{margin: "10px"}}>Your product(s) will be delivered to: <strong>{userName}</strong>, {deliveryAddress}</p>}
            <div className="all-checkout-products">
                {productData && productData.map((value, index) => {
                    return <div className="checkout-products" key={index} onClick= {(e) =>  navigate(`/${params.userId}/${value.itemId}/item-details`)}>
                            <p>Item {index+1}</p>
                            <img src={value.imageUrl} style={{width: "45%", height: "250px"}}/>
                            <h5>{value.title}</h5>    
                            <h4 style={{marginTop: "40px"}}><strong>Price: $ {value.price}</strong></h4>
                    </div>
                })}
            </div>

            <SyncLoader
                color="red"
                loading={loading}
                cssOverride={override}
                size={20}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
          <div style={{fontSize : "30px"}}>
            {navigatingTitle}
          </div>
            
            <Button variant="contained" color="secondary" size="large" disabled={!addressStatus} sx={{margin: "20px", fontSize: "12px", backgroundColor: "orange"}}
                onClick={(e) => setShowPayment((prev) => true)}>
                Place Your Order and Start Payment
            </Button>

            {showPayment && 
            <PaymentModal 
                open={showPayment} 
                handleClose={handlePaymentModalClose} 
                paymentMethodHandler = {setPaymentMethodClick} 
                handlePayment = {handlePayment} 
                paymentMethod = {paymentMethod} 
                cardNo = {cardNo} 
                setCardNoFn={setCardNoFn} 
                deliveryAddress = {deliveryAddress}
            />}            
            <ToastContainer />
            </div>
            : 
                <Spinner loading = {true}/>
            }

        </div>
    )
}