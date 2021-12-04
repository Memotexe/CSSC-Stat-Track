import './styles/base.scss';
import 'bulma/css/bulma.min.css'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute';
import AdminPanel from './pages/AdminPanel';
import MentorPanel from './pages/MentorPanel';
import MenteeSignIn from './pages/MenteeSignIn'

function App() {
  
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Login}></Route>
        <PrivateRoute path="/mentorPanel" exact component={MentorPanel} authLevel={0}></PrivateRoute>
        <PrivateRoute path="/adminPanel" exact component={AdminPanel} authLevel={1}></PrivateRoute>
        <PrivateRoute path="/menteeSignIn" exact component={MenteeSignIn} authLevel={0}></PrivateRoute>
      </Switch>
    </Router>
  );
}

export default App;
