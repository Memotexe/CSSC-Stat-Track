import React from "react"

const props = {
  buttons : <></>,
  dropdownButtons : <></>
}

const Navbar = (props) => {
    return(
      <nav className="navbar" role="navigation" aria-label="main navigation" style={{zIndex: 1000}}>
        <div className="navbar-brand">
          <a className="navbar-item" href="https://bulma.io">
            <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28"/>
          </a>
        </div>
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
    
export default Navbar