import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "./store";
import "./app.css";
import {
    addColumn,
    addRow,
    deleteColumn,
    deleteRow,
    redo,
    undo,
} from "./store/grid/actions";

function App() {
    const dispatch = useDispatch();
    const grid = useSelector((state: ApplicationState) => state.grid);
    return (
        <div>
            <div onClick={() => dispatch(redo(grid))}>REDO</div>
            <div onClick={() => dispatch(undo(grid))}>UNDO</div>
            <div onClick={() => dispatch(addColumn(grid, 0))}>ADD COLUMN</div>
            <div onClick={() => dispatch(deleteColumn(grid, 0))}>
                DELETE COLUMN
            </div>
            <div onClick={() => dispatch(addRow(grid, 0))}>ADD ROW</div>
            <div onClick={() => dispatch(deleteRow(grid, 0))}>DELETE ROW</div>
            <div className="grid">
                {grid.grid.map((row, rowKey) => (
                    <div className="row" key={rowKey}>
                        {row.map((cell, cellKey) => (
                            <div className="cell" key={cellKey}></div>
                        ))}
                    </div>
                ))}
            </div>
            {JSON.stringify(grid.grid)}
            <div>COLUMNS: {grid.columns}</div>
            <div>ROWS: {grid.rows}</div>
            {JSON.stringify(grid.redoStack)}
        </div>
    );
}

export default App;
