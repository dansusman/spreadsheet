import { evaluate } from "mathjs";
import { Cell } from "../store/grid/types";
import { CartesianPair, ParserError, ParserResponse } from "../types";
import {
    getExactPositionFromHeader,
    isWithinGrid,
    isWithinRange,
} from "./gridCoords";

export class FunctionParser {
    private grid: Cell[][];
    private contents: string;
    private readonly currentCoords: CartesianPair;
    private depth: number;
    constructor(
        grid: Cell[][],
        contents: string,
        currentCoords: CartesianPair,
        depth: number = 0
    ) {
        this.grid = grid;
        this.contents = contents;
        this.currentCoords = currentCoords;
        this.depth = depth;
    }

    applyRegExOnRange(
        regex: RegExp,
        command: string
    ): {
        result: string;
        length: number;
    } {
        var result = this.contents;
        const matches = Array.from(result.matchAll(regex));
        var boxCount = 0;
        const functions = matches.map((sums: any) => {
            const boxCorners: any[] = sums[1]
                .split("..")
                .map((reference: string) => {
                    return getExactPositionFromHeader(reference);
                });
            if (boxCorners.length !== 2) {
                throw new Error(
                    `Incorrectly formatted ${command}.\nHint: Use format =${command}(<Cell>..<Cell>)`
                );
            }

            const minCol = Math.min(boxCorners[0].x, boxCorners[1].x);
            const maxCol = Math.max(boxCorners[0].x, boxCorners[1].x);
            const minRow = Math.min(boxCorners[0].y, boxCorners[1].y);
            const maxRow = Math.max(boxCorners[0].y, boxCorners[1].y);

            if (
                !isWithinGrid(this.grid, boxCorners[0]) ||
                !isWithinGrid(this.grid, boxCorners[1])
            ) {
                throw new Error(
                    `Reference error detected.\nCell outside bounds of grid`
                );
            }
            if (
                isWithinRange(
                    maxCol,
                    minCol,
                    maxRow,
                    minRow,
                    this.currentCoords
                )
            ) {
                throw new Error(
                    `Circular dependency detected.\nPlease revise your ${command} formula`
                );
            }

            var eqs: string[] = [];

            for (let rowNum = minRow; rowNum <= maxRow; rowNum++) {
                for (let colNum = minCol; colNum <= maxCol; colNum++) {
                    const answer = new FunctionParser(
                        this.grid,
                        this.grid[rowNum][colNum].content,
                        { x: colNum, y: rowNum },
                        this.depth + 1
                    ).evaluate();
                    if (answer.error) {
                        throw new Error(answer.error.errorMessage);
                    }
                    const eq = answer.content || "= 0";
                    eqs = [`(${eq.replace("=", "")})`, ...eqs];
                }
            }
            boxCount = eqs.length;
            return eqs
                .splice(1)
                .reduce((prev, curr) => `${curr} + ${prev}`, eqs[0]);
        });
        matches.forEach((match, index) => {
            result = result.replace(match[0], `(${functions[index]})`);
        });
        return { result, length: boxCount };
    }

    sum(): void {
        if (this.contents.includes("SUM")) {
            const regex = /SUM\(([^)]+)\)/g;
            const { result } = this.applyRegExOnRange(regex, "SUM");
            console.log("Content from SUM before:", this.contents);
            this.contents = result;
            console.log("Content from SUM after:", this.contents);
        }
    }

    avg(): void {
        if (this.contents.includes("AVG")) {
            const regex = /AVG\(([^)]+)\)/g;
            const { result, length } = this.applyRegExOnRange(regex, "AVG");
            if (length === 0) {
                throw new Error("Incorrectly formatted AVG.");
            }
            this.contents = `(${result} / ${length})`;
        }
    }

    refs(): void {
        var result = this.contents;
        if (this.contents.includes("REF")) {
            const regex = /REF\(([^)]+)\)/g;
            const matches = Array.from(result.matchAll(regex));
            const functions = matches.map((refs: any) => {
                const refCoords = getExactPositionFromHeader(refs[1]);
                console.log(refCoords);
                if (!isWithinGrid(this.grid, refCoords)) {
                    throw new Error(
                        `Reference error detected.\nCell outside bounds of grid`
                    );
                }
                const { x, y } = refCoords;
                if (x === this.currentCoords.x && y === this.currentCoords.y) {
                    throw new Error(
                        `Circular dependency detected.\nPlease revise your REF formula`
                    );
                }
                const answer = new FunctionParser(
                    this.grid,
                    this.grid[y][x].content,
                    { x, y },
                    this.depth + 1
                ).evaluate();

                if (answer.error) {
                    throw new Error(answer.error.errorMessage);
                }
                return answer.content || "= 0";
            });

            matches.forEach((match, index) => {
                result = result.replace(
                    match[0],
                    `(${functions[index].replace("=", "")})`
                );
            });

            console.log("Content from REF before:", this.contents);
            this.contents = result.substring(1);
            console.log("Content from REF after:", this.contents);
        }
    }

    private translateErrorMessageToType(message: string): ParserError {
        const defaultCode = "ERROR!";
        const errors: { [key: string]: string } = {
            "Incorrectly formatted AVG.\nHint: Use format =AVG(<Cell>..<Cell>)":
                "FORMAT!",
            "Incorrectly formatted SUM.\nHint: Use format =SUM(<Cell>..<Cell>)":
                "FORMAT!",
            "Circular dependency detected.\nPlease revise your SUM formula":
                "REF!",
            "Circular dependency detected.\nPlease revise your REF formula":
                "REF!",
            "Circular dependency detected.\nPlease revise your AVG formula":
                "REF!",
            "Reference error detected.\nCell outside bounds of grid": "REF!",
        };
        const parserError: ParserError = {
            errorType: errors[message] || defaultCode,
            errorMessage: message,
        };
        return parserError;
    }

    evaluate(): ParserResponse {
        if (this.depth > 11) {
            throw new Error("Maximum call stack size exceeded");
        }
        if (this.contents.startsWith("=")) {
            try {
                this.refs();
                this.sum();
                this.avg();
                if (this.contents.startsWith("=")) {
                    this.contents = this.contents.substring(1);
                }
                console.log(this.contents);
                // TODO: general math js errors
                return { content: String(evaluate(this.contents)) };
            } catch (e: any) {
                const error: ParserError = this.translateErrorMessageToType(
                    e.message
                );
                if (e.message === "Maximum call stack size exceeded") {
                    error.errorMessage =
                        "Circular dependency detected.\nPlease revise your formula";
                    error.errorType = "REF!";
                }
                return { content: "", error };
            }
        }
        return { content: this.contents };
    }
}
