import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "./store";
import {
    addColumn,
    addRow,
    deleteColumn,
    deleteRow,
    redo,
    replaceContent,
    undo,
} from "./store/grid/actions";
import Grid from "./components/grid";

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
            <div
                onClick={() =>
                    dispatch(replaceContent(grid, "hello world", 0, 0))
                }
            >
                Add Text
            </div>
            <Grid grid={grid.grid} />

            {JSON.stringify(grid.grid)}
            <div>COLUMNS: {grid.columns}</div>
            <div>ROWS: {grid.rows}</div>
            {JSON.stringify(grid.redoStack)}
        </div>
    );
}

export default App;
