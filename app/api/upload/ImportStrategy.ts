import { Worksheet } from "exceljs";

export default interface ImportStrategy {
  /**
   *
   * @param worksheet The worksheet to import
   * @returns
   */
  import: (worksheet: Worksheet) => Promise<void>;
}
