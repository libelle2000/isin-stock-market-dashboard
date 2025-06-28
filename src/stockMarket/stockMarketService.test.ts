import { Isin } from '../shared/domainObjects/isin';
import { ApiProvider } from './apiProvider/apiProvider';
import { StockDataSchema, StockDataResponse } from './apiProvider/stockDataSchema';
import { BuySellEventRepository } from './buySellEvents/buySellEventRepository';
import { Events } from './buySellEvents/events';
import { IsinEvents } from './buySellEvents/isin/isinEvents';
import { Charts } from './charts';
import { StockData } from './stockData/stockData';
import { StockDataRepository } from './stockData/stockDataRepository';
import { StockMarketService } from './stockMarketService';

// Mock dependencies
jest.mock('./apiProvider/stockDataSchema');
jest.mock('./buySellEvents/buySellEventRepository');
jest.mock('./stockData/stockDataRepository');

describe('StockMarketService', () => {
  // Mock API provider
  const mockApiProvider: ApiProvider = {
    fetchStockData: jest.fn()
  };
  
  // Sample data
  const isin1 = new Isin('LU2090063327');
  const isin2 = new Isin('GB0009895292');
  
  const mockResponse: StockDataResponse = {
    instruments: [
      {
        keys: ['x', 'y'],
        data: [
          [1594245600000, 30.275],
          [1594332000000, 29.875]
        ],
        identifier: '1,53842372,2779,814',
        currentTimezoneOffset: '7200',
        timeRange: 'Maximum'
      }
    ]
  };
  
  let service: StockMarketService;
  
  beforeEach(() => {
    // Create service with mock API provider
    service = new StockMarketService(mockApiProvider);
    
    // Reset mocks
    jest.clearAllMocks();
  });
  
  describe('getAllCharts', () => {
    it('should get all charts for all ISINs', async () => {
      // Mock BuySellEventRepository.getAllEvents
      const mockIsinEvents1 = { isin: isin1 } as unknown as IsinEvents;
      const mockIsinEvents2 = { isin: isin2 } as unknown as IsinEvents;
      const mockEvents = {
        isins: [isin1, isin2],
        getByIsin: jest.fn((isin) => {
          if (isin === isin1 || isin.value === isin1.value) return mockIsinEvents1;
          if (isin === isin2 || isin.value === isin2.value) return mockIsinEvents2;
          return undefined;
        })
      } as unknown as Events;
      
      (BuySellEventRepository.getAllEvents as jest.Mock).mockResolvedValue(mockEvents);
      
      // Mock StockDataRepository.getStockDataByIsin
      const mockStockData1 = { isin: isin1 } as unknown as StockData;
      const mockStockData2 = { isin: isin2 } as unknown as StockData;
      
      (StockDataRepository.getStockDataByIsin as jest.Mock)
        .mockImplementation((isin) => {
          if (isin.value === isin1.value) return Promise.resolve(mockStockData1);
          if (isin.value === isin2.value) return Promise.resolve(mockStockData2);
          return Promise.resolve(null);
        });
      
      // Call the method
      const result = await service.getAllCharts();
      
      // Check that BuySellEventRepository.getAllEvents was called
      expect(BuySellEventRepository.getAllEvents).toHaveBeenCalled();
      
      // Check that StockDataRepository.getStockDataByIsin was called for each ISIN
      expect(StockDataRepository.getStockDataByIsin).toHaveBeenCalledWith(isin1);
      expect(StockDataRepository.getStockDataByIsin).toHaveBeenCalledWith(isin2);
      
      // Check the result
      expect(result).toBeInstanceOf(Charts);
      expect(result.count).toBe(2);
      expect(result.hasIsin(isin1)).toBe(true);
      expect(result.hasIsin(isin2)).toBe(true);
    });
    
    it('should fetch stock data when not available in cache', async () => {
      // Mock BuySellEventRepository.getAllEvents
      const mockIsinEvents1 = { isin: isin1 } as unknown as IsinEvents;
      const mockEvents = {
        isins: [isin1],
        getByIsin: jest.fn((isin) => {
          if (isin === isin1 || isin.value === isin1.value) return mockIsinEvents1;
          return undefined;
        })
      } as unknown as Events;
      
      (BuySellEventRepository.getAllEvents as jest.Mock).mockResolvedValue(mockEvents);
      
      // Mock StockDataRepository.getStockDataByIsin to return null first, then data after fetching
      const mockStockData1 = { isin: isin1 } as unknown as StockData;
      let fetchCalled = false;
      
      (StockDataRepository.getStockDataByIsin as jest.Mock)
        .mockImplementation(() => {
          if (fetchCalled) return Promise.resolve(mockStockData1);
          return Promise.resolve(null);
        });
      
      // Mock apiProvider.fetchStockData
      (mockApiProvider.fetchStockData as jest.Mock).mockImplementation(() => {
        fetchCalled = true;
        return Promise.resolve(mockResponse);
      });
      
      // Call the method
      const result = await service.getAllCharts();
      
      // Check that BuySellEventRepository.getAllEvents was called
      expect(BuySellEventRepository.getAllEvents).toHaveBeenCalled();
      
      // Check that StockDataRepository.getStockDataByIsin was called twice for the ISIN
      expect(StockDataRepository.getStockDataByIsin).toHaveBeenCalledTimes(2);
      
      // Check that apiProvider.fetchStockData was called
      expect(mockApiProvider.fetchStockData).toHaveBeenCalledWith(isin1.value);
      
      // Check that StockDataSchema.validate was called
      expect(StockDataSchema.validate).toHaveBeenCalledWith(mockResponse);
      
      // Check that StockDataRepository.updateStockDataByIsin was called
      expect(StockDataRepository.updateStockDataByIsin).toHaveBeenCalledWith(isin1, mockResponse);
      
      // Check the result
      expect(result).toBeInstanceOf(Charts);
      expect(result.count).toBe(1);
      expect(result.hasIsin(isin1)).toBe(true);
    });
    
    it('should handle errors when fetching stock data', async () => {
      // Mock console.error
      const originalConsoleError = console.error;
      console.error = jest.fn();
      
      // Mock BuySellEventRepository.getAllEvents
      const mockIsinEvents1 = { isin: isin1 } as unknown as IsinEvents;
      const mockEvents = {
        isins: [isin1],
        getByIsin: jest.fn((isin) => {
          if (isin === isin1 || isin.value === isin1.value) return mockIsinEvents1;
          return undefined;
        })
      } as unknown as Events;
      
      (BuySellEventRepository.getAllEvents as jest.Mock).mockResolvedValue(mockEvents);
      
      // Mock StockDataRepository.getStockDataByIsin to return null
      (StockDataRepository.getStockDataByIsin as jest.Mock).mockResolvedValue(null);
      
      // Mock apiProvider.fetchStockData to throw an error
      (mockApiProvider.fetchStockData as jest.Mock).mockRejectedValue(new Error('API error'));
      
      // Call the method
      const result = await service.getAllCharts();
      
      // Check that console.error was called
      expect(console.error).toHaveBeenCalled();
      
      // Check the result (should be empty)
      expect(result).toBeInstanceOf(Charts);
      expect(result.count).toBe(0);
      
      // Restore console.error
      console.error = originalConsoleError;
    });
  });
  
  describe('fetchStockDataByIsin', () => {
    it('should fetch stock data for a given ISIN', async () => {
      // Mock apiProvider.fetchStockData
      (mockApiProvider.fetchStockData as jest.Mock).mockResolvedValue(mockResponse);
      
      // Call the method
      await service.fetchStockDataByIsin(isin1);
      
      // Check that apiProvider.fetchStockData was called
      expect(mockApiProvider.fetchStockData).toHaveBeenCalledWith(isin1.value);
      
      // Check that StockDataSchema.validate was called
      expect(StockDataSchema.validate).toHaveBeenCalledWith(mockResponse);
      
      // Check that StockDataRepository.updateStockDataByIsin was called
      expect(StockDataRepository.updateStockDataByIsin).toHaveBeenCalledWith(isin1, mockResponse);
    });
    
    it('should throw an error when API call fails', async () => {
      // Mock apiProvider.fetchStockData to throw an error
      (mockApiProvider.fetchStockData as jest.Mock).mockRejectedValue(new Error('API error'));
      
      // Call the method and expect it to throw
      await expect(service.fetchStockDataByIsin(isin1)).rejects.toThrow(
        `Error fetching stock data for ISIN ${isin1.value}: API error`
      );
      
      // Check that apiProvider.fetchStockData was called
      expect(mockApiProvider.fetchStockData).toHaveBeenCalledWith(isin1.value);
      
      // Check that StockDataSchema.validate was not called
      expect(StockDataSchema.validate).not.toHaveBeenCalled();
      
      // Check that StockDataRepository.updateStockDataByIsin was not called
      expect(StockDataRepository.updateStockDataByIsin).not.toHaveBeenCalled();
    });
  });
});