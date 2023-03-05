import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function Calculator() {
    const [result, setResult] = useState(0);
    const [eqn, setEqn] = useState("");
    const [showAdvancedCalcu, setShowAdvancedCalcu] = useState(false);
    const [showTrigo, setShowTrigo] = useState("");
    const [showTrigoEqn, setShowTrigoEqn] = useState(false);
    const [i, setI] = useState(0);
    const [t, setT] = useState(true);
    const [history, setHistory] = useState([]);


    const handleChange = (e) => {
        setEqn((prev) => e.target.value);
        if(e.target.value === ""){
            setEqn((prev) => "");
            // setResult((prev) => 0);
        }
    }

    const handleNumber = (e) => {
        setEqn((prev) => prev + e.target.innerText);
    }

    const handleSin = (e) => {
        if(i===0){                                              //for handling the 1st case where the eqn will go inside the Math.sin()
            setResult((prev) => Math.sin(eval(eqn) * Math.PI/180));
            setI((prev) => prev+1);
        }
        else{                                                     //for handling the next cases where the Final Result will go inside the Math.sin()
            setEqn((prev) => (Math.sin(result * Math.PI/180)).toString());
        }
        setShowTrigo((prev) => `sin(${eqn})`);
        setShowTrigoEqn((prev) => true);
        
    }
    const handleCos = (e) => {
        if(i===0){
            setEqn((prev) => Math.cos(eval(eqn) * Math.PI/180));
            setI((prev) => prev+1);
            console.log(eqn);
        }
        else{
            setEqn((prev) => (Math.cos(result * Math.PI/180)).toString());
        }
        setShowTrigo((prev) => `cos(${eqn})`);
        setShowTrigoEqn((prev) => true);
    }
    const handleTan = (e) => {
        if(i===0){                      
            setResult((prev) => Math.tan(eval(eqn) * Math.PI/180));
            setI((prev) => prev+1);
        }
        else{
            setEqn((prev) => (Math.tan(result * Math.PI/180)).toString());
        }
        setShowTrigo((prev) => `tan(${eqn})`);
        setShowTrigoEqn((prev) => true);
    }

    const showResult = () => {
        if(i==0 && showTrigo===true){               //for handling the first time trigo fns
            setResult((prev) => eqn);
        }
        else{
            let res = 0;
            console.log(eqn);
            res = eval(eqn);
            setResult((prev) => res);
            setShowTrigo((prev) => "");
            setShowTrigoEqn((prev) => false);
        }
        setHistory((prev) => [...prev, result]);
    }

    const handleAC = () => {
        setEqn((prev) => "");
        setResult((prev) => 0);
        setShowTrigo((prev) => "");
        setI((prev) => 0);
        setShowTrigoEqn((prev) => false);
    }

    const handleClearInput = () => {
        setEqn((prev) => "");
        setShowTrigo((prev) => "");
        setShowTrigoEqn((prev) => false);
    }

    const handleDelete = () => {
        let e = eqn;
        let length = eqn.length;
        e = e.slice(0, length-1);
        setEqn(prev => e);
    
    }

    const showAdvCalc = () => {
        setShowAdvancedCalcu((prev) => !prev);
    }

    return (
        <div style={{backgroundColor: "blanchedalmond", height: window.innerHeight}}>
            {/* {console.log(showTrigo)} */}
            
            
            <h2><ins>CALCULATOR</ins></h2>
            <div style={{border: "2px solid green", margin : "auto", width: "60%", borderRadius : "5px"}}>
            {
                showTrigoEqn ? <h4 style={{color: "black"}}>{showTrigo}</h4> : 
                <div>
                    <h4 style={{color: "black"}}>{eqn}</h4>
                    {/* <h4 style={{color: "black"}}>{showTrigo}</h4> */}
                </div>
            }
            <TextField
                error
                id="outlined-error"
                label="OR TYPE YOUR EQN"
                type="text"
                onChange={handleChange}
                onKeyPress={(e) => {
                    if(e.key === "Enter"){
                        showResult();
                    }
                }}
                sx = {{margin : "10px 0px 10px 500px"}}
            />    
            {result && <h4 style={{color: "black"}}>Result is = {result}</h4> }
            </div>
            <div>
                <div style={{margin: "50px 600px -50px 0px"}}>
                    {showAdvancedCalcu ? <Button variant='contained' sx={{backgroundColor : "darkblue"}} onClick = {showAdvCalc}>+ &nbsp; - &nbsp; * &nbsp; /</Button> : 
                    <Button variant='contained' sx={{backgroundColor : "darkblue"}} onClick = {showAdvCalc}>sin cos tan exp log</Button> 
                    }
                </div>

                <div>
                    <Button variant='contained' color='secondary' sx={{backgroundColor : "rgb(52, 6, 104)", margin: "5px"}} onClick={handleNumber}>1</Button>
                    <Button variant='contained' color='secondary' sx={{backgroundColor : "rgb(52, 6, 104)", margin: "5px"}} onClick={handleNumber}>2</Button>
                    <Button variant='contained' color='secondary' sx={{backgroundColor : "rgb(52, 6, 104)", margin: "5px"}} onClick={handleNumber}>3</Button>
                    <Button variant='contained' color='secondary' sx={{backgroundColor : "rgb(52, 6, 104)", margin: "5px"}} onClick={handleNumber}>+</Button>
                </div>
                <div>
                    <Button variant='contained' color='secondary' sx={{backgroundColor : "rgb(52, 6, 104)", margin: "5px"}} onClick={handleNumber}>4</Button>
                    <Button variant='contained' color='secondary' sx={{backgroundColor : "rgb(52, 6, 104)", margin: "5px"}} onClick={handleNumber}>5</Button>
                    <Button variant='contained' color='secondary' sx={{backgroundColor : "rgb(52, 6, 104)", margin: "5px"}} onClick={handleNumber}>6</Button>
                    <Button variant='contained' color='secondary' sx={{backgroundColor : "rgb(52, 6, 104)", margin: "5px"}} onClick={handleNumber}>-</Button>
                </div>
                <div>
                    <Button variant='contained' color='secondary' sx={{backgroundColor : "rgb(52, 6, 104)", margin: "5px"}} onClick={handleNumber}>7</Button>
                    <Button variant='contained' color='secondary' sx={{backgroundColor : "rgb(52, 6, 104)", margin: "5px"}} onClick={handleNumber}>8</Button>
                    <Button variant='contained' color='secondary' sx={{backgroundColor : "rgb(52, 6, 104)", margin: "5px"}} onClick={handleNumber}>9</Button>
                    <Button variant='contained' color='secondary' sx={{backgroundColor : "rgb(52, 6, 104)", margin: "5px"}} onClick={handleNumber}>*</Button>
                </div>
                <div>
                    <Button variant='contained' color='secondary' sx={{backgroundColor : "rgb(52, 6, 104)", margin: "5px"}} onClick={handleNumber}>10</Button>
                    <Button variant='contained' color='secondary' sx={{backgroundColor : "rgb(52, 6, 104)", margin: "5px"}} onClick={handleNumber}>0</Button>
                    <Button variant='contained' color='secondary' sx={{backgroundColor : "rgb(52, 6, 104)", margin: "5px"}} onClick={handleNumber}>100</Button>
                    <Button variant='contained' color='secondary' sx={{backgroundColor : "rgb(52, 6, 104)", margin: "5px"}} onClick={handleNumber}>/</Button>
                </div>
                <div>
                    <Button variant='contained' color='secondary' sx={{backgroundColor : "rgb(52, 6, 104)", margin: "5px"}} onClick={handleNumber}>(</Button>
                    <Button variant='contained' color='secondary' sx={{backgroundColor : "rgb(52, 6, 104)", margin: "5px"}} onClick={handleNumber}>)</Button>
                    <Button variant='contained' color='secondary' sx={{backgroundColor : "rgb(52, 6, 104)", margin: "5px"}} onClick={handleNumber}>.</Button>
                    <Button variant='contained' color='error' sx={{backgroundColor : "orange", margin: "5px"}} onClick={handleDelete}> Del</Button>
                </div>
                <div>
                    <Button variant='contained' color='error' sx={{backgroundColor : "orange", margin: "5px"}} onClick={handleAC}>AC</Button>
                    <Button variant='contained' color='error' sx={{backgroundColor : "orange", margin: "5px"}} onClick={handleClearInput}> Clear </Button>
                    <Button variant='contained' color='success' sx={{backgroundColor : "green", margin: "5px", width: "138px"}} onClick={showResult}>=</Button>
                </div>
                {
                    showAdvancedCalcu && 
                    <div>
                        <div>
                            <Button variant='contained' color='error' sx={{backgroundColor : "brown", margin: "5px"}} onClick={handleSin}>sin</Button>
                            <Button variant='contained' color='error' sx={{backgroundColor : "brown", margin: "5px"}} onClick={handleCos}>cos</Button>
                            <Button variant='contained' color='error' sx={{backgroundColor : "brown", margin: "5px"}} onClick={handleTan}>tan</Button>
                            <Button variant='contained' color='error' sx={{backgroundColor : "brown", margin: "5px"}}>x²</Button>
                        </div>
                        <div>
                            <Button variant='contained' color='error' sx={{backgroundColor : "brown", margin: "5px"}}>log</Button>
                            <Button variant='contained' color='error' sx={{backgroundColor : "brown", margin: "5px"}}>e</Button>
                            <Button variant='contained' color='error' sx={{backgroundColor : "brown", margin: "5px"}}>exp</Button>
                            <Button variant='contained' color='error' sx={{backgroundColor : "brown", margin: "5px"}}>√</Button>
                        </div>
                    </div>
                }
            </div>

            <div style={{margin: "100px 600px -50px 0px"}}>
                <h3>History</h3>
                {history && history.map((value, index) => {
                    return (
                            <h4>{value}</h4>
                    )
                })}
            </div>
        
            
        </div>
    );

    
};


