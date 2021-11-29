import React from "react";
import '../styles/navbar.scss';

const DropdownButton = (props) => {
    let button;
    if (props.href === undefined) {
        button = <button className="drop-button p-2" onClick={props.action}>{props.optionText}</button>
    }
    else button = <a href={props.href} className="drop-button is-fluid">{props.optionText}</a>
    
    return (
        <div className={"navbar-item p-0 is-justify-content-center has-background-white"}>
            {button}
        </div>
    )
}

DropdownButton.defaultProps = {
    href : undefined,
    action: () => {},
    optionText : ""
}

export default DropdownButton