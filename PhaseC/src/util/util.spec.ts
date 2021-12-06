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
        let modifiedGrid: Cell[][] = initialGrid;
        modifiedGrid[0][0].content = "= 2 + 3";

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), {y: 0, x: 0})

        expect(parsedCell.evaluate().content).to.deep.equal("5");

        gridState = { grid: initialGrid, rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
    });

    it("SUM over two cells", () => {
        let modifiedGrid: Cell[][] = initialGrid;

        modifiedGrid[0][0].content = "= SUM(B1..B2)";
        modifiedGrid[0][1].content = "= 1";
        modifiedGrid[1][1].content = "= 1";

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 })

        expect(parsedCell.evaluate().content).to.deep.equal("2");

        gridState = { grid: initialGrid, rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
    });

    it("AVG over two cells", () => {
        let modifiedGrid: Cell[][] = initialGrid;

        modifiedGrid[0][0].content = "= AVG(B1..B2)";
        modifiedGrid[0][1].content = "= 2";
        modifiedGrid[1][1].content = "= 8";

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 })

        expect(parsedCell.evaluate().content).to.deep.equal("5");

        gridState = { grid: initialGrid, rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
    });

    it("basic REF", () => {
        let modifiedGrid: Cell[][] = initialGrid;

        modifiedGrid[0][0].content = "= REF(A2)"; // A1
        modifiedGrid[1][0].content = "= 8"; // A2

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 })

        expect(parsedCell.evaluate().content).to.deep.equal("8");

        gridState = { grid: initialGrid, rows: ROWS, columns: COLS, redoStack: [], undoStack: [] };
    });

    it("empty REF", () => {
        let modifiedGrid: Cell[][] = initialGrid;

        modifiedGrid[0][0].content = "= REF(A2)";

        initialGrid[1][0].content = "";

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 });

        expect(parsedCell.evaluate().content).to.deep.equal("0");

        gridState = { grid: initialGrid, rows: ROWS, columns: COLS, redoStack: [], undoStack: [] }; // TODO: do we still need to set this?
    });

    it("string concat", () => {
        initialGrid[0][0].content = "\"zip\" + \"zap\"";

        let parsedCell = new StringParser("\"zip\" + \"zap\"") // call initialGrid[0]?

        expect(parsedCell.evaluate()).to.deep.equal("zipzap");

        gridState = initialState;
    });

});