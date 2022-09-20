import './App.css';
import Login from './Components/Login';
import Test from './Components/Test';
import { BrowserRouter as Router, Route, Switch,withRouter } from "react-router-dom";


function App() {
  return (
    <Router className="app">
     <Switch>
      <Route path="/test" component={withRouter(Test)} />
      <Route exact path="/" component={withRouter(Login)} />
     </Switch>
    </Router>
  );
}

export default App;
