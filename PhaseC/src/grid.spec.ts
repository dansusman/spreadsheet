import { expect } from 'chai';
import { number } from 'mathjs';

import { Props, GridCell } from './components/grid/gridCell/index';
import { addRow, deleteRow, addColumn, deleteColumn, undo, redo, replaceContent, fillCell } from './store/grid/actions';
import { initialState, makeCells } from './store/grid/reducer';
import { Cell, GridState, GridActions, GridHistory } from './store/grid/types';
import { FunctionParser } from './util/operationParser';

describe("Grid Tests", () => {
    let makeGrid = function (rows: number, cols: number) {
        let grid: Cell[][] = [];

        for (let row = 0; row < rows; row++) {
            var r: Cell[] = [];
            for (let col = 0; col < cols; col++) {
                r = [...r, { content: "", color: "WHITE" }];
            }
            grid = [...grid, r];
        }
        return grid;
    }

    let ROWS = 2;
    let COLS = 2;

    let initialGrid = makeGrid(ROWS, COLS);

    let gridState: GridState = { grid: initialGrid, rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };

    // ADDING ROW TESTS
    it("add row to top of grid", () => {
        let expectedGrid = makeGrid(3, 2);

        expect(addRow(gridState, 0).payload.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    it("add row to end of grid", () => {
        gridState = { grid: makeGrid(ROWS, COLS), rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        let expectedGrid = makeGrid(3, 2);

        expect(addRow(gridState, 1).payload.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    it("add row that shifts references", () => {
        let initialGrid = makeGrid(ROWS, COLS);
        initialGrid[0][0] = { content: "test", color: "WHITE" };
        initialGrid[0][1] = { content: "test", color: "WHITE" };
        gridState = { grid: initialGrid, rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        let expectedGrid = makeGrid(3, 2);
        expectedGrid[1][0] = { content: "test", color: "WHITE" };
        expectedGrid[1][1] = { content: "test", color: "WHITE" };

        expect(addRow(gridState, 0).payload.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    it("add multipule rows consecutively", () => {
        let initialGrid = makeGrid(ROWS, COLS);
        var gridState = { grid: initialGrid, rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        gridState.grid = addRow(gridState, 0).payload.grid;
        gridState.grid = addRow(gridState, 0).payload.grid;
        gridState.grid = addRow(gridState, 0).payload.grid;
        let expectedGrid = makeGrid(5, 2);

        expect(gridState.grid).to.deep.equal(expectedGrid);
    });

    // ADDING COLUMN TESTS
    it("add column to top of grid", () => {
        gridState = { grid: makeGrid(ROWS, COLS), rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        let expectedGrid = makeGrid(2, 3);

        expect(addColumn(gridState, 0).payload.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    it("add column to end of grid", () => {
        gridState = { grid: makeGrid(ROWS, COLS), rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        let expectedGrid = makeGrid(2, 3);

        expect(addColumn(gridState, 1).payload.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    it("add column that shifts references", () => {
        let initialGrid = makeGrid(ROWS, COLS);
        initialGrid[0][0] = { content: "test", color: "WHITE" };
        initialGrid[1][0] = { content: "test", color: "WHITE" };
        gridState = { grid: initialGrid, rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        let expectedGrid = makeGrid(2, 3);
        expectedGrid[0][1] = { content: "test", color: "WHITE" };
        expectedGrid[1][1] = { content: "test", color: "WHITE" };

        expect(addColumn(gridState, 0).payload.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    it("add multipule columns consecutively", () => {
        let initialGrid = makeGrid(ROWS, COLS);
        var gridState = { grid: initialGrid, rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        gridState.grid = addColumn(gridState, 0).payload.grid;
        gridState.grid = addColumn(gridState, 0).payload.grid;
        gridState.grid = addColumn(gridState, 0).payload.grid;
        let expectedGrid = makeGrid(2, 5);

        expect(gridState.grid).to.deep.equal(expectedGrid);
    });

    //DELETING ROW TESTS
    it("deleting row at top of grid", () => {
        gridState = { grid: makeGrid(ROWS, COLS), rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        let expectedGrid = makeGrid(1, 2);

        expect(deleteRow(gridState, 0).payload.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    it("deleting row at end of grid", () => {
        gridState = { grid: makeGrid(ROWS, COLS), rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        let expectedGrid = makeGrid(1, 2);

        expect(deleteRow(gridState, 1).payload.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    it("attempting deleting with only 1 row", () => {
        gridState = { grid: makeGrid(1, COLS), rows: 1, columns: COLS, redoStack: [], undoStack: [] };
        let expectedGrid = makeGrid(1, 2);

        expect(deleteRow(gridState, 0).payload.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    it("deleting a row that contains references", () => {
        let initialGrid = makeGrid(ROWS, COLS);
        initialGrid[0][0] = { content: "test", color: "WHITE" };
        initialGrid[0][1] = { content: "test", color: "WHITE" };
        gridState = { grid: initialGrid, rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        let expectedGrid = makeGrid(1, 2);

        expect(deleteRow(gridState, 0).payload.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    it("deleting multipule rows consecutively", () => {
        let initialGrid = makeGrid(4, 3);
        var gridState = { grid: initialGrid, rows: 3, columns: 3, redoStack: [], undoStack: [] };
        gridState.grid = deleteRow(gridState, 0).payload.grid;
        gridState.grid = deleteRow(gridState, 0).payload.grid;
        gridState.grid = deleteRow(gridState, 0).payload.grid;
        let expectedGrid = makeGrid(1, 3);

        expect(gridState.grid).to.deep.equal(expectedGrid);
    });

    //DELETING COLUMN TESTS
    it("deleting column at top of grid", () => {
        gridState = { grid: makeGrid(ROWS, COLS), rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        let expectedGrid = makeGrid(2, 1);

        expect(deleteColumn(gridState, 0).payload.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    it("deleting column at end of grid", () => {
        gridState = { grid: makeGrid(ROWS, COLS), rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        let expectedGrid = makeGrid(2, 1);

        expect(deleteColumn(gridState, 1).payload.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    it("attempting deleting with only 1 column", () => {
        gridState = { grid: makeGrid(ROWS, 1), rows: ROWS, columns: 1, redoStack: [], undoStack: [] };
        let expectedGrid = makeGrid(2, 1);

        expect(deleteColumn(gridState, 0).payload.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    it("deleting a row that contains references", () => {
        let initialGrid = makeGrid(ROWS, COLS);
        initialGrid[0][0] = { content: "test", color: "WHITE" };
        initialGrid[1][0] = { content: "test", color: "WHITE" };
        gridState = { grid: initialGrid, rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        let expectedGrid = makeGrid(2, 1);

        expect(deleteColumn(gridState, 0).payload.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    it("deleting multipule rows consecutively", () => {
        let initialGrid = makeGrid(3, 4);
        var gridState = { grid: initialGrid, rows: 3, columns: 3, redoStack: [], undoStack: [] };
        gridState.grid = deleteColumn(gridState, 0).payload.grid;
        gridState.grid = deleteColumn(gridState, 0).payload.grid;
        gridState.grid = deleteColumn(gridState, 0).payload.grid;
        let expectedGrid = makeGrid(3, 1);

        expect(gridState.grid).to.deep.equal(expectedGrid);
    });

    // FILL CELL TESTS
    it("filling a cell red", () => {
        gridState = { grid: makeGrid(ROWS, COLS), rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        let expectedGrid = makeGrid(2, 2);
        expectedGrid[0][0] = { content: "", color: "RED" };

        expect(fillCell(gridState, "RED", 0, 0).payload.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    it("filling a cell orange", () => {
        gridState = { grid: makeGrid(ROWS, COLS), rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        let expectedGrid = makeGrid(2, 2);
        expectedGrid[0][0] = { content: "", color: "ORANGE" };

        expect(fillCell(gridState, "ORANGE", 0, 0).payload.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    it("filling a cell yellow", () => {
        gridState = { grid: makeGrid(ROWS, COLS), rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        let expectedGrid = makeGrid(2, 2);
        expectedGrid[0][0] = { content: "", color: "YELLOW" };

        expect(fillCell(gridState, "YELLOW", 0, 0).payload.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    it("filling a cell light green", () => {
        gridState = { grid: makeGrid(ROWS, COLS), rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        let expectedGrid = makeGrid(2, 2);
        expectedGrid[0][0] = { content: "", color: "LIGHTGREEN" };

        expect(fillCell(gridState, "LIGHTGREEN", 0, 0).payload.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    it("filling a cell light blue", () => {
        gridState = { grid: makeGrid(ROWS, COLS), rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        let expectedGrid = makeGrid(2, 2);
        expectedGrid[0][0] = { content: "", color: "LIGHTBLUE" };

        expect(fillCell(gridState, "LIGHTBLUE", 0, 0).payload.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    it("filling a cell light purple", () => {
        gridState = { grid: makeGrid(ROWS, COLS), rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        let expectedGrid = makeGrid(2, 2);
        expectedGrid[0][0] = { content: "", color: "PURPLE" };

        expect(fillCell(gridState, "PURPLE", 0, 0).payload.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    // UNDO AND REDO TESTS
    it("undo as first action", () => {
        gridState = { grid: makeGrid(ROWS, COLS), rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        let expectedGrid = makeGrid(2, 2);

        expect(undo(gridState).payload.state.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    it("redo as first action", () => {
        gridState = { grid: makeGrid(ROWS, COLS), rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        let expectedGrid = makeGrid(2, 2);

        expect(redo(gridState).payload.state.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    it("undo a single action", () => {
        gridState = { grid: makeGrid(ROWS, COLS), rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        gridState.grid = addRow(gridState, 0).payload.grid;
        let addRowAction = { grid: gridState.grid, columns: gridState.columns, rows: gridState.rows };
        gridState.undoStack.push(addRowAction);
        gridState = undo(gridState).payload.state
        let expectedUndoStack : GridHistory[] = [];

        expect(gridState.undoStack).to.deep.equal(expectedUndoStack);

        gridState = initialState;
    });

    it("redo a single action", () => {
        gridState = { grid: makeGrid(ROWS, COLS), rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        gridState.grid = addRow(gridState, 0).payload.grid;
        let addRowAction = { grid: gridState.grid, columns: gridState.columns, rows: gridState.rows };
        gridState.undoStack.push(addRowAction);
        gridState = undo(gridState).payload.state;
        gridState = redo(gridState).payload.state;
        let expectedRedoStack : GridHistory[] = [];

        expect(gridState.redoStack).to.deep.equal(expectedRedoStack);

        gridState = initialState;
    });

    it("undo up to 5 actions", () => {
        gridState = { grid: makeGrid(ROWS, COLS), rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        gridState.grid = addRow(gridState, 0).payload.grid;
        gridState.undoStack = addRow(gridState, 0).payload.undoStack;
        gridState.grid = addRow(gridState, 0).payload.grid;
        gridState.undoStack = addRow(gridState, 0).payload.undoStack;
        gridState.grid = addRow(gridState, 0).payload.grid;
        gridState.undoStack = addRow(gridState, 0).payload.undoStack;
        gridState.grid = addRow(gridState, 0).payload.grid;
        gridState.undoStack = addRow(gridState, 0).payload.undoStack;
        gridState.grid = addRow(gridState, 0).payload.grid;
        gridState.undoStack = addRow(gridState, 0).payload.undoStack;
        gridState.grid = addRow(gridState, 0).payload.grid;
        gridState.undoStack = addRow(gridState, 0).payload.undoStack;

        gridState.rows = 8;
        gridState = undo(gridState).payload.state;
        gridState = undo(gridState).payload.state;
        gridState = undo(gridState).payload.state;
        gridState = undo(gridState).payload.state;
        gridState = undo(gridState).payload.state;
        // sixth undo should not do anything
        gridState = undo(gridState).payload.state;
        let expectedUndoStack : GridHistory[] = [];

        expect(gridState.undoStack).to.deep.equal(expectedUndoStack);

        gridState = initialState;
    });

    it("redo up to 5 actions", () => {
        gridState = { grid: makeGrid(ROWS, COLS), rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        gridState.grid = addRow(gridState, 0).payload.grid;
        gridState.undoStack = addRow(gridState, 0).payload.undoStack;
        gridState.grid = addRow(gridState, 0).payload.grid;
        gridState.undoStack = addRow(gridState, 0).payload.undoStack;
        gridState.grid = addRow(gridState, 0).payload.grid;
        gridState.undoStack = addRow(gridState, 0).payload.undoStack;
        gridState.grid = addRow(gridState, 0).payload.grid;
        gridState.undoStack = addRow(gridState, 0).payload.undoStack;
        gridState.grid = addRow(gridState, 0).payload.grid;
        gridState.undoStack = addRow(gridState, 0).payload.undoStack;
        gridState.grid = addRow(gridState, 0).payload.grid;
        gridState.undoStack = addRow(gridState, 0).payload.undoStack;

        gridState.rows = 8;
        gridState = undo(gridState).payload.state;
        gridState = undo(gridState).payload.state;
        gridState = undo(gridState).payload.state;
        gridState = undo(gridState).payload.state;
        gridState = undo(gridState).payload.state;

        gridState = redo(gridState).payload.state;
        gridState = redo(gridState).payload.state;
        gridState = redo(gridState).payload.state;
        gridState = redo(gridState).payload.state;
        gridState = redo(gridState).payload.state;
        // sixth redo should not do anything
        gridState = redo(gridState).payload.state;
        let expectedRedoStack : GridHistory[] = [];

        expect(gridState.redoStack).to.deep.equal(expectedRedoStack);

        gridState = initialState;
    });

    //ON KEY ENTER TESTS
    it("enter data into the first cell", () => {
        gridState = { grid: makeGrid(ROWS, COLS), rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        gridState.grid = replaceContent(gridState, "test", 0, 0).payload.grid;
        let expectedGrid = makeGrid(2, 2);
        expectedGrid[0][0] =  { content: "test", color: "WHITE" };

        expect(gridState.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

    it("enter data into the last cell", () => {
        gridState = { grid: makeGrid(ROWS, COLS), rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
        gridState.grid = replaceContent(gridState, "test", 1, 1).payload.grid;
        let expectedGrid = makeGrid(2, 2);
        expectedGrid[1][1] =  { content: "test", color: "WHITE" };

        expect(gridState.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });



});