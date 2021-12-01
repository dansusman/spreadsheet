export class EquationStore {
  private instance: EquationStore = new EquationStore();
  private store: Map<string, string> = new Map();
  private constructor() {}
  get getInstance(): EquationStore {
    return this.instance;
  }
  public add(equation: string, result: string): void {
    this.store.set(equation, result);
  }
  public remove(equation: string): void {
    if (this.store.has(equation)) {
      this.store.delete(equation);
    }
  }
  public getResult(equation: string): void {
    if (this.store.has(equation)) {
      this.store.get(equation);
    }
  }
}
