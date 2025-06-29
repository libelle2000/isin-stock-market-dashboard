import {Currency, Money} from '../../shared/domainObjects/money';
import { JsonSerializable } from '../../shared/interfaces/jsonSerializable';

/**
 * Immutable value object representing a single data point in stock data
 * Contains a timestamp and a stock price
 */
export class DataPoint implements JsonSerializable {
  private readonly _timestamp: Date;
  private readonly _price: Money;

  /**
   * Creates a new DataPoint instance
   * @param timestamp The timestamp as a Date object
   * @param price The stock price as a Money object
   */
  constructor(timestamp: Date, price: Money) {
    this._timestamp = new Date(timestamp.getTime());
    this._price = price;
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
    const date = new Date(timestamp);
    const money = new Money(price, Currency.EUR);
    return new DataPoint(date, money);
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
   * Converts the DataPoint to a JSON-serializable representation
   * @returns A plain object with the timestamp and price
   */
  toJSON(): Record<string, any> {
    return {
      timestamp: this._timestamp.toISOString(),
      unixTimestamp: this._timestamp.getTime(),
      price: this._price.toJSON()
    };
  }
}
