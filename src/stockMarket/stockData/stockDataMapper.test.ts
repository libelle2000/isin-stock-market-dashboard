import { Isin } from '../../shared/domainObjects/isin';
import { StockDataMapper } from './stockDataMapper';
import { StockDataResponse } from '../apiProvider/stockDataSchema';
import { Currency } from '../../shared/domainObjects/money';

describe('StockDataMapper', () => {
  const isin = new Isin('LU2090063327');
  
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
    
    const stockData = StockDataMapper.fromApiResponse(isin, response);
    
    expect(stockData.isin).toBe(isin);
    expect(stockData.dataPoints).toHaveLength(3);
    expect(stockData.dataPoints[0].unixTimestamp).toBe(1594245600000);
    expect(stockData.dataPoints[0].price.amount).toBe(30.275);
    expect(stockData.dataPoints[0].price.currency).toBe(Currency.EUR);
  });
  
  it('should throw an error when creating from an invalid API response', () => {
    const invalidResponse1 = {} as StockDataResponse;
    const invalidResponse2 = { instruments: [] } as StockDataResponse;
    const invalidResponse3 = { 
      instruments: [{ keys: ['x', 'y'], identifier: '', currentTimezoneOffset: '', timeRange: '' }]
    } as StockDataResponse;
    
    expect(() => StockDataMapper.fromApiResponse(isin, invalidResponse1)).toThrow('Invalid API response: no instruments found');
    expect(() => StockDataMapper.fromApiResponse(isin, invalidResponse2)).toThrow('Invalid API response: no instruments found');
    expect(() => StockDataMapper.fromApiResponse(isin, invalidResponse3)).toThrow('Invalid API response: no data found');
  });
  
  it('should handle empty data array', () => {
    const response: StockDataResponse = {
      instruments: [
        {
          keys: ['x', 'y'],
          data: [],
          identifier: '1,53842372,2779,814',
          currentTimezoneOffset: '7200',
          timeRange: 'Maximum'
        }
      ]
    };
    
    const stockData = StockDataMapper.fromApiResponse(isin, response);
    
    expect(stockData.isin).toBe(isin);
    expect(stockData.dataPoints).toHaveLength(0);
    expect(stockData.count).toBe(0);
  });
});