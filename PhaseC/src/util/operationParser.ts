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
                const summed: string[] = sums[1]
                    .split("..")
                    .map((reference: string) => {
                        const coords = getExactPositionFromHeader(reference);
                        const eq =
                            this.grid[coords.row][coords.col].content || "= 0";
                        return `(${eq.replace("=", "")})`;
                    });
                return summed
                    .slice(1)
                    .reduce((prev, curr) => `${curr} + ${prev}`, summed[0]);
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
