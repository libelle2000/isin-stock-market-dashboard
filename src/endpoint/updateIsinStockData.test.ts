import request from 'supertest';
import express from 'express';
import {Isin} from '../shared/domainObjects/isin';
import {StockMarketService} from '../stockMarket/stockMarketService';
import {updateIsinStockDataRouter} from './updateIsinStockData';

// Mock StockMarketService
jest.mock('../stockMarket/stockMarketService');

describe('Update ISIN Stock Data Endpoint', () => {
  let app: express.Express;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create Express app
    app = express();
    app.use(express.json());
    app.use('/api', updateIsinStockDataRouter);
  });
  
  it('should update stock data for a valid ISIN', async () => {
    // Mock StockMarketService.fetchStockDataByIsin
    const mockFetchStockDataByIsin = jest.fn().mockResolvedValue(undefined);
    (StockMarketService.prototype.fetchStockDataByIsin as jest.Mock) = mockFetchStockDataByIsin;
    
    // Make request
    const response = await request(app)
      .post('/api/update-stock-data')
      .send({ isin: 'LU2090063327' });
    
    // Check response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      isin: 'LU2090063327',
      message: 'Stock data updated successfully'
    });
    
    // Check that StockMarketService.fetchStockDataByIsin was called
    expect(mockFetchStockDataByIsin).toHaveBeenCalledTimes(1);
    expect(mockFetchStockDataByIsin.mock.calls[0][0]).toBeInstanceOf(Isin);
    expect(mockFetchStockDataByIsin.mock.calls[0][0].value).toBe('LU2090063327');
  });
  
  it('should return 400 for missing ISIN', async () => {
    // Make request
    const response = await request(app)
      .post('/api/update-stock-data')
      .send({});
    
    // Check response
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'ISIN is required'
    });
  });
  
  it('should return 400 for invalid ISIN format', async () => {
    // Make request
    const response = await request(app)
      .post('/api/update-stock-data')
      .send({ isin: 'INVALID' });
    
    // Check response
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid ISIN format: INVALID'
    });
  });
  
  it('should return 500 when StockMarketService throws an error', async () => {
    // Mock StockMarketService.fetchStockDataByIsin to throw an error
    (StockMarketService.prototype.fetchStockDataByIsin as jest.Mock) = jest.fn().mockRejectedValue(new Error('API error'));
    
    // Make request
    const response = await request(app)
      .post('/api/update-stock-data')
      .send({ isin: 'LU2090063327' });
    
    // Check response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'API error'
    });
  });
});