import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Navbar from './Navbar';
import './Shop.css';
import Spinner from './Spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Profile(props) {
    const params = useParams();
    const navigate = useNavigate();
    const [purchaseDetails, setPurchaseDetails] = useState();
    const [userData, setUserData] = useState();
    const [productDetails, setProductDetails] = useState();
    const [purchaseStats, setPurchaseStats] = useState(true);      
    const [showPastOrders, setShowPastOrders] = useState();
    const [dateChanged, setDateChanged] = useState(false);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    //for getting the user Details (username, email, userId)
    useEffect(() => {
        axios.post('/api/get-user-details', {
            userId : params.userId
        })
        .then((res) => {
            setUserData((prev) => res.data.data);
        })
        .catch((err) => console.log(err));
    }, []);

    //to get the purchase details like itemId, userId, createDate
    useEffect(() => {
        const getPurchaseDetails = async() => {
            await axios.get(`/api/get-purchase-details/${params.userId}`)
            .then((res) => { 
                // console.log("yes",  res);
                if(res.data.success === false){
                    setPurchaseStats((prev) => false);      //if the user have not bought anything
                }
                let data = [];
                res.data.data[0].itemId.map((val, index) => {
                    data.push({
                        userId : res.data.data[0].userId,
                        itemId : val,
                        purchaseDate : res.data.data[0].purchaseDate[index]
                    })
                })
                setPurchaseDetails((prev) => data);
            })
            .catch((err) => console.log(err));
       }
       getPurchaseDetails();
    }, [])

    useEffect(() => {
        const getItemDetails = async() => {
            // console.log("purchaseDetails", purchaseDetails);
            let itemIds = [];
            purchaseDetails.map((val, index) => {
                itemIds.push(val.itemId);
            })
            await axios.post('/api/product-data-for-cart/', {
                itemId : itemIds
            })
            .then((res) => { 
                // console.log(res.data.data);
                if(res.data.message === "No products in the cart"){
                    
                    setPurchaseStats((prev) => false);
                }
                setProductDetails((prev) => res.data.data);
            })
            .catch((err) => console.log(err));
        }
        getItemDetails();
        
    }, [purchaseDetails, dateChanged]);

    const handlelogout = (e) =>{
        localStorage.removeItem('store');
        navigate('/');
    }

    const handlePastOrders = async(e) => {
        let val = e.target.value;
        await axios.post('/api/get-past-orders/', {
            userId : params.userId,
            value : val
        })
        .then((res) => {
            // console.log("Getting past orders(PurchaseDetails)", res.data.data);
            setPurchaseDetails((prev) => res.data.data);
            setDateChanged((prev) => true);
        })
        .catch((err) => console.log(err));
    }

    const handleChangePassword = () => {
        if(newPassword !== confirmNewPassword){
            return (notifyNewConfirmPWDNotSame());
        }
        else if(oldPassword === newPassword){
            return (notifyNewAndOldPWDSame());
        }
        else{
            axios.post('/api/change-password', {
                userId : params.userId,
                oldPassword : oldPassword,
                newPassword : newPassword
            })
            .then((res) => {
                console.log(res.data);
                if(res.data.message === "Successfully Changed the Password"){
                    notifyPasswordChanged();
                    // setInterval(() => {
                    //     handlelogout();     //to make the user Login again
                    // }, 4000);
                }
            })
            .catch((err) => console.log(err));
        }
    }

    const notifyNewConfirmPWDNotSame = () => toast.error("New Password and Confirmed Password are not the same!");
    const notifyNewAndOldPWDSame = () => toast.error("Old Password and New Password could not be the same!");
    const notifyPasswordChanged = () => toast.success("Password changed successfully!");


    return (
        <div className='profile'>
            <div>
                <Navbar userId = {params.userId}/>
                <h2>Your Profile</h2>
                {userData && 
                    <div>
                        <h5>Your UserName : {userData.userName}</h5>
                        <h5>Your Email : {userData.email.slice(0, 2)} * * * * * * * {userData.email.slice(9)}</h5>
                        <div style={{color : "black"}}>
                            Want to Change Password ? 
                            <input type="password" placeholder='Enter Old Password' onChange={(e) => {
                                setOldPassword((prev) => e.target.value);
                            }}/>
                            <input type="password" placeholder='Enter New Password' onChange={(e) => {
                                setNewPassword((prev) => e.target.value);
                            }}/>
                            <input type="password" placeholder='Confirm New Password' onChange={(e) => {
                                setConfirmNewPassword((prev) => e.target.value);
                            }}/>
                            <button disabled = {!oldPassword || !newPassword || !confirmNewPassword} onClick={handleChangePassword}>Change Password</button>
                        </div>
                    </div>
                }
                {
                    purchaseStats === false ?  <h3>You Have Not Bought Anything</h3> : 
                    <div>
                        {productDetails === null || productDetails === undefined ? <Spinner loading = {true}/> : 
                        <div>
                            <Spinner loading = {false}/>
                            <h3>Your Orders</h3>
                            <div>
                                <select style={{color: "black"}} onChange = {handlePastOrders}>
                                    <option selected disabled>Select time Stamp</option>
                                    <option value="1">Past 7 days</option>
                                    <option value="2">Past 15 days</option>
                                    <option value="3">Past 1 month</option>
                                    <option value="4">Past 3 months</option>
                                    <option value="5">Past 6 months</option>
                                    <option value="6">All Time</option>
                                </select>
                                
                            </div>
                                {productDetails && purchaseDetails && purchaseStats === true ? productDetails.map((key, index) => {
                                    return (
                                        <div 
                                            className='cart-items' 
                                            key={index}
                                            style={{border: "1px solid lightgrey", 
                                            margin: "10px", 
                                            display:"flex",
                                            width: "100%", 
                                            height: "400px"}}
                                            >
                                            <img src={key.imageUrl} style={{width:"19%", margin:"30px",  marginLeft: "50px", marginTop:"30px", maxWidth: window.innerWidth/3, cursor : "pointer"}} 
                                            onClick={(e) => navigate(`/${params.userId}/${key.itemId}/item-details`)}/>
                                            <div style={{margin: "50px 0px 0px 50px", width: "100%", maxWidth: window.innerWidth/1.5, cursor : "pointer"}} 
                                                onClick={(e) => navigate(`/${params.userId}/${key.itemId}/item-details`)}>
                                                    <h3 key={index}>{key.title}</h3> 
                                                {/* <h3 key={index}>{key.itemId}</h3>  */}
                                                {/* <p>{key.description}</p> */}
                                                
                                                {/* {dateChanged && dateChanged === true && purchaseDetails[index] !== undefined && Object.keys(purchaseDetails[index]).includes("purchaseDate") ? 
                                                    <div>
                                                        {console.log(purchaseDetails[index])}
                                                        <p>Purchase Date : {purchaseDetails[index].purchaseDate && new Date(purchaseDetails[index].purchaseDate).toString()}</p>
                                                    </div> : 
                                                    <p>Purchase Date: {purchaseDetails[0].purchaseDate[index] && new Date(purchaseDetails[0].purchaseDate[index]).toString().slice(0,20)}</p>} */}
                                                {/* {console.log(purchaseDetails[0].purchaseDate[index] && purchaseDetails[0].purchaseDate[index])} */}
                                                
                                                {purchaseDetails[index] !== undefined && Object.keys(purchaseDetails[index]).includes("purchaseDate") &&
                                                    <div>
                                                        {/* {console.log(purchaseDetails[index])} */}
                                                        <p>Purchase Date : {purchaseDetails[index].purchaseDate && new Date(purchaseDetails[index].purchaseDate).toString().slice(0,21)}</p>
                                                    </div> }


                                                <h4>Reviews: {key.rating.count}</h4>
                                                <h3>{key.rating.rate.toString().slice(0,3)}⭐</h3>
                                                <p><i>Category: {key.category}</i>  </p>
                                                <h3>Price: $ {key.price}</h3>
                                            </div>
                                            <Button onClick={(event) => navigate(`/${params.userId}/checkout/?productIdList=${key.itemId}`)} 
                                            variant="contained" color="error" size="large" sx={{margin: "200px 20px", backgroundColor: "orange", height : "50px", width : "100px"}}
                                            >Buy Again</Button>

                                        </div>
                                    )}
                                    ): <h4><strong>You have No orders</strong></h4>}
                            </div>
                            }
                        </div>
                            }
                    </div>
                <ToastContainer />
            </div>
    )
}



 