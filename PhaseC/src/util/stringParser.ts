export class StringParser {
    private contents: string;
    constructor(contents: string) {
        this.contents = contents;
    }

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
