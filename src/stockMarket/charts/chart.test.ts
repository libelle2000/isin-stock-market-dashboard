import { Isin } from '../../shared/domainObjects/isin';
import { IsinEvents } from '../buySellEvents/isin/isinEvents';
import { StockData } from '../stockData/stockData';
import { DataPoint } from '../stockData/dataPoint';
import { Chart } from './chart';
import {Currency, Money} from "../../shared/domainObjects/money";

describe('Chart', () => {
  const isin = new Isin('LU2090063327');
  let stockData: StockData;
  let isinEvents: IsinEvents;

  beforeEach(() => {
    // Create real DataPoint objects
    const dataPoints = [
      new DataPoint(new Date(1594245600000), new Money(25.75, Currency.EUR)),
      new DataPoint(new Date(1594332000000), new Money(29.875, Currency.EUR)),
      new DataPoint(new Date(1594591200000), new Money(30.24, Currency.EUR))
    ];

    // Create a real StockData object
    stockData = new StockData(isin, dataPoints);

    // Mock IsinEvents
    isinEvents = {
      isin
    } as unknown as IsinEvents;
  });

  it('should create a Chart instance', () => {
    const chart = new Chart(stockData, isinEvents);

    expect(chart.isin).toBe(isin);
    expect(chart.stockData).toBe(stockData);
    expect(chart.isinEvents).toBe(isinEvents);
  });

  it('should throw an error when ISINs do not match', () => {
    const differentIsin = new Isin('GB0009895292');
    const differentStockData = new StockData(differentIsin, [
      new DataPoint(new Date(1594245600000), new Money(25.75, Currency.EUR)),
    ]);

    expect(() => new Chart(differentStockData, isinEvents)).toThrow(
      `ISIN mismatch: GB0009895292 != LU2090063327`
    );
  });

  it('should return the latest price', () => {
    const chart = new Chart(stockData, isinEvents);

    expect(chart.latestPrice).toBe(30.24);
  });

  it('should return the earliest price', () => {
    const chart = new Chart(stockData, isinEvents);

    expect(chart.earliestPrice).toBe(25.75);
  });

  it('should throw when getting latest price with no data points', () => {
    // Create a StockData with no data points
    const emptyStockData = new StockData(isin, []);
    const chart = new Chart(emptyStockData, isinEvents);

    expect(() => chart.latestPrice).toThrow('No data points available');
  });

  it('should throw when getting earliest price with no data points', () => {
    // Create a StockData with no data points
    const emptyStockData = new StockData(isin, []);
    const chart = new Chart(emptyStockData, isinEvents);

    expect(() => chart.earliestPrice).toThrow('No data points available');
  });
});
