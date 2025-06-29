import { Isin } from '../../shared/domainObjects/isin';
import { DataPoint } from './dataPoint';
import { JsonSerializable } from '../../shared/interfaces/jsonSerializable';

/**
 * Immutable value object representing stock data for a single ISIN
 * Contains an ISIN and a collection of DataPoint objects
 */
export class StockData implements JsonSerializable {
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
   * Converts the StockData to a JSON-serializable representation
   * @returns A plain object with the ISIN and data points
   */
  toJSON(): Record<string, any> {
    return {
      isin: this._isin.toJSON(),
      dataPoints: this._dataPoints.map(dp => dp.toJSON()),
      count: this._dataPoints.length
    };
  }
}
