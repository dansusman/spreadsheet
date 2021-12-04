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
            const boxCorners: any[] = sums[1]
                .split("..")
                .map((reference: string) => {
                    return getExactPositionFromHeader(reference);
                });
            if (boxCorners.length !== 2) {
                throw new FormatError(command);
            }

            const minCol = Math.min(boxCorners[0].x, boxCorners[1].x);
            const maxCol = Math.max(boxCorners[0].x, boxCorners[1].x);
            const minRow = Math.min(boxCorners[0].y, boxCorners[1].y);
            const maxRow = Math.max(boxCorners[0].y, boxCorners[1].y);

            if (
                !isWithinGrid(this.grid, boxCorners[0]) ||
                !isWithinGrid(this.grid, boxCorners[1])
            ) {
                throw new ReferenceError();
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
                throw new CircularError(command);
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

    refs(): boolean {
        var isFunction = true;
        var result = this.contents;
        if (this.contents.includes("REF")) {
            const regex = /REF\(([^)]+)\)/g;
            const matches = Array.from(result.matchAll(regex));
            const functions = matches.map((refs: any) => {
                const refCoords = getExactPositionFromHeader(refs[1]);
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
                console.log(answer);
                if (answer.content.includes(`"`)) {
                    return new StringParser(answer.content).evaluate();
                } else {
                    return answer.content ? `=${answer.content}` : "= 0";
                }
            });

            matches.forEach((match, index) => {
                if (functions[index].startsWith("=")) {
                    result = result.replace(
                        match[0],
                        functions[index].replace("=", "")
                    );
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

    evaluate(): ParserResponse {
        if (this.depth > 11) {
            throw new OverflowError();
        }
        if (this.contents.startsWith("=")) {
            try {
                this.sum();
                this.avg();
                const isFunction = this.refs();
                if (this.contents.startsWith("=")) {
                    this.contents = this.contents.substring(1);
                }
                if (isFunction) {
                    return {
                        content: String(evaluate(this.contents)),
                        dependencies: this.dependencies,
                    };
                }
            } catch (e: any) {
                const error: ParserError = {
                    errorMessage: e.type
                        ? e.message
                        : `${e.message}\nPlease revise your cell input!`,
                    errorType: e.type || "ERROR!",
                };
                // TODO: may cause issues with depth
                return { content: "", error, dependencies: this.dependencies };
            }
        }
        return { content: this.contents, dependencies: this.dependencies };
    }
}
