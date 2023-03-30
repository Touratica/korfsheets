import { Worksheet } from "exceljs";

export default interface ImportStrategy {
  /**
   * @abstract
   * @param {Worksheet} worksheet The worksheet to import
   */
  import: (worksheet: Worksheet) => Promise<void>;
}
