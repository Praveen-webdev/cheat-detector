import React,{useState} from "react";
import "./Login.css";
import { useHistory } from "react-router-dom";

function Login({handleClick}) {
  const [name,setName]=useState("");
  const history = useHistory();

  const onStartTest=(e)=>{
    e.preventDefault();
    if(!name==""){
      handleClick(name.toUpperCase())
      history.push("/test");
    }else{
      alert("Please enter your name...")
    }
  }
  return (
    <div>
      <h4 className="loginTitle">HACKATHON</h4>
      <div className="login">
        <input placeholder="Name..." onChange={(e)=>setName(e.target.value)}></input>
        <button type="button" onClick={onStartTest}>
            Start Test
          </button>
      </div>
    </div>
  );
}

export default Login;
