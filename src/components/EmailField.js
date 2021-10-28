import React from "react"

const props = {
    classes: "",
    href: "#",
    type: "email"
}

const EmailField = (props) => {

    return (
        <div className={"justify-content-center " + props.classes}>
            <input type="email" className="justify-content-center align-items-left field input is-primary" >{props.text}</input>
        </div>
    )
}

export default EmailField