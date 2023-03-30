import { Worksheet } from "exceljs";
import ImportStrategy from "./ImportStrategy";

export default class ImportContext {
  private strategy: ImportStrategy;

  constructor(strategy: ImportStrategy) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: ImportStrategy) {
    this.strategy = strategy;
  }

  public async import(worksheet: Worksheet): Promise<void> {
    await this.strategy.import(worksheet);
  }
}
