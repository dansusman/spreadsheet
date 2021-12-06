import { Cell } from "../store/grid/types";
import { CartesianPair } from "../types";

/**
 * Translates column numbers to corresponding titles.
 * E.g. Column = 2 maps to the letter "B".
 * @param columns the number of columns in the grid
 * @returns the list of column headers to include in the grid
 */
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

/**
 * Translates a given CartesianPair into a serializable string.
 * @param coords a CartesianPair object representing a location in the grid
 * @returns a string representation of a coordinate pair
 */
export function cartesianToString(coords: CartesianPair) {
    return `(x:${coords.x}, y:${coords.y})`;
}

/**
 * Gets the correct CartesianPair location in the grid
 * from a given header title.
 * E.g. "B2" maps to CartesianPair with x: 2, y: 2.
 * @param header the header title of a Cell
 * @returns a CartesianPair representing the location in the grid
 * of the Cell with the given header
 */
export function getExactPositionFromHeader(header: string): CartesianPair {
    const newHeader = header.toLowerCase();
    const untranslatedColumn = newHeader.replace(/[^A-Za-z]/g, "");
    const row = +header.replace(/^\D+/g, "") - 1;
    const headerLetterToGeneralColumn = untranslatedColumn.charCodeAt(0) - 97;
    const col =
        headerLetterToGeneralColumn + (untranslatedColumn.length - 1) * 26;

    if (isNaN(row) || row < 0 || isNaN(col) || col < 0) {
        throw new Error(`"${header}" is an invalid input.`);
    }
    return { y: row, x: col };
}

/**
 * Checks if the Cell at the given CartesianPair coordinates
 * in the grid is within the range (rectangle) created by
 * maxCol, minCol, maxRow, and minRow.
 * @param maxCol the farthest right column
 * @param minCol the farthest left column
 * @param maxRow the farther down row
 * @param minRow the highest up row
 * @param coords the coordinates of a Cell
 * @returns true if the coords is inside the rectangle
 */
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

/**
 * Checks if the given coords are on the grid.
 * @param grid the whole grid of Cells
 * @param coord the CartesianPair coordinates of a Cell
 * @returns true if the given coord is within the grid
 */
export function isWithinGrid(grid: Cell[][], coord: CartesianPair): boolean {
    if (grid.length === 0 || grid[0].length === 0) return false;
    return isWithinRange(grid[0].length, 0, grid.length, 0, coord);
}
