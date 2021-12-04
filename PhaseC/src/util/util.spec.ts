import { expect } from 'chai';
import { number } from 'mathjs';

import { Props, GridCell } from '../components/grid/gridCell/index';
import { addRow, deleteRow, addColumn, deleteColumn, undo, redo, replaceContent, fillCell } from '../store/grid/actions';
import { initialState, makeCells } from '../store/grid/reducer';
import { Cell, GridState, GridActions } from '../store/grid/types';
import { FunctionParser } from './operationParser';
import { StringParser } from './stringParser';

describe("Parsing Tests", () => {
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


    it("basic arithmetic", () => {
        initialGrid[0][0].content = "= 2 + 3";

        let parsedCell = new FunctionParser(initialGrid, initialGrid[0][0].content.trim(), {y: 0, x: 0})

        expect(parsedCell.evaluate().content).to.deep.equal("5");

        gridState = initialState;
    });

    it("SUM", () => {
        initialGrid[0][0].content = "= SUM(B1..B2)";

        initialGrid[0][1].content = "= 1";
        initialGrid[1][1].content = "= 1";

        let parsedCell = new FunctionParser(initialGrid, initialGrid[0][0].content.trim(), { y: 0, x: 0 })

        expect(parsedCell.evaluate().content).to.deep.equal("2");

        gridState = initialState;
    });

    it("string concat", () => {
        initialGrid[0][0].content = "\"zip\" + \"zap\"";

        let parsedCell = new StringParser("\"zip\" + \"zap\"")

        expect(parsedCell.evaluate()).to.deep.equal("zipzap");

        gridState = initialState;
    });

});