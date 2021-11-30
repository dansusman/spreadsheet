import { Summarize } from "@mui/icons-material";
import { e, evaluate, sum } from "mathjs";
import { Cell } from "../store/grid/types";
import { getExactPositionFromHeader } from "./gridCoords";

export class FunctionParser {
    private grid: Cell[][];
    private contents: string;
    constructor(grid: Cell[][], contents: string) {
        this.grid = grid;
        this.contents = contents;
    }

    sum() {
        var result = this.contents;
        if (result.includes("SUM")) {
            const regex = /SUM\(([^)]+)\)/g;
            const match = Array.from(result.matchAll(regex));
            const functions = match.map((sums: any) => {
                const boxCorners: any[] = sums[1]
                    .split("..")
                    .map((reference: string) => {
                        return getExactPositionFromHeader(reference);
                    });
                if (boxCorners.length !== 2) {
                    throw new Error("ree");
                }

                const minCol = Math.min(boxCorners[0].col, boxCorners[1].col);
                const maxCol = Math.max(boxCorners[0].col, boxCorners[1].col);
                const minRow = Math.min(boxCorners[0].row, boxCorners[1].row);
                const maxRow = Math.max(boxCorners[0].row, boxCorners[1].row);

                var eqs: string[] = [];

                for (let rowNum = minRow; rowNum <= maxRow; rowNum++) {
                    for (let colNum = minCol; colNum <= maxCol; colNum++) {
                        const eq = this.grid[rowNum][colNum].content || "= 0";
                        eqs = [`(${eq.replace("=", "")})`, ...eqs];
                    }
                }
                return eqs.reduce((prev, curr) => `${curr} + ${prev}`, eqs[0]);
            });
            match.forEach((match, index) => {
                result = result.replace(match[0], `(${functions[index]})`);
            });
        }

        this.contents = result;
    }

    refs() {
        if (this.contents.includes("REF")) {
        }
        return this.contents;
    }

    evaluate(): string {
        if (this.contents.startsWith("=")) {
            this.sum();
            return String(evaluate(this.contents.substring(1)));
        }
        return this.contents;
    }
}
