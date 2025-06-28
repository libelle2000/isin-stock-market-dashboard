import { Money } from '../../shared/domainObjects/money';

/**
 * Immutable value object representing a single data point in stock data
 * Contains a timestamp and a stock price
 */
export class DataPoint {
  private readonly _timestamp: Date;
  private readonly _price: Money;

  /**
   * Creates a new DataPoint instance
   * @param timestamp The timestamp as a Date object or Unix timestamp (milliseconds)
   * @param price The stock price as a Money object or number (EUR)
   * @throws Error if the timestamp or price is invalid
   */
  constructor(timestamp: Date | number, price: Money | number) {
    // Handle timestamp
    if (timestamp instanceof Date) {
      this._timestamp = new Date(timestamp.getTime());
    } else if (typeof timestamp === 'number') {
      if (isNaN(timestamp) || timestamp <= 0) {
        throw new Error(`Invalid timestamp: ${timestamp}`);
      }
      this._timestamp = new Date(timestamp);
    } else {
      throw new Error(`Invalid timestamp type: ${typeof timestamp}`);
    }

    // Handle price
    if (price instanceof Money) {
      this._price = price;
    } else if (typeof price === 'number') {
      this._price = new Money(price, 'EUR');
    } else {
      throw new Error(`Invalid price type: ${typeof price}`);
    }
  }

  /**
   * Creates a DataPoint from an array [timestamp, price]
   * @param data Array containing [timestamp, price]
   * @returns A new DataPoint instance
   * @throws Error if the array format is invalid
   */
  static fromArray(data: [number, number]): DataPoint {
    if (!Array.isArray(data) || data.length !== 2) {
      throw new Error('Data must be an array with exactly two elements');
    }

    const [timestamp, price] = data;
    return new DataPoint(timestamp, price);
  }

  /**
   * Returns the timestamp as a Date object
   */
  get timestamp(): Date {
    return new Date(this._timestamp.getTime());
  }

  /**
   * Returns the Unix timestamp in milliseconds
   */
  get unixTimestamp(): number {
    return this._timestamp.getTime();
  }

  /**
   * Returns the stock price as a Money object
   */
  get price(): Money {
    return this._price;
  }

  /**
   * Returns the DataPoint as an array [timestamp, price]
   * @returns Array containing [timestamp, price]
   */
  toArray(): [number, number] {
    return [this.unixTimestamp, this._price.amount];
  }
}
