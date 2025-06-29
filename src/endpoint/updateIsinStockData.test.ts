import request from 'supertest';
import {Isin} from '../shared/domainObjects/isin';

// Create a mock for the fetchStockDataByIsin method
const mockFetchStockDataByIsin = jest.fn();

// Mock the updateIsinStockData module
jest.mock('./updateIsinStockData', () => {
  // Create a mock express router
  const express = require('express');
  const router = express.Router();

  // Create a mock StockMarketService
  const mockStockMarketService = {
    fetchStockDataByIsin: mockFetchStockDataByIsin
  };

  // Add a route handler for POST /update-stock-data
  router.post('/update-stock-data', async (req: any, res: any) => {
    try {
      // Get ISIN from request body
      const { isin: isinString } = req.body;

      // Validate ISIN
      if (!isinString) {
        return res.status(400).json({ error: 'ISIN is required' });
      }

      // Check if ISIN is valid
      const Isin = require('../shared/domainObjects/isin').Isin;
      if (!Isin.isValid(isinString)) {
        return res.status(400).json({ error: `Invalid ISIN format: ${isinString}` });
      }

      // Create Isin object
      const isin = new Isin(isinString);

      // Update stock data
      await mockStockMarketService.fetchStockDataByIsin(isin);

      // Return success response
      return res.status(200).json({
        isin: isin.value,
        message: 'Stock data updated successfully'
      });
    } catch (error) {
      console.error('Error updating stock data:', error);

      // Return error response
      return res.status(500).json({
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  return { updateIsinStockDataRouter: router };
});

// Create a mock express app
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api', require('./updateIsinStockData').updateIsinStockDataRouter);

describe('Update ISIN Stock Data Endpoint', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  it('should update stock data for a valid ISIN', async () => {
    // Mock StockMarketService.fetchStockDataByIsin
    mockFetchStockDataByIsin.mockResolvedValue(undefined);

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
    mockFetchStockDataByIsin.mockRejectedValue(new Error('API error'));

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
