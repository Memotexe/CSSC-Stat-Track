import React from "react"

const props = {
    href : "#",
    action: () => {},
    optionText : "",
}

const DropdownButton = (props) => {
    let button = <a href={props.href} className="container is-fluid">{props.optionText}</a>
    
    return (
        <div className={"navbar-item has-text-centered p-1"}>
            {button}
        </div>
    )
}

export default DropdownButton