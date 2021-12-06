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

    let ROWS = 5;
    let COLS = 5;

    const initialGrid = makeGrid(ROWS, COLS);
    var modifiedGrid: Cell[][]

    beforeEach(() => {
        modifiedGrid = JSON.parse(JSON.stringify(initialGrid));
    });

    it("attempt arithmetic without equals sign", () => {
        modifiedGrid[0][0].content = "2 + 3";

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 })

        expect(parsedCell.evaluate().content).to.deep.equal("2 + 3");
    });

    it("basic arithmetic", () => {
        modifiedGrid[0][0].content = "= 2 + 3";

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), {y: 0, x: 0})

        expect(parsedCell.evaluate().content).to.deep.equal("5");
    });

    it("arithmetic with multiple operations and parens", () => {
        modifiedGrid[0][0].content = "= ((2 + 2) * 9 / 6 - 2) * 10 / 2.5";

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 })

        expect(parsedCell.evaluate().content).to.deep.equal("16");
    });

    it("attempt SUM without equals sign", () => {
        modifiedGrid[0][0].content = "SUM(A1..A2)";

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 })

        expect(parsedCell.evaluate().content).to.deep.equal("SUM(A1..A2)");
    });

    it("SUM over two cells", () => {
        modifiedGrid[0][0].content = "= SUM(B1..B2)";
        modifiedGrid[0][1].content = "= 1"; // B1
        modifiedGrid[1][1].content = "= 1"; // B2

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 })

        expect(parsedCell.evaluate().content).to.deep.equal("2");
    });

    it("SUM over many cells", () => {
        modifiedGrid[0][0].content = "= SUM(B1..D5)";
        modifiedGrid[0][1].content = "= 10"; // B1
        modifiedGrid[1][1].content = "= 143"; // B2
        modifiedGrid[4][1].content = "= 71"; // B5
        modifiedGrid[0][2].content = "= 4"; // C1
        modifiedGrid[2][2].content = "= -23"; // C3
        modifiedGrid[0][3].content = "= 7.2"; // D1
        modifiedGrid[4][3].content = "= -5"; // D5

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 })

        expect(parsedCell.evaluate().content).to.deep.equal("207.2");
    });

    it("SUM of REF and AVG", () => {
        modifiedGrid[0][0].content = "= SUM(B1..D5)";
        modifiedGrid[1][0].content = "= 2"; // A2
        modifiedGrid[2][0].content = "= 20"; // A3
        modifiedGrid[3][0].content = "= 8"; // A4

        modifiedGrid[0][1].content = "= REF(A2)"; // B1
        modifiedGrid[1][1].content = "= 143"; // B2
        modifiedGrid[4][1].content = "= 71"; // B5
        modifiedGrid[0][2].content = "= 4"; // C1
        modifiedGrid[2][2].content = "= -15"; // C3
        modifiedGrid[0][3].content = "= AVG(A2..A4)"; // D1
        modifiedGrid[4][3].content = "= -5"; // D5

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 })

        expect(parsedCell.evaluate().content).to.deep.equal("210");
    });

    it("SUM updates when REF updates", () => {
        modifiedGrid[0][0].content = "= SUM(B1..B2)";
        modifiedGrid[1][0].content = "= 2"; // A2
        modifiedGrid[2][0].content = "= 20"; // A3

        modifiedGrid[0][1].content = "= REF(A2)"; // B1
        modifiedGrid[1][1].content = "= REF(A3)"; // B2

        modifiedGrid[1][0].content = "= 50"; // A2
        modifiedGrid[2][0].content = "= 20"; // A3

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 })

        expect(parsedCell.evaluate().content).to.deep.equal("70");
    });

    it("attempt AVG without equals sign", () => {
        modifiedGrid[0][0].content = "AVG(A2..A3)";

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 })

        expect(parsedCell.evaluate().content).to.deep.equal("AVG(A2..A3)");
    });

    it("AVG over two cells", () => {
        modifiedGrid[0][0].content = "= AVG(B1..B2)";
        modifiedGrid[0][1].content = "= 2";
        modifiedGrid[1][1].content = "= 8";

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 })

        expect(parsedCell.evaluate().content).to.deep.equal("5");
    });

    it("AVG over many cells", () => {
        modifiedGrid[0][0].content = "= AVG(B1..D5)";
        modifiedGrid[0][1].content = "= 10"; // B1
        modifiedGrid[1][1].content = "= 143"; // B2
        modifiedGrid[4][1].content = "= 71"; // B5
        modifiedGrid[0][2].content = "= 4"; // C1
        modifiedGrid[2][2].content = "= -23"; // C3
        modifiedGrid[0][3].content = "= 40"; // D1
        modifiedGrid[4][3].content = "= -5"; // D5

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 })

        expect(parsedCell.evaluate().content).to.deep.equal("16");
    });

    it("AVG updates when REF updates", () => {
        modifiedGrid[0][0].content = "= AVG(B1..B2)"; // A1
        modifiedGrid[1][0].content = "= 2"; // A2
        modifiedGrid[2][0].content = "= 20"; // A3

        modifiedGrid[0][1].content = "= REF(A2)"; // B1
        modifiedGrid[1][1].content = "= REF(A3)"; // B2

        modifiedGrid[1][0].content = "= 50"; // A2
        modifiedGrid[2][0].content = "= 20"; // A3

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 })

        expect(parsedCell.evaluate().content).to.deep.equal("35");
    });

    it("AVG of REF and SUM", () => {
        modifiedGrid[0][0].content = "= AVG(B1..D5)";
        modifiedGrid[1][0].content = "= 2"; // A2
        modifiedGrid[2][0].content = "= 20"; // A3
        modifiedGrid[3][0].content = "= 8"; // A4

        modifiedGrid[0][1].content = "= REF(A2)"; // B1
        modifiedGrid[1][1].content = "= 138"; // B2
        modifiedGrid[4][1].content = "= 71"; // B5
        modifiedGrid[0][2].content = "= 4"; // C1
        modifiedGrid[2][2].content = "= -15"; // C3
        modifiedGrid[0][3].content = "= SUM(A2..A4)"; // D1
        modifiedGrid[4][3].content = "= -5"; // D5

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 })

        expect(parsedCell.evaluate().content).to.deep.equal("15");
    });

    it("attempt REF without equals sign", () => {
        modifiedGrid[0][0].content = "REF(A2)";

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 })

        expect(parsedCell.evaluate().content).to.deep.equal("REF(A2)");
    });

    it("basic REF", () => {
        modifiedGrid[0][0].content = "= REF(A2)"; // A1
        modifiedGrid[1][0].content = "= 8"; // A2

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 })

        expect(parsedCell.evaluate().content).to.deep.equal("8");
    });

    it("empty REF", () => {
        modifiedGrid[0][0].content = "= REF(A2)";

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 });

        expect(parsedCell.evaluate().content).to.deep.equal("0");
    });

    it("deep REFs", () => {
        modifiedGrid[0][0].content = "= REF(A2)"; // A1
        modifiedGrid[1][0].content = "= REF(B1)"; // A2
        modifiedGrid[0][1].content = "= REF(B2)"; // B1
        modifiedGrid[1][1].content = "= 5"; // B2


        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 });

        expect(parsedCell.evaluate().content).to.deep.equal("5");
    });

    it("reference an AVG cell", () => {
        modifiedGrid[0][0].content = "= REF(A2)"; // A1
        modifiedGrid[1][0].content = "= AVG(B1..B2)"; // A2
        modifiedGrid[0][1].content = "= 10"; // B1
        modifiedGrid[1][1].content = "= 2"; // B2

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 })

        expect(parsedCell.evaluate().content).to.deep.equal("6");
    });

    it("reference a SUM cell", () => {
        modifiedGrid[0][0].content = "= REF(A2)"; // A1
        modifiedGrid[1][0].content = "= SUM(B1..B2)"; // A2
        modifiedGrid[0][1].content = "= 10"; // B1
        modifiedGrid[1][1].content = "= 2"; // B2

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 })

        expect(parsedCell.evaluate().content).to.deep.equal("12");
    });

    it("cell updates when reference cell is deleted", () => {
        modifiedGrid[1][0].content = "= 5"; // A2
        modifiedGrid[0][0].content = "= REF(A2)"; // A1
        modifiedGrid[1][0].content = ""; // A2

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 })

        expect(parsedCell.evaluate().content).to.deep.equal("0");
    });

    it("cell updates when reference cell is modified", () => {
        modifiedGrid[1][0].content = "= 5"; // A2
        modifiedGrid[0][0].content = "= REF(A2)"; // A1
        modifiedGrid[1][0].content = "\"zip\""; // A2

        let parsedCell = new FunctionParser(modifiedGrid, modifiedGrid[0][0].content.trim(), { y: 0, x: 0 })

        expect(parsedCell.evaluate().content).to.deep.equal("zip");
    });

    it("basic string concat", () => {
        modifiedGrid[0][0].content = "\"zip\" + \"zap\"";

        let parsedCell = new StringParser(modifiedGrid[0][0].content);

        expect(parsedCell.evaluate()).to.deep.equal("zipzap");
    });

    it("multiple string concats", () => {
        modifiedGrid[0][0].content = "\"zip\" + \"zap\" + \"zip\" + \"zap\"";

        let parsedCell = new StringParser(modifiedGrid[0][0].content);

        expect(parsedCell.evaluate()).to.deep.equal("zipzapzipzap");
    });

    it("string concat with string number", () => {
        modifiedGrid[0][0].content = "\"zip\" + \"4\" + \"zap\"";

        let parsedCell = new StringParser(modifiedGrid[0][0].content);

        expect(parsedCell.evaluate()).to.deep.equal("zip4zap");
    });

    it("attempt string concat with number", () => {
        modifiedGrid[0][0].content = "\"zip\" + 4 + \"zap\"";

        let parsedCell = new StringParser(modifiedGrid[0][0].content);

        expect(parsedCell.evaluate()).to.deep.equal("\"zip\" + 4 + \"zap\"");
    });

    it("attempt string concat with non-string", () => {
        modifiedGrid[0][0].content = "\"zip\" + zap";

        let parsedCell = new StringParser(modifiedGrid[0][0].content);

        expect(parsedCell.evaluate()).to.deep.equal("\"zip\" + zap");
    });

    it("attempt string concat with open quotes", () => {
        modifiedGrid[0][0].content = "\"zip + \"zap\"";

        let parsedCell = new StringParser(modifiedGrid[0][0].content);

        expect(parsedCell.evaluate()).to.deep.equal("\"zip + \"zap\"");
    });
});