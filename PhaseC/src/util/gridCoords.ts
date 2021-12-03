import { Cell } from "../store/grid/types";
import { CartesianPair } from "../types";

export function getColHeaders(columns: number): string[] {
    var headers: string[] = [];
    for (let col = 1; col <= columns; col++) {
        const repeatCharacterCount = Math.ceil(col / 26);
        const character: string = String.fromCharCode(97 + ((col - 1) % 26));
        const colText = character.repeat(repeatCharacterCount);
        headers = [...headers, colText];
    }
    return headers;
}

export function cartesianToString(coords: CartesianPair) {
    return `(x:${coords.x}, y:${coords.y})`;
}

export function getExactPositionFromHeader(header: string): CartesianPair {
    const newHeader = header.toLowerCase();
    const untranslatedColumn = newHeader.replace(/[^A-Za-z]/g, "");
    const row = +header.replace(/^\D+/g, "") - 1;
    const headerLetterToGeneralColumn = untranslatedColumn.charCodeAt(0) - 97;
    const col =
        headerLetterToGeneralColumn + (untranslatedColumn.length - 1) * 26;

    if (isNaN(row) || row < 0 || isNaN(col) || col < 0) {
        throw new Error(`"${header}" is an invalid input.\nPlease try again`);
    }
    return { y: row, x: col };
}

export function isWithinRange(
    maxCol: number,
    minCol: number,
    maxRow: number,
    minRow: number,
    coords: CartesianPair
) {
    return (
        maxCol >= coords.x &&
        minCol <= coords.x &&
        maxRow >= coords.y &&
        minRow <= coords.y
    );
}

export function isWithinGrid(grid: Cell[][], coord: CartesianPair): boolean {
    if (grid.length === 0 || grid[0].length === 0) return false;
    return isWithinRange(grid[0].length, 0, grid.length, 0, coord);
}
