import React from "react"

const props = {
    classes: "",
    href: "#",
    type: "text"
}

const TextField = (props) => {

    return (
        <div className={"justify-content-center " + props.classes}>
            <input type="text" className="justify-content-center align-items-left field input is-primary">{props.text}</input>
        </div>
    )
}

export default TextField