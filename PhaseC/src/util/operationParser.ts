import { evaluate } from "mathjs";
import { Cell } from "../store/grid/types";
import {
    CartesianPair,
    CircularError,
    FailedParseError,
    FormatError,
    OverflowError,
    ParserError,
    ParserResponse,
    ReferenceError,
} from "../types";
import {
    getExactPositionFromHeader,
    isWithinGrid,
    isWithinRange,
} from "./gridCoords";
import { StringParser } from "./stringParser";

/**
 * A Parser object to parse a Cell's contents for possibly
 * valid and possibly invalid expressions. This includes
 * mathematical expressions, SUMs, AVGs, and REFs.
 */
export class FunctionParser {
    private grid: Cell[][];
    private contents: string;
    private readonly currentCoords: CartesianPair;
    private depth: number;
    private dependencies: CartesianPair[] = [];
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

    /**
     * Look for SUM or AVG, validate expression if found, and
     * return any matches, functions, and the lengths of expressions.
     */
    applyRegExOnRange(
        regex: RegExp,
        command: string
    ): {
        matches: RegExpMatchArray[];
        functions: string[];
        lengths: number[];
    } {
        var result = this.contents;
        const matches = Array.from(result.matchAll(regex));
        var lengths: number[] = [];
        const functions = matches.map((sums: any) => {
            if (!this.contents.includes("..")) {
                throw new FormatError(command);
            }
            // get the numeric representation of each Cell header
            const boxCorners: any[] = sums[1]
                .split("..")
                .map((reference: string) => {
                    return getExactPositionFromHeader(reference);
                });
            if (boxCorners.length !== 2) {
                throw new FormatError(command);
            }

            // grab vertices of rectangle (range)
            const { maxCol, minCol, maxRow, minRow } =
                this.boundingVertices(boxCorners);

            // check for any errors
            this.validate(boxCorners, maxCol, minCol, maxRow, minRow, command);

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
                        throw new FailedParseError(
                            answer.error.errorMessage,
                            answer.error.errorType
                        );
                    }
                    this.dependencies = [
                        ...this.dependencies,
                        { x: colNum, y: rowNum },
                    ];
                    const eq = answer.content || "= 0";
                    eqs = [`(${eq.replace("=", "")})`, ...eqs];
                }
            }
            lengths.push(eqs.length);
            return eqs
                .splice(1)
                .reduce((prev, curr) => `${curr} + ${prev}`, eqs[0]);
        });
        return { matches, functions, lengths };
    }

    private boundingVertices(boxCorners: any[]) {
        const minCol = Math.min(boxCorners[0].x, boxCorners[1].x);
        const maxCol = Math.max(boxCorners[0].x, boxCorners[1].x);
        const minRow = Math.min(boxCorners[0].y, boxCorners[1].y);
        const maxRow = Math.max(boxCorners[0].y, boxCorners[1].y);
        return { maxCol, minCol, maxRow, minRow };
    }

    private validate(
        boxCorners: any[],
        maxCol: number,
        minCol: number,
        maxRow: number,
        minRow: number,
        command: string
    ) {
        // check if either location is outside the grid;
        // if so, throw a ReferenceError
        if (
            !isWithinGrid(this.grid, boxCorners[0]) ||
            !isWithinGrid(this.grid, boxCorners[1])
        ) {
            throw new ReferenceError();
        }
        // check if the calling Cell is within the range;
        // if so, throw a CircularError
        if (isWithinRange(maxCol, minCol, maxRow, minRow, this.currentCoords)) {
            throw new CircularError(command);
        }
    }

    /**
     * Check for SUM expression and evaluate if found.
     */
    sum(): void {
        if (this.contents.includes("SUM")) {
            const regex = /SUM\(([^)]+)\)/g;
            const { matches, functions } = this.applyRegExOnRange(regex, "SUM");
            matches.forEach((match, index) => {
                this.contents = this.contents.replace(
                    match[0],
                    `(${functions[index]})`
                );
            });
        }
    }

    /**
     * Check for AVG expression and evaluate if found.
     */
    avg(): void {
        if (this.contents.includes("AVG")) {
            const regex = /AVG\(([^)]+)\)/g;
            const { matches, functions, lengths } = this.applyRegExOnRange(
                regex,
                "AVG"
            );
            if (lengths.includes(0)) {
                throw new FormatError("AVG");
            }
            matches.forEach((match, index) => {
                this.contents = this.contents.replace(
                    match[0],
                    `(${functions[index]}) / ${lengths[index]}`
                );
            });
        }
    }

    /**
     * Check for REF expression and evaluate if found.
     * @returns true if the referenced cell contains a function
     */
    refs(): boolean {
        var isFunction = true;
        var result = this.contents;
        if (this.contents.includes("REF")) {
            const regex = /REF\(([^)]+)\)/g;
            const matches = Array.from(result.matchAll(regex));
            const functions = matches.map((refs: any) => {
                const refCoords = getExactPositionFromHeader(refs[1]);
                // Check if the coords are outside grid;
                // if so, throw ReferenceError
                if (!isWithinGrid(this.grid, refCoords)) {
                    throw new ReferenceError(true);
                }
                const { x, y } = refCoords;
                if (x === this.currentCoords.x && y === this.currentCoords.y) {
                    throw new CircularError("REF");
                }
                const answer = new FunctionParser(
                    this.grid,
                    this.grid[y][x].content,
                    { x, y },
                    this.depth + 1
                ).evaluate();

                if (answer.error) {
                    throw new FailedParseError(
                        answer.error.errorMessage,
                        answer.error.errorType
                    );
                }
                this.dependencies = [...this.dependencies, { x, y }];
                if (answer.content.includes(`"`)) {
                    return new StringParser(answer.content).evaluate();
                } else {
                    return answer.content ? answer.content : "0";
                }
            });

            matches.forEach((match, index) => {
                if (functions[index].startsWith("=")) {
                    result = result.replace(match[0], functions[index]);
                } else {
                    isFunction = false;
                    result = result.replace(match[0], functions[index]);
                }
            });

            this.contents = result.substring(1);

            return isFunction;
        }
        return isFunction;
    }

    /**
     * Evaluate the contents of a cell by parsing for expressions
     * and applying any computation needed.
     * @returns a ParserResponse, with any errors to display, dependencies
     * the cell has, and the content for the cell
     */
    evaluate(): ParserResponse {
        if (this.depth > 11) {
            throw new OverflowError();
        }
        // if starts with "=", we have an expression
        if (this.contents.startsWith("=")) {
            try {
                this.sum();
                this.avg();
                const isFunction = this.refs();
                if (this.contents.includes("==")) {
                    throw new Error();
                }
                if (this.contents.startsWith("=")) {
                    this.contents = this.contents.replaceAll("=", "");
                }
                // if the referenced cell has a function, evaluate recursively
                if (isFunction) {
                    return {
                        content: String(evaluate(this.contents)),
                        dependencies: this.dependencies,
                    };
                }
            } catch (e: any) {
                // catch any errors and react accordingly
                const error: ParserError = {
                    errorMessage: e.type
                        ? e.message
                        : `${e.message}\nPlease revise your cell input!`,
                    errorType: e.type || "ERROR!",
                };
                return { content: "", error, dependencies: this.dependencies };
            }
        }
        return {
            content: this.contents.trim(),
            dependencies: this.dependencies,
        };
    }
}
