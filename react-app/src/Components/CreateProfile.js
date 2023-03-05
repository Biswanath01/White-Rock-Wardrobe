import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function CreateProfile(props) {
    const params = useParams();
    const navigate = useNavigate();

    const [userDp, setUserDp] = useState();
    const [profilePic, setProfilePic] = useState();
    const [imageUrl, setImageUrl] = useState();
    const [profileAge, setProfileAge] = useState();

    useEffect(() => {
      if(profilePic){
          setImageUrl(prev => URL.createObjectURL(profilePic));
      } 
      else return;
    }, [profilePic]);

    const handleUploadImage = (event) => {
      // console.log("Hey");
      setProfilePic(event.target.files[0]);
      // console.log(event.target.files[0]);
      // setPicUploaded(true);
    }

    const handleCreateProfile = (event) => { 
      // console.log("Hey");
      event.preventDefault();
      // console.log(profilePic);
      let formData = new FormData();
      formData.append("image", profilePic, profilePic.name);

      axios.post(`/api/save-profile-pic/${params.userId}/`, formData)
        .then((res) => {
            if(res.error){
                console.log("Error");
            } else {
                navigate(`/${params.userId}/shop`);
            }
        })
        .catch((err) => console.log(err));
    };

  return (
    <div style={{color: "wheat", height: window.innerHeight}}>
      <h1>Create Your Profile</h1>
        <div>
            <TextField
              required
              error
              label="Age"
              type= "number"
              sx={{width:"10%", margin : "10px 0px 20px 0px", color: "wheat"}}
              fontSize = "large"
              onChange={(e)=>{
                setProfileAge(e.target.value)
            }}
              InputProps={{style:{fontSize : "15px", color:"white"}}} InputLabelProps={{style:{fontSize : "15px"}}}
            />

            <h3 style={{color: "wheat"}}>Enter Your Profile Pic *</h3>
            <input type="file" accept='image/*' style={{color: "wheat", margin: "auto"}} onChange={handleUploadImage}/>
            {profilePic && <img 
                src={imageUrl}
                style={{width: "50px", height: "50px", borderRadius: "50%", marginRight: "30px", marginTop: "20px"}}
            />}
            <Button disabled={!imageUrl || !profileAge} variant="contained" color='error' onClick={handleCreateProfile}>PROCEED</Button>
        </div>
    </div>
  )
}
