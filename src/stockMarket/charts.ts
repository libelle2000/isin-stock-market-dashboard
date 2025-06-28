import { Isin } from '../shared/domainObjects/isin';
import { Chart } from './charts/chart';

/**
 * Immutable collection of Chart objects
 * Implements Iterable to allow iterating over the charts
 */
export class Charts implements Iterable<Chart> {
  private readonly _charts: ReadonlyArray<Chart>;
  //@todo: this map should not be needed
  private readonly _chartsByIsin: ReadonlyMap<string, Chart>;

  /**
   * Creates a new Charts instance
   * @param charts Array of Chart objects
   */
  constructor(charts: Chart[]) {
    this._charts = [...charts];

    // Create a map of charts by ISIN for quick lookup
    const chartsByIsin = new Map<string, Chart>();
    for (const chart of charts) {
      chartsByIsin.set(chart.isin.value, chart);
    }
    this._chartsByIsin = chartsByIsin;
  }

  /**
   * Returns the number of charts
   */
  get count(): number {
    return this._charts.length;
  }

  /**
   * Returns all charts
   */
  get all(): ReadonlyArray<Chart> {
    return this._charts;
  }

  /**
   * Returns all ISINs
   */
  get isins(): ReadonlyArray<Isin> {
    return this._charts.map(chart => chart.isin);
  }

  /**
   * Gets a chart by ISIN
   * @param isin The ISIN
   * @returns The chart, or undefined if not found
   */
  getByIsin(isin: Isin | string): Chart | undefined {
    const isinValue = isin instanceof Isin ? isin.value : isin;
    return this._chartsByIsin.get(isinValue);
  }

  /**
   * Checks if a chart exists for the given ISIN
   * @param isin The ISIN
   * @returns true if a chart exists, false otherwise
   */
  hasIsin(isin: Isin | string): boolean {
    const isinValue = isin instanceof Isin ? isin.value : isin;
    return this._chartsByIsin.has(isinValue);
  }

  /**
   * Returns an iterator for the charts
   */
  [Symbol.iterator](): Iterator<Chart> {
    return this._charts[Symbol.iterator]();
  }
}
