import { evaluate } from "mathjs";
import { Cell } from "../store/grid/types";
import { getExactPositionFromHeader } from "./gridCoords";

export class FunctionParser {
  private grid: Cell[][];
  private contents: string;
  constructor(grid: Cell[][], contents: string) {
    this.grid = grid;
    this.contents = contents;
  }

  applyRegExOnRange(regex: RegExp): { result: string; length: number } {
    var result = this.contents;
    const matches = Array.from(result.matchAll(regex));
    var boxCount = 0;
    const functions = matches.map((sums: any) => {
      const boxCorners: any[] = sums[1].split("..").map((reference: string) => {
        return getExactPositionFromHeader(reference);
      });
      if (boxCorners.length !== 2) {
        throw new Error("ree");
      }

      const minCol = Math.min(boxCorners[0].col, boxCorners[1].col);
      const maxCol = Math.max(boxCorners[0].col, boxCorners[1].col);
      const minRow = Math.min(boxCorners[0].row, boxCorners[1].row);
      const maxRow = Math.max(boxCorners[0].row, boxCorners[1].row);

      var eqs: string[] = [];

      for (let rowNum = minRow; rowNum <= maxRow; rowNum++) {
        for (let colNum = minCol; colNum <= maxCol; colNum++) {
          const answer = new FunctionParser(
            this.grid,
            this.grid[rowNum][colNum].content
          ).evaluate();
          const eq = answer || "= 0";
          eqs = [`(${eq.replace("=", "")})`, ...eqs];
        }
      }
      boxCount = eqs.length;
      return eqs.splice(1).reduce((prev, curr) => `${curr} + ${prev}`, eqs[0]);
    });
    matches.forEach((match, index) => {
      result = result.replace(match[0], `(${functions[index]})`);
    });
    return { result, length: boxCount };
  }

  sum(): void {
    if (this.contents.includes("SUM")) {
      const regex = /SUM\(([^)]+)\)/g;
      const { result } = this.applyRegExOnRange(regex);
      console.log("Content from SUM before:", this.contents);
      this.contents = result;
      console.log("Content from SUM after:", this.contents);
    }
  }

  avg(): void {
    if (this.contents.includes("AVG")) {
      const regex = /AVG\(([^)]+)\)/g;
      const { result, length } = this.applyRegExOnRange(regex);
      this.contents = `(${result} / ${length})`;
    }
  }

  refs(): void {
    var result = this.contents;
    if (this.contents.includes("REF")) {
      const regex = /REF\(([^)]+)\)/g;
      const matches = Array.from(result.matchAll(regex));
      const functions = matches.map((refs: any) => {
        const { row, col } = getExactPositionFromHeader(refs[1]);
        const answer = new FunctionParser(
          this.grid,
          this.grid[row][col].content
        ).evaluate();
        return answer || "= 0";
      });

      matches.forEach((match, index) => {
        result = result.replace(
          match[0],
          `(${functions[index].replace("=", "")})`
        );
      });

      console.log("Content from REF before:", this.contents);
      this.contents = result.substring(1);
      console.log("Content from REF after:", this.contents);
    }
  }

  evaluate(): string {
    if (this.contents.startsWith("=")) {
      try {
        this.refs();
        this.sum();
        this.avg();
        if (this.contents.startsWith("=")) {
          this.contents = this.contents.substring(1);
        }
        console.log(this.contents);
        return String(evaluate(this.contents));
      } catch (e: any) {
        return e.message;
      }
    }
    return this.contents;
  }
}
