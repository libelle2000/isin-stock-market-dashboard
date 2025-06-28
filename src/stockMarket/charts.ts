import { Isin } from '../shared/domainObjects/isin';
import { Chart } from './charts/chart';

/**
 * Immutable collection of Chart objects
 * Implements Iterable to allow iterating over the charts
 */
export class Charts implements Iterable<Chart> {
  private readonly _charts: ReadonlyArray<Chart>;

  /**
   * Creates a new Charts instance
   * @param charts Array of Chart objects
   */
  constructor(charts: Chart[]) {
    this._charts = [...charts];
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
   * Returns an iterator for the charts
   */
  [Symbol.iterator](): Iterator<Chart> {
    return this._charts[Symbol.iterator]();
  }
}
