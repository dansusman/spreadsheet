/**
 * The StringParser object which allows for parsing of string
 * concatenation.
 */
export class StringParser {
    private contents: string;
    constructor(contents: string) {
        this.contents = contents;
    }

    /**
     * Evaluate the contents, checking for string concatenation
     * and applying the concatenation if found.
     * @returns the updated contents to set the Cell's content
     * equal to
     */
    evaluate(): string {
        const copy = this.contents;
        const regex: RegExp = /"(.*?)"/g;
        const matches = Array.from(copy.matchAll(regex));
        if (
            this.contents.split("+").length !== matches.length ||
            copy.replaceAll(regex, "").replaceAll("+", "").trim().length > 0
        ) {
            return this.contents;
        }
        return matches.reduce((prev, curr) => prev + curr[1], "");
    }
}
