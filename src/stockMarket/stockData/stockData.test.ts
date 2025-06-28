import {Isin} from '../../shared/domainObjects/isin';
import {DataPoint} from './dataPoint';
import {StockData} from './stockData';
import {Currency, Money} from "../../shared/domainObjects/money";

describe('StockData', () => {
  const isin = new Isin('LU2090063327');
  const dataPoints = [
    new DataPoint(new Date(1594245600000), new Money(30.275, Currency.EUR)),
    new DataPoint(new Date(1594332000000), new Money(29.875, Currency.EUR)),
    new DataPoint(new Date(1594591200000), new Money(30.24, Currency.EUR))
  ];

  it('should create a StockData instance', () => {
    const stockData = new StockData(isin, dataPoints);

    expect(stockData.isin).toBe(isin);
    expect(stockData.dataPoints).toHaveLength(3);
    expect(stockData.count).toBe(3);
  });

  it('should sort data points by timestamp', () => {
    // Create data points in random order
    const unsortedDataPoints = [
      new DataPoint(new Date(1594591200000), new Money(30.24, Currency.EUR)),
      new DataPoint(new Date(1594245600000), new Money(30.275, Currency.EUR)),
      new DataPoint(new Date(1594332000000), new Money(29.875, Currency.EUR))
    ];

    const stockData = new StockData(isin, unsortedDataPoints);

    // Check that data points are sorted by timestamp
    expect(stockData.dataPoints[0].unixTimestamp).toBe(1594245600000);
    expect(stockData.dataPoints[1].unixTimestamp).toBe(1594332000000);
    expect(stockData.dataPoints[2].unixTimestamp).toBe(1594591200000);
  });

  it('should return the latest data point', () => {
    const stockData = new StockData(isin, dataPoints);

    const latestDataPoint = stockData.latestDataPoint;
    expect(latestDataPoint.unixTimestamp).toBe(1594591200000);
    expect(latestDataPoint.price.amount).toBe(30.24);
  });

  it('should return the earliest data point', () => {
    const stockData = new StockData(isin, dataPoints);

    const earliestDataPoint = stockData.earliestDataPoint;
    expect(earliestDataPoint.unixTimestamp).toBe(1594245600000);
    expect(earliestDataPoint.price.amount).toBe(30.275);
  });

  it('should throw an error when getting latest data point with no data points', () => {
    const stockData = new StockData(isin, []);

    expect(() => stockData.latestDataPoint).toThrow('No data points available');
  });

  it('should throw an error when getting earliest data point with no data points', () => {
    const stockData = new StockData(isin, []);

    expect(() => stockData.earliestDataPoint).toThrow('No data points available');
  });

});
