import { CellObservable, CellObserver } from "../util/observer";

/**
 * The SelectedCell object, which has a location in
 * the grid (row, column) and a cellLabel (e.g. A1).
 */
export interface SelectedCell {
    column: number;
    row: number;
    cellLabel: string;
}

/**
 * The ParserError object, which has an errorType
 * and errorMessage, useful in displaying extra information
 * to the user in the error pop-ups.
 */
export interface ParserError {
    errorType: string;
    errorMessage: string;
}

/**
 * The ParserResponse object, which has some text content
 * to update the Cell to have, some dependencies of which the current
 * cell should be aware, and a ParserError in the case that the cell is erroring.
 */
export interface ParserResponse {
    error?: ParserError;
    content: string;
    dependencies: CartesianPair[];
}

/**
 * The CartesianPair object, which has an x and a y coordinate,
 * representing a location in the grid of Cells, where y is the row
 * number and x is the column number.
 */
export interface CartesianPair {
    x: number;
    y: number;
}

/**
 * A mapping class between CellObserver and CellObservable.
 */
export interface SubscriptionBundle {
    observer: CellObserver;
    observable: CellObservable;
}

/**
 * A customized Error to provide the user with bonus information
 * and a stylized Error pop-up dialog. Thrown for general issues with
 * parsing expressions.
 */
export class FailedParseError extends Error {
    type: string;
    constructor(message: string, type: string) {
        super(message);
        this.type = type;
    }
}

/**
 * A custom error thrown if a formatting issue occurs, i.e.
 * a Cell's content does not meet all required syntax for SUM, REF,
 * and/or AVG.
 */
export class FormatError extends Error {
    type: string = "FORMAT!";
    constructor(command: string) {
        super("");
        this.message = `Incorrectly formatted ${command}.\nHint: Use format =${command}(<Cell>..<Cell>).`;
    }
}

/**
 * A custom error thrown if a Cell is referencing itself or has itself
 * within the range of a SUM or AVG formula.
 */
export class CircularError extends Error {
    type: string = "CIRCLE!";
    constructor(command: string) {
        super("");
        this.message = `Circular dependency detected.\nPlease revise your ${command} formula!`;
    }
}

/**
 * A custom error thrown if an overflow of recursion is detected.
 */
export class OverflowError extends Error {
    type: string = "OVERFLOW!";
    constructor() {
        super("");
        this.message = `Circular dependency detected.\nPlease revise your formula!`;
    }
}

/**
 * A custom error thrown if a Cell is referencing a cell outside
 * the grid (isOutside = true) or a cell that does not exist.
 */
export class ReferenceError extends Error {
    type: string = "REF!";
    constructor(isOutside: boolean = false) {
        super("");
        var append = "Cell does not exist!";
        if (isOutside) {
            append = "Cell outside bounds of grid!";
        }
        this.message = `Reference error detected.\n${append}`;
    }
}
