import React from "react"

const props = {
    onClick : {},
    href : "#",
    buttonText : "",
    classes : ""
}

const Button = (props) => {
    let button = <a className="button" href={props.href}>{props.buttonText}</a>
    if (props.onClick !== undefined) {
        button = <button className="button" onClick={props.onClick} style={{boxShadow: "none"}}>{props.buttonText}</button>
    }
    return (
        <div className={"is-justify-content-center navbar-item is-align-self-center p-0 " + (props.classes === undefined ? "" : props.classes)}>
            {button}
        </div>
    )
}

export default Button