import { expect } from 'chai';
import { number } from 'mathjs';

import { Props, GridCell } from './components/grid/gridCell/index';
import { addRow, deleteRow, addColumn, deleteColumn, undo, redo, replaceContent, fillCell } from './store/grid/actions';
import { initialState, makeCells } from './store/grid/reducer';
import { Cell, GridState, GridActions } from './store/grid/types';
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

    it("add row to top of grid", () => {
        let expectedGrid = makeGrid(3, 2);

        expect(addRow(gridState, 0).payload.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });

});