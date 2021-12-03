import React from "react"

const Button = (props) => {
    let button = <a className="button" href={props.href}>{props.buttonText}</a>
    if (props.action !== undefined) {
        button = <button className="button" onClick={props.action} style={{boxShadow: "none"}}>{props.buttonText}</button>
    }
    return (
        <div className={"is-justify-content-center navbar-item is-align-self-center p-0 " + (props.classes === undefined ? "" : props.classes)}>
            {button}
        </div>
    )
}

Button.defaultProps = {
    action : () => {},
    href : "#",
    buttonText : "",
    classes : ""
}

export default Button