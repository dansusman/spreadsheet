export class StringParser {
  private contents: string;
  constructor(contents: string) {
    this.contents = contents;
  }

  evaluate(): string {
    const copy = this.contents;
    const regex: RegExp = /"(.*?)"/g;
    if (copy.replace(regex, "").replace("+", "").trim().length > 0) {
      return this.contents;
    }
    return Array.from(this.contents.matchAll(regex)).reduce(
      (prev, curr) => prev + curr[1],
      ""
    );
  }
}
