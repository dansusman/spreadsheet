import { evaluate } from "mathjs";

export function operationParse(content: string): string {
    if (content.startsWith("=")) {
        const result = parseMath(content.substring(1));
        return result;
    }
    return content;
}

export function parseMath(content: string): string {
    return String(evaluate(content));
}
