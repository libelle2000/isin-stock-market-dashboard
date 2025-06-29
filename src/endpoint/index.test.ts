import request from 'supertest';
import { StockMarketService } from '../stockMarket/stockMarketService';
import { Charts } from '../stockMarket/charts';
import { Chart } from '../stockMarket/charts/chart';
import { Isin } from '../shared/domainObjects/isin';
import { StockData } from '../stockMarket/stockData/stockData';
import { IsinEvents } from '../stockMarket/buySellEvents/isin/isinEvents';
import app from './index';

// Mock StockMarketService
jest.mock('../stockMarket/stockMarketService');

describe('Main HTML Page Endpoint', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });
  
  it('should render HTML page with charts', async () => {
    // Create mock data
    const isin1 = new Isin('LU2090063327');
    const isin2 = new Isin('GB0009895292');
    
    const mockStockData1 = { isin: isin1 } as StockData;
    const mockStockData2 = { isin: isin2 } as StockData;
    
    const mockIsinEvents1 = { isin: isin1 } as IsinEvents;
    const mockIsinEvents2 = { isin: isin2 } as IsinEvents;
    
    const mockChart1 = new Chart(mockStockData1, mockIsinEvents1);
    const mockChart2 = new Chart(mockStockData2, mockIsinEvents2);
    
    const mockCharts = new Charts([mockChart1, mockChart2]);
    
    // Mock StockMarketService.getAllCharts
    const mockGetAllCharts = jest.fn().mockResolvedValue(mockCharts);
    (StockMarketService.prototype.getAllCharts as jest.Mock) = mockGetAllCharts;
    
    // Make request
    const response = await request(app).get('/');
    
    // Check response
    expect(response.status).toBe(200);
    expect(response.text).toContain('<!DOCTYPE html>');
    expect(response.text).toContain('ISIN Stock Market Dashboard');
    expect(response.text).toContain('LU2090063327');
    expect(response.text).toContain('GB0009895292');
    expect(response.text).toContain('chart-container-LU2090063327');
    expect(response.text).toContain('chart-container-GB0009895292');
    expect(response.text).toContain('update-button');
    
    // Check that StockMarketService.getAllCharts was called
    expect(mockGetAllCharts).toHaveBeenCalledTimes(1);
  });
  
  it('should handle error when StockMarketService.getAllCharts throws', async () => {
    // Mock StockMarketService.getAllCharts to throw an error
    const mockGetAllCharts = jest.fn().mockRejectedValue(new Error('Failed to get charts'));
    (StockMarketService.prototype.getAllCharts as jest.Mock) = mockGetAllCharts;
    
    // Make request
    const response = await request(app).get('/');
    
    // Check response
    expect(response.status).toBe(500);
    expect(response.text).toContain('Error');
    expect(response.text).toContain('Failed to load charts: Failed to get charts');
    
    // Check that StockMarketService.getAllCharts was called
    expect(mockGetAllCharts).toHaveBeenCalledTimes(1);
  });
});