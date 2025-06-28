import { Isin } from '../../../../shared/domainObjects/isin';
import { Money } from '../../../../shared/domainObjects/money';

/**
 * Type of event (buy or sell)
 */
export enum EventType {
  BUY = 'buy',
  SELL = 'sell'
}

/**
 * Interface for raw event data from CSV
 */
export interface EventData {
  TYPE: string;
  ISIN: string;
  STOCK_NAME: string;
  NOMINALE_COUNT: string;
  STOCK_PRICE: string;
  TRADING_DATE: string;
  TRADING_TIME: string;
  MARKET_VALUE: string;
  FACTOR_USD_TO_EUR: string;
  STOCK_PRICE_EUR: string;
  TOTAL_COSTS: string;
  TOTAL_INCLUDING_COSTS: string;
  [key: string]: string; // For any other columns
}

/**
 * Abstract immutable parent class for buy and sell events
 */
export abstract class Event {
  private readonly _type: EventType;
  private readonly _isin: Isin;
  private readonly _stockName: string;
  private readonly _nominaleCount: number;
  private readonly _stockPrice: Money;
  private readonly _tradingDateTime: Date;
  private readonly _totalIncludingCosts: Money;

  /**
   * Creates a new Event instance
   * @param data The raw event data from CSV
   * @throws Error if the data is invalid
   */
  constructor(data: EventData) {
    // Validate and set type
    if (data.TYPE !== EventType.BUY && data.TYPE !== EventType.SELL) {
      throw new Error(`Invalid event type: ${data.TYPE}`);
    }
    this._type = data.TYPE as EventType;

    // Validate and set ISIN
    try {
      this._isin = new Isin(data.ISIN);
    } catch (error) {
      throw new Error(`Invalid ISIN: ${data.ISIN}`);
    }

    // Set stock name
    this._stockName = data.STOCK_NAME;

    // Validate and set nominale count
    const nominaleCount = parseInt(data.NOMINALE_COUNT, 10);
    if (isNaN(nominaleCount) || nominaleCount <= 0) {
      throw new Error(`Invalid nominale count: ${data.NOMINALE_COUNT}`);
    }
    this._nominaleCount = nominaleCount;

    // Validate and set stock price
    try {
      this._stockPrice = Money.fromString(data.STOCK_PRICE);
    } catch (error) {
      throw new Error(`Invalid stock price: ${data.STOCK_PRICE}`);
    }

    // Validate and set trading date and time
    try {
      const [year, month, day] = data.TRADING_DATE.split('-').map(Number);
      const [hour, minute, second] = data.TRADING_TIME.split(':').map(Number);

      // Month is 0-indexed in JavaScript Date
      this._tradingDateTime = new Date(year, month - 1, day, hour, minute, second);

      if (isNaN(this._tradingDateTime.getTime())) {
        throw new Error('Invalid date/time');
      }
    } catch (error) {
      throw new Error(`Invalid trading date/time: ${data.TRADING_DATE} ${data.TRADING_TIME}`);
    }

    // Validate and set total including costs
    try {
      this._totalIncludingCosts = Money.fromString(data.TOTAL_INCLUDING_COSTS);
    } catch (error) {
      throw new Error(`Invalid total including costs: ${data.TOTAL_INCLUDING_COSTS}`);
    }
  }

  /**
   * Returns the event type
   */
  get type(): EventType {
    return this._type;
  }

  /**
   * Returns the ISIN
   */
  get isin(): Isin {
    return this._isin;
  }

  /**
   * Returns the stock name
   */
  get stockName(): string {
    return this._stockName;
  }

  /**
   * Returns the nominale count (number of shares)
   */
  get nominaleCount(): number {
    return this._nominaleCount;
  }

  /**
   * Returns the stock price
   */
  get stockPrice(): Money {
    return this._stockPrice;
  }

  /**
   * Returns the trading date and time
   */
  get tradingDateTime(): Date {
    return new Date(this._tradingDateTime.getTime());
  }

  /**
   * Returns the total including costs
   */
  get totalIncludingCosts(): Money {
    return this._totalIncludingCosts;
  }

  /**
   * Checks if this Event equals another Event
   * @param other The other Event to compare with
   * @returns true if the Events are equal, false otherwise
   */
  equals(other: Event): boolean {
    if (!(other instanceof Event)) {
      return false;
    }

    return this._type === other.type &&
           this._isin.equals(other.isin) &&
           this._stockName === other.stockName &&
           this._nominaleCount === other.nominaleCount &&
           this._stockPrice.equals(other.stockPrice) &&
           this._tradingDateTime.getTime() === other.tradingDateTime.getTime() &&
           this._totalIncludingCosts.equals(other.totalIncludingCosts);
  }
}
