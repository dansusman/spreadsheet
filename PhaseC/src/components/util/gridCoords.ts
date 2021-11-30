import { number } from "mathjs";

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

export function getExactPositionFromHeader(header: string): {
    row: number;
    col: number;
} {
    const untranslatedColumn = header.replace(/[^A-Za-z]/g, "");
    const row = +header.replace(/^\D+/g, "") - 1;
    const headerLetterToGeneralColumn = untranslatedColumn.charCodeAt(0) - 97;
    const col =
        headerLetterToGeneralColumn + (untranslatedColumn.length - 1) * 26;

    return { row, col };
}
