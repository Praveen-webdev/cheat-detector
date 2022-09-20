import React from 'react'
import './Login.css'
import {useHistory} from 'react-router-dom'
function Login() {
    const history=useHistory();
  return (
    <div>
        <h4 className="loginTitle">HACKATHON</h4>
        <div className='login'>
        <input placeholder='Roll num'></input>
        <p onClick={()=>history.push("/test")}>Start Test</p>
    </div>
    </div>
  )
}

export default Login