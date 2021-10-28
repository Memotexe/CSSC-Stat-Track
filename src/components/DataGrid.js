import React from "react"

const props = {
    classes: "",
    href: "#",
    type: "email"
}

const DataGrid = (props) => {

    return (
        <div className={"justify-content-center " + props.classes}>
            <table>
                <tr>
                    <th>Test</th>
                </tr>
                <tr>
                    <tr>Testing</tr>
                </tr>
            </table>
        </div>
    )
}

export default DataGrid