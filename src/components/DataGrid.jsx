import React from "react"
import "../styles/datagrid.scss"

const DataGrid = (props) => {

    return (
        <div className={"container is-fluid is-justify-content-center column is-three-quarters"} id="table">
            <table className="table m-auto animate">
                <thead>
                    <tr>
                    {props.columns.map((colName, index) => {
                        return <th  className="px-6">{colName}</th>
                    })}
                    </tr>
                </thead>
                <tbody>
                    {props.data[0].map((row, index) => {
                        return <tr>
                            {props.columns.map((row2, columnIndex) => {
                                if (props.data[columnIndex] === undefined) return <td></td>;
                                else if (props.data[columnIndex][index] === undefined) return <td></td>;
                                return <td>{props.data[columnIndex][index]}</td>
                            })}
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    )
}

DataGrid.defaultProps = {
    columns: [],
    data: [[]]
}

export default DataGrid;