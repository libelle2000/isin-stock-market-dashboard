import { Isin } from '../../shared/domainObjects/isin';
import { DataPoint } from './dataPoint';
import { StockDataResponse } from '../apiProvider/stockDataSchema';

/**
 * Immutable value object representing stock data for a single ISIN
 * Contains an ISIN and a collection of DataPoint objects
 */
export class StockData {
  private readonly _isin: Isin;
  private readonly _dataPoints: ReadonlyArray<DataPoint>;

  /**
   * Creates a new StockData instance
   * @param isin The ISIN
   * @param dataPoints Array of DataPoint objects
   */
  constructor(isin: Isin, dataPoints: DataPoint[]) {
    this._isin = isin;
    // Sort data points by timestamp (oldest first)
    this._dataPoints = [...dataPoints].sort((a, b) => a.unixTimestamp - b.unixTimestamp);
  }

  /**
   * Creates a StockData instance from a raw API response
   * @param isin The ISIN
   * @param response The raw API response
   * @returns A new StockData instance
   * @throws Error if the response format is invalid
   * @todo: move this logic into caller class
   */
  static fromApiResponse(isin: Isin, response: StockDataResponse): StockData {
    if (!response.instruments || response.instruments.length === 0) {
      throw new Error('Invalid API response: no instruments found');
    }

    const instrument = response.instruments[0];
    if (!instrument.data || !Array.isArray(instrument.data)) {
      throw new Error('Invalid API response: no data found');
    }

    const dataPoints = instrument.data.map(dataPoint => DataPoint.fromArray(dataPoint));
    return new StockData(isin, dataPoints);
  }

  /**
   * Returns the ISIN
   */
  get isin(): Isin {
    return this._isin;
  }

  /**
   * Returns the data points
   */
  get dataPoints(): ReadonlyArray<DataPoint> {
    return this._dataPoints;
  }

  /**
   * Returns the latest data point
   * @throws Error if there are no data points
   */
  get latestDataPoint(): DataPoint {
    if (this._dataPoints.length === 0) {
      throw new Error('No data points available');
    }
    return this._dataPoints[this._dataPoints.length - 1];
  }

  /**
   * Returns the earliest data point
   * @throws Error if there are no data points
   */
  get earliestDataPoint(): DataPoint {
    if (this._dataPoints.length === 0) {
      throw new Error('No data points available');
    }
    return this._dataPoints[0];
  }

  /**
   * Returns the number of data points
   */
  get count(): number {
    return this._dataPoints.length;
  }

  /**
   * Checks if this StockData equals another StockData
   * @param other The other StockData to compare with
   * @returns true if the StockData objects are equal, false otherwise
   * @todo is this needed?
   */
  equals(other: StockData): boolean {
    if (!(other instanceof StockData)) {
      return false;
    }

    if (!this._isin.equals(other._isin)) {
      return false;
    }

    if (this._dataPoints.length !== other._dataPoints.length) {
      return false;
    }

    for (let i = 0; i < this._dataPoints.length; i++) {
      const thisPoint = this._dataPoints[i];
      const otherPoint = other._dataPoints[i];

      if (thisPoint.unixTimestamp !== otherPoint.unixTimestamp || 
          thisPoint.price.amount !== otherPoint.price.amount) {
        return false;
      }
    }

    return true;
  }
}
