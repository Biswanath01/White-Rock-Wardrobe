import { toNumber } from 'lodash';
import React, { useState, useEffect } from 'react';
import AlarmSound from './AlarmSound.mp3';

export default function Alarm() {
    const [alarmTime, setAlarmTime] = useState("");

    //we have to update this in an useeffect
    const [currSeconds, setCurrSeconds] = useState();
    const [currMinutes, setCurrMinutes] = useState();
    const [currHours, setCurrHours] = useState();
    const [t, setT] = useState(true);
    const [showAlertAlarm, setShowAlertAlarm] = useState(false);
    const [showAlarmDesc, setShowAlarmDesc] = useState(false);

    useEffect(() => {
        setCurrSeconds((prev) => (new Date(Date.now())).getSeconds());
        setCurrMinutes((prev) => (new Date(Date.now())).getMinutes());
        setCurrHours((prev) => (new Date(Date.now())).getHours());
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrSeconds((prev) => (new Date(Date.now())).getSeconds());
            setCurrMinutes((prev) => (new Date(Date.now())).getMinutes());
            setCurrHours((prev) => (new Date(Date.now())).getHours());
            // const minute = alarmTime.slice(3);
            // const hour = alarmTime.slice(0, 2);
            // console.log("currSeconds", (new Date(Date.now())).getSeconds());
            // console.log("currMinutes", (new Date(Date.now())).getMinutes());
            // console.log("currHours", (new Date(Date.now())).getHours());
            // console.log("Alarm minute: ", toNumber(alarmTime.slice(3)));
            // console.log("Alarm hour: ", toNumber(alarmTime.slice(0, 2)));
            // console.log("******************");
            if ((new Date(Date.now())).getHours() === toNumber(alarmTime.slice(0, 2)) && (new Date(Date.now())).getMinutes() === toNumber(alarmTime.slice(3))) {
                var audio = new Audio(AlarmSound);
                audio.play();
                setShowAlertAlarm((prev) => true);
                setAlarmTime((prev) => "");
                setShowAlarmDesc((prev) => false);
            }
            else {
                setShowAlertAlarm((prev) => false);
            }
        }, 1000);
        return () => {
            clearInterval(timer);
        }
    }, [alarmTime]);

    useEffect(() => {
        alert("Alarm Sound");
        console.log("Alarm Sound XD");
    }, [showAlertAlarm]);


    const handleTimeSubmit = (e) => {
        console.log("Alarm Time is : ", alarmTime);
        setShowAlarmDesc((prev) => true);
    }
    return (
        <div>
            <h2>Alarm</h2>
            <h1 style={{ color: "red" }}>Current time is  :  {currHours < 10 ? 0 : null}{currHours} : {currMinutes < 10 ? 0 : null}{currMinutes} : {currSeconds < 10 ? 0 : null}{currSeconds}</h1>
            <input type="time" onChange={(e) => {
                setAlarmTime((prev) => e.target.value);
            }} />
            <button onClick={handleTimeSubmit}>Submit</button>
            {showAlarmDesc && <h3 style={{ color: "white" }}>Alarm Have been set for {alarmTime}</h3>}
            <div style={{color: "white", display: "flex", flexDirection:"row"}}>
            {/* <div style={{color: "white", display: "grid", gridTemplateColumns:"auto auto auto"}}> */}
            {/* <span style={{width: "300px", height: "auto", border: "2px solid white", margin: "5px"}}> */}
                <div style={{border: "2px solid white", margin : "2px", height: "fit-content", width: window.innerWidth*5}}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially
                </div>
                <div style={{border: "2px solid white", margin : "2px", height: "fit-content", width: "fit-content"}}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially
                </div>
                <div style={{border: "2px solid white", margin : "2px", height: "fit-content", width: "fit-content"}}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially
                </div>
                <div style={{border: "2px solid white", margin : "2px", height: "fit-content", width: "fit-content"}}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially
                </div>
                <div style={{border: "2px solid white", margin : "2px", height: "fit-content", width: "fit-content"}}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially
                </div>
                <div style={{border: "2px solid white", margin : "2px", height: "fit-content", width: "fit-content"}}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially
                </div>
                <div style={{border: "2px solid white", margin : "2px", height: "fit-content", width: "fit-content"}}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially
                </div>

            </div>
                
            



        </div>
    )
}
