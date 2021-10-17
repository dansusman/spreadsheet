interface Observer {
    update(): void;
}

class CellObserver implements Observer {
    update(): void {
        throw new Error("Method not implemented.");
    }
}

interface Observable {
    sub(obs: Observer): void;
    unSub(obs: Observer): void;
    notify(): void;
}

class Cell implements Observable {
    private _contents: Expression;
    private _color: string;
    private _state: CellState;
    private _subscribers: Observer[];

    constructor() {}

    sub(obs: Observer): void {
        throw new Error("Method not implemented.");
    }
    unSub(obs: Observer): void {
        throw new Error("Method not implemented.");
    }
    notify(): void {
        throw new Error("Method not implemented.");
    }

    accept<T>(cv: CellVisitor<T>): T {
        throw new Error("Method not implemented.");
    }
}

enum CellState {
    SELECTED,
    UNSELECTED,
    REFERENCED,
}

class SpreadSheet {
    private _grid: Grid;
    private _redoStack: Action[];
    private _undoStack: Action[];

    constructor() {}

    redo(): void {
        throw new Error("Method not implemented.");
    }
    undo(): void {
        throw new Error("Method not implemented.");
    }
}

class Grid {
    private _grid: Cell[][];

    constructor() {}

    addRow(): void {
        throw new Error("Method not implemented.");
    }
    deleteRow(): void {
        throw new Error("Method not implemented.");
    }
    addColumn(): void {
        throw new Error("Method not implemented.");
    }
    deleteColumn(): void {
        throw new Error("Method not implemented.");
    }
}

interface CellVisitor<T> {
    visitCell(c: Cell): T;
}

class CellEvalVisitor implements CellVisitor<string> {
    visitCell(c: any): string {
        throw new Error("Method not implemented.");
    }
}

interface ExpressionVisitor<T> {
    visitReference(r: Reference): T;
    visitAdd(a: Add): T;
    visitSubtract(s: Subtract): T;
    visitMultiply(m: Multiply): T;
    visitDivide(d: Divide): T;
    visitPlainText(t: PlainText): T;
    visitNum(n: Num): T;
}

class ExpressionEvalVisitor implements ExpressionVisitor<string> {
    visitReference(r: any): string {
        throw new Error("Method not implemented.");
    }
    visitAdd(a: any): string {
        throw new Error("Method not implemented.");
    }
    visitSubtract(s: any): string {
        throw new Error("Method not implemented.");
    }
    visitMultiply(m: any): string {
        throw new Error("Method not implemented.");
    }
    visitDivide(d: any): string {
        throw new Error("Method not implemented.");
    }
    visitPlainText(t: PlainText): string {
        throw new Error("Method not implemented.");
    }
    visitNum(n: any): string {
        throw new Error("Method not implemented.");
    }
}

interface Expression {
    evaluate(): string;
    accept<T>(ev: ExpressionVisitor<T>): T;
}

class Num implements Expression {
    value: number;

    constructor() {}

    evaluate(): string {
        throw new Error("Method not implemented.");
    }
    accept<T>(ev: ExpressionVisitor<T>): T {
        throw new Error("Method not implemented.");
    }
}

class PlainText implements Expression {
    contents: string;

    constructor() {}

    evaluate(): string {
        throw new Error("Method not implemented.");
    }
    accept<T>(ev: ExpressionVisitor<T>): T {
        throw new Error("Method not implemented.");
    }
}

class Reference implements Expression {
    row: number;
    col: number;

    constructor() {}

    evaluate(): string {
        throw new Error("Method not implemented.");
    }
    accept<T>(ev: ExpressionVisitor<T>): T {
        throw new Error("Method not implemented.");
    }
}

abstract class Func implements Expression {
    leftExp: Expression;
    rightExp: Expression;

    constructor() {}

    evaluate(): string {
        throw new Error("Method not implemented.");
    }
    accept<T>(ev: ExpressionVisitor<T>): T {
        throw new Error("Method not implemented.");
    }
}

class Add extends Func {}
class Subtract extends Func {}
class Divide extends Func {}
class Multiply extends Func {}

interface Action {
    redo(): void;
}

abstract class CellAction implements Action {
    prevValue: Expression;
    nextValue: Expression;

    abstract redo(): void;
}

class FillCellAction extends CellAction {
    redo(): void {
        throw new Error("Method not implemented.");
    }
}

class ChangeCellTextAction extends CellAction {
    redo(): void {
        throw new Error("Method not implemented.");
    }
}
