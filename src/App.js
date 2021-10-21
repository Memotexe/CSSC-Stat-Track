import logo from './logo.svg';
import './App.css';
import 'bulma/css/bulma.min.css'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Login from './pages/Login'
import Homepage from './pages/Homepage'
import PrivateRoute from './components/PrivateRoute';

function App() {
  
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Login}></Route>
        <PrivateRoute path="/home" exact component={Homepage}></PrivateRoute>
      </Switch>
    </Router>
  );
}

export default App;
