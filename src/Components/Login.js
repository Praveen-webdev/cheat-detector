import React,{useState} from "react";
import "./Login.css";
import { useHistory } from "react-router-dom";
import { isMobile } from "react-device-detect";
function Login({handleClick}) {
  const [rollNo,setRollNo]=useState("");
  const history = useHistory();

  const onStartTest=(e)=>{
    e.preventDefault();
    if(rollNo.startsWith("ES") ||rollNo.startsWith("es")){
      handleClick(rollNo.toLocaleUpperCase())
      history.push("/test");
    }else{
      alert("Invalid Roll number ! Hint : Roll number starts with ES...")
    }
  }
  return (
    <div>
      <h4 className="loginTitle">HACKATHON</h4>
      <div className="login">
        <input placeholder="Roll number" onChange={(e)=>setRollNo(e.target.value)}></input>
        {isMobile ? (
          <button type="button" disabled onClick={onStartTest}>
            Start Test
          </button>
        ) : (
          <button type="button" onClick={onStartTest}>
            Start Test
          </button>
        )}
        <h5 className="rules ">(USE DESKTOP DEVICES)</h5>
      </div>
    </div>
  );
}

export default Login;
