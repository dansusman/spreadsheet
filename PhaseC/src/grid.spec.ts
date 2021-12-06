import { expect } from "chai";
import { addRow } from "./store/grid/actions";
import { initialState } from "./store/grid/reducer";
import { Cell, GridState } from "./store/grid/types";

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
    };

    let ROWS = 2;
    let COLS = 2;

    let initialGrid = makeGrid(ROWS, COLS);

    let gridState: GridState = {
        grid: initialGrid,
        rows: ROWS,
        columns: COLS,
        redoStack: [],
        undoStack: [],
    };

    it("add row to top of grid", () => {
        let expectedGrid = makeGrid(3, 2);

        expect(addRow(gridState, 0).payload.grid).to.deep.equal(expectedGrid);

        gridState = initialState;
    });
});
