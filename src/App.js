import logo from './logo.svg';
import './styles/base.scss';
import 'bulma/css/bulma.min.css'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute';
import MenteeSignin from './pages/MenteeSignin';
import AdminPanel from './pages/AdminPanel';
import MentorPanel from './pages/MentorPanel';

function App() {
  
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Login}></Route>
        <PrivateRoute path="/menteeSignIn" exact component={MenteeSignin} authLevel={0}></PrivateRoute>
        <PrivateRoute path="/mentorPanel" exact component={MentorPanel} authLevel={0}></PrivateRoute>
        <PrivateRoute path="/adminPanel" exact component={AdminPanel} authLevel={1}></PrivateRoute>
      </Switch>
    </Router>
  );
}

export default App;
