import React from "react"
import '../styles/navbar.scss';

const Navbar = (props) => {
    return(
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div id="navbarMain" className="navbar-menu">
          <div className="navbar-start">
            {props.buttons.map((component, index) => {
                return <>{component}</>
            })}
          </div>
          <div className="navbar-end">
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">
                Options
              </a>
              <div className="navbar-dropdown is-right">
                {props.dropdownButtons.map((component, index) => {
                  if (index == 0) return <>{component}</>
                  else return (
                    <>
                      <hr className="navbar-divider"/>
                      {component}
                    </>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

);
}

Navbar.defaultProps = {
  buttons : <></>,
  dropdownButtons : <></>
};
    
export default Navbar