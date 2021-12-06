import React, { useState } from "react";
import axios from "axios";


const Navbar = (props) => {
  const [loading, setLoading] = useState(false);
  const logout = () => {
    axios.post('http://localhost:4002/auth/logout', { accessKey: sessionStorage.getItem("accessKey") }).then((resp) => {
      axios.post('http://localhost:4002/api/session/stop/user', { accessKey: sessionStorage.getItem("accessKey") }).then(resp => {
          sessionStorage.removeItem("accessKey");
          window.location.reload();
      }).catch(err => {
          sessionStorage.removeItem("accessKey");
          alert(err.response.data.message);
          window.location.reload();
      });
    }).catch(err => {
        sessionStorage.removeItem("accessKey");
        alert(err.response.data.message);
        window.location.reload();
    });
    setLoading(true);
  }
  return(
    <nav className="navbar has-background-black-ter" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="https://www.pfw.edu/">
          <img src="./logo.png" width="100%" height="100%" alt="Purdue Fort Wayne"/>
        </a>
      </div>
      <div id="navbarMain" className="navbar-menu">
        <div className="navbar-end">
          {props.buttons.map((component, index) => {
              if(component.text) {
                return <button key={index} className="button is-justify-content-center navbar-item is-align-self-center mr-2 is-primary" onClick={() => component.action()}><span>{component.text}</span></button>
              } else return <></>
          })}
          <button className={"button is-align-self-center is-justify-content-center mr-2 is-primary " + (loading ? "is-loading" : "")} onClick={() => logout()}>
            <span className="pr-1">Logout</span>
            <span className="fas fa-sign-out-alt"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

Navbar.defaultProps = {
  buttons : [{text: "",  action: () => {}}]
};
    
export default Navbar