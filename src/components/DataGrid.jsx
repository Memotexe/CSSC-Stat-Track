import React from "react"
// import "../styles/datagrid.scss"

const DataGrid = (props) => {

    return (
        <div className={"container is-fluid is-justify-content-center column is-three-quarters my-6"} id="table">
            {props.tableName ? <h1 className="is-size-3">{props.tableName}</h1> : <></>}
            <div className="container is-fluid is-justify-content-center column-is-fullwidth m-0 p-0">
                <table className="table is-fullwidth animate">
                    <thead>
                        <tr>
                        {props.columns.map((colName, index) => {
                            return <th key={index} className="px-6 has-text-white" style={{width: (100/props.columns.length) + "%"}}>{colName}</th>
                        })}
                        </tr>
                    </thead>
                    <tbody>
                        {props.data[0].map((row, index) => {
                            return <tr key={index}>
                                {props.columns.map((row2, columnIndex) => {
                                    if (props.data[columnIndex] === undefined) return <td key={index + " " + columnIndex}></td>;
                                    else if (props.data[columnIndex][index] === undefined) return <td key={index + " " + columnIndex}></td>;
                                    else if (React.isValidElement(props.data[columnIndex][index])) return <td className="p-0 is-vcentered" key={index + " " + columnIndex}>{props.data[columnIndex][index]}</td>;
                                    return <td key={index + " " + columnIndex}>{props.data[columnIndex][index]}</td>
                                })}
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

DataGrid.defaultProps = {
    tableName: "",
    columns: [],
    data: [[]]
}

export default DataGrid;