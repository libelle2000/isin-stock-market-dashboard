import {Isin} from '../../shared/domainObjects/isin';
import {DataPoint} from './dataPoint';
import {StockData} from './stockData';
import {StockDataResponse} from '../apiProvider/stockDataSchema';
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
  
  it('should create a StockData instance from an API response', () => {
    const response: StockDataResponse = {
      instruments: [
        {
          keys: ['x', 'y'],
          data: [
            [1594245600000, 30.275],
            [1594332000000, 29.875],
            [1594591200000, 30.24]
          ],
          identifier: '1,53842372,2779,814',
          currentTimezoneOffset: '7200',
          timeRange: 'Maximum'
        }
      ]
    };
    
    const stockData = StockData.fromApiResponse(isin, response);
    
    expect(stockData.isin).toBe(isin);
    expect(stockData.dataPoints).toHaveLength(3);
    expect(stockData.dataPoints[0].unixTimestamp).toBe(1594245600000);
    expect(stockData.dataPoints[0].price.amount).toBe(30.275);
  });
  
  it('should throw an error when creating from an invalid API response', () => {
    const invalidResponse1 = {} as StockDataResponse;
    const invalidResponse2 = { instruments: [] } as StockDataResponse;
    const invalidResponse3 = { 
      instruments: [{ keys: ['x', 'y'], identifier: '', currentTimezoneOffset: '', timeRange: '' }]
    } as StockDataResponse;
    
    expect(() => StockData.fromApiResponse(isin, invalidResponse1)).toThrow('Invalid API response: no instruments found');
    expect(() => StockData.fromApiResponse(isin, invalidResponse2)).toThrow('Invalid API response: no instruments found');
    expect(() => StockData.fromApiResponse(isin, invalidResponse3)).toThrow('Invalid API response: no data found');
  });
  
  it('should correctly compare two StockData instances', () => {
    const stockData1 = new StockData(isin, dataPoints);
    const stockData2 = new StockData(isin, dataPoints);
    const stockData3 = new StockData(isin, [dataPoints[0], dataPoints[1]]);
    const stockData4 = new StockData(new Isin('GB0009895292'), dataPoints);
    
    expect(stockData1.equals(stockData2)).toBe(true);
    expect(stockData1.equals(stockData3)).toBe(false);
    expect(stockData1.equals(stockData4)).toBe(false);
  });
});