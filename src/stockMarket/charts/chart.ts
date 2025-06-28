import { Isin } from '../../shared/domainObjects/isin';
import { IsinEvents } from '../buySellEvents/isin/isinEvents';
import { StockData } from '../stockData/stockData';

/**
 * Immutable class representing a chart for a single ISIN
 * Contains stock data and buy/sell events for the ISIN
 */
export class Chart {
  private readonly _isin: Isin;
  private readonly _stockData: StockData;
  private readonly _isinEvents: IsinEvents;

  /**
   * Creates a new Chart instance
   * @param stockData The stock data for the ISIN
   * @param isinEvents The buy/sell events for the ISIN
   * @throws Error if the ISINs don't match
   */
  constructor(stockData: StockData, isinEvents: IsinEvents) {
    // Ensure the ISINs match
    if (!stockData.isin.equals(isinEvents.isin)) {
      throw new Error(`ISIN mismatch: ${stockData.isin.value} != ${isinEvents.isin.value}`);
    }

    this._isin = stockData.isin;
    this._stockData = stockData;
    this._isinEvents = isinEvents;
  }

  /**
   * Returns the ISIN
   */
  get isin(): Isin {
    return this._isin;
  }

  /**
   * Returns the stock data
   */
  get stockData(): StockData {
    return this._stockData;
  }

  /**
   * Returns the buy/sell events
   */
  get isinEvents(): IsinEvents {
    return this._isinEvents;
  }

  /**
   * Returns the latest stock price
   * @throws Error if there are no data points
   */
  get latestPrice(): number {
    return this._stockData.latestDataPoint.price.amount;
  }

  /**
   * Returns the earliest stock price
   * @throws Error if there are no data points
   */
  get earliestPrice(): number {
    return this._stockData.earliestDataPoint.price.amount;
  }

  /**
   * Returns the price change in percentage
   * @throws Error if there are no data points
   * @todo this is not needed -> the bar should show MARKET_VALUE instead
   */
  get priceChangePercentage(): number {
    const earliest = this.earliestPrice;
    const latest = this.latestPrice;

    return ((latest - earliest) / earliest) * 100;
  }
}
