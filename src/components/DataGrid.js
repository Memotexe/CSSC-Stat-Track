import React from "react"
import "../styles/datagrid.scss"

const DataGrid = (props) => {

    return (
        <div className={"container is-fluid is-justify-content-center column is-three-quarters " + props.className } id="table">
            <table className="table m-auto">
                <thead>
                    <tr>
                    {props.columns.map((colName, index) => {
                        return <th  className="px-6">{colName}</th>
                    })}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{props.data[0].name}</td>
                        <td>{props.data[0].email}</td>
                        <td>{props.data[0].active}</td>
                        <td><button name="D"/><button name="E"/><button name="A"/></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

DataGrid.defaultProps = {
    className: "",
    columns: [],
    data:[{
        name: "gup",
        email: "gup@pfw.edu",
        active: 1
    }]
}

export default DataGrid