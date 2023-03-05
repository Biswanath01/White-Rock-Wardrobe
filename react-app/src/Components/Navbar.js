import React, {useEffect, useState} from 'react';
import './navbar.css';
import logo from './logo.jpg';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '@mui/material/Button';
import './Shop.css'
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PaidIcon from '@mui/icons-material/Paid';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import wave_background from './wave_background1.jpg';

export default function Navbar(props) {
  const navigate = useNavigate();
  const params = useParams();
  const [value, setValue] = React.useState();
  const [userDp, setUserDp] = useState();
  const [anchorElNav, setAnchorElNav] = React.useState(null);       //for modal
  const [anchorElUser, setAnchorElUser] = React.useState(null);     //for modal
  const [categories, setCategories] = useState();
  const [userIdFromLocalStorage, setUserIdFromLocalStorage] = useState();

  //for not letting people jump into other's shop or cart or orders
  useEffect(() => {
    console.log("Stuff from Navbar");
    const checkPrevLogin = localStorage.getItem("store");
    setUserIdFromLocalStorage((prev) => (JSON.parse(checkPrevLogin)).userId)
    if (checkPrevLogin) {
        // const user = JSON.parse(checkPrevLogin);
        // // setSignInStatus(true);
        // navigate(`/${user.userId}/shop`);
    }
    else{
      navigate('/');
    }
  }, []);

  useEffect(() => {
    const getUserDp = async() => {
      await axios.post('/api/get-dp-stats/', {
        userId : props.userId
      })
      .then((res) => {
          if(res.data.message === "Dp not found for this user"){
            navigate(`/${props.userId}/create-profile`);
            // navigate('/');
            // props.handleNoDp();
            console.log("User dp not present");
          }
          else{
            setUserDp((prev) => res.data);
          }
      })
      .catch((err) => console.log(err));
    }
    getUserDp();
  }, []);

  useEffect(() => {
    axios.get('/api/get-categories')
    .then((res) => {
      // console.log(res.data.data);
      setCategories((prev) => res.data.data)
    })
    .catch((err) => console.log(err));
  }, [])

  const handlelogout = (e) =>{
    localStorage.removeItem('store');
    navigate('/');
  }
  

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -1,
      top: 12,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }));


  return (
    <header>
      
    <div className='navbar-custom'>
      <div className='links' style={{backgroundImage : `url(${wave_background})`, backgroundSize: "cover"}}>
        <img src={logo} alt="logo" style={{width: "100px", height:"67px", margin: "10px 0px 0px 50px" , cursor: "pointer"}} onClick= {(e) => navigate(`/${props.userId}/shop`)}/>
  
        <div style={{marginRight: "0", marginLeft: "auto"}}>
          <ul style={{color: "white", display:"flex", textDecoration : "none", listStyle: "none", alignItems: "right", margin:"20px"}}>
            
            <li style={{margin: "10px 30px 10px 30px", cursor: "pointer"}} 
            onClick = {(e) => navigate(`/${props.userId}/profile`)}>
             {userDp && <Avatar src={userDp.data[0].userDp} alt="user Dp" sx={{marginTop : "-7px", border: "3px solid white"}} />} 
            </li>
    
            <li style={{margin: "10px 20px 10px 20px", cursor: "pointer"}}  
              onClick = {(e) => navigate(`/${props.userId}/shop`)}>
                <StorefrontIcon fontSize='large'/>
            </li>

            <li style={{margin: "2px 30px 10px 30px", cursor: "pointer"}} 
            onClick = {(e) => navigate(`/${props.userId}/cart`)}>
              <IconButton aria-label="cart">
                <StyledBadge badgeContent={props.cartItemLength} color="secondary">
                  <ShoppingCartIcon fontSize='large' sx={{color: "white"}}/>
                </StyledBadge>
              </IconButton>
            </li>

            <li style={{margin: "10px 30px 10px 30px", cursor: "pointer"}} 
            onClick = {(e) => navigate(`/${props.userId}/profile`)}>
              <PersonIcon fontSize='large'/></li>

            <li style={{margin: "10px 30px 10px 30px", cursor: "pointer"}} 
            onClick = {(e) => navigate(`/${props.userId}/sell-product`)}>
              <PaidIcon fontSize='large'/></li>
              
            <li style={{margin: "10px 30px 10px 30px", cursor: "pointer"}} 
            onClick = {(e) => handlelogout(e)}>
              <LogoutIcon fontSize='large'/></li>
          </ul>
        </div>
      </div>
    </div>
    
    <div className='category-bar' style={{backgroundColor: "lightslategray", height: "40px", marginTop: "-15px"}}>
          <span style={{margin: "0px 6px 6px 6px", fontSize: "15px", color: "whitesmoke"}}>CATEGORIES:</span>
            {categories && categories.map((value, index) => {
              return (
                <Button variant='contained' color = 'error' sx={{margin : "6px", backgroundColor: "orange"}} 
                onClick = {(e) => {
                  navigate(`/${params.userId}/category/${value}`)
                  {window.location.reload()}}}>
                  {value}</Button>
              )
            })}
        </div>
  </header>
  )
}


