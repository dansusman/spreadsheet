export interface SelectedCell {
    column: number;
    row: number;
    cellLabel: string;
}

export interface ParserError {
    errorType: string;
    errorMessage: string;
}

export interface ParserResponse {
    error?: ParserError;
    content: string;
}

export interface CartesianPair {
    x: number;
    y: number;
}

export class FailedParseError extends Error {
    type: string;
    constructor(message: string, type: string) {
        super(message);
        this.type = type;
    }
}
export class FormatError extends Error {
    type: string = "FORMAT!";
    constructor(command: string) {
        super("");
        this.message = `Incorrectly formatted ${command}.\nHint: Use format =${command}(<Cell>..<Cell>)`;
    }
}

export class CircularError extends Error {
    type: string = "REF!";
    constructor(command: string) {
        super("");
        this.message = `Circular dependency detected.\nPlease revise your ${command} formula`;
    }
}

export class OverflowError extends Error {
    type: string = "OVERFLOW!";
    constructor() {
        super("");
        this.message = `Circular dependency detected.\nPlease revise your formula`;
    }
}
export class ReferenceError extends Error {
    type: string = "REF!";
    constructor() {
        super("");
        this.message = "Reference error detected.\nCell does not exist";
    }
}
