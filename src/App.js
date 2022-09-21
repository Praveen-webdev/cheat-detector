import './App.css';
import Login from './Components/Login';
import Test from './Components/Test';
import {useState} from "react"
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";


function App() {
  const [rollNo,setRollNo]=useState("")
  const handleClick=(rollNo)=>{
    setRollNo(rollNo);
  }
  return (
    <Router className="app">
     <Switch>
      <Route path="/test">
        <Test rollNo={rollNo}/>
      </Route>
      <Route exact path="/">
        <Login handleClick={handleClick} />
      </Route>
     </Switch>
    </Router>
  );
}

export default App;
