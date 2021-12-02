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
