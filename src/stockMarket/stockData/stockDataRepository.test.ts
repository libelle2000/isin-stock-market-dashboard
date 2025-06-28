import { Isin } from '../../shared/domainObjects/isin';
import { JsonReader } from '../../shared/json/jsonReader';
import { JsonWriter } from '../../shared/json/jsonWriter';
import { StockDataRepository } from './stockDataRepository';
import { StockData } from './stockData';
import { StockDataResponse, StockDataSchema } from '../apiProvider/stockDataSchema';

// Mock dependencies
jest.mock('../../shared/json/jsonReader');
jest.mock('../../shared/json/jsonWriter');
jest.mock('../apiProvider/stockDataSchema');

describe('StockDataRepository', () => {
  const isin = new Isin('LU2090063327');
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
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('getStockDataByIsin', () => {
    it('should return stock data when it exists in the cache', async () => {
      // Mock JsonReader to return mock data
      (JsonReader.readJson as jest.Mock).mockResolvedValueOnce(mockResponse);
      
      // Mock StockDataSchema.validate to not throw
      (StockDataSchema.validate as jest.Mock).mockImplementationOnce(() => {});
      
      // Call the method
      const result = await StockDataRepository.getStockDataByIsin(isin);
      
      // Check that JsonReader was called with the correct path
      expect(JsonReader.readJson).toHaveBeenCalledWith(expect.stringContaining('LU2090063327.json'));
      
      // Check that StockDataSchema.validate was called
      expect(StockDataSchema.validate).toHaveBeenCalledWith(mockResponse);
      
      // Check the result
      expect(result).toBeInstanceOf(StockData);
      expect(result?.isin).toEqual(isin);
    });
    
    it('should return null when the file does not exist', async () => {
      // Mock JsonReader to throw a "File not found" error
      (JsonReader.readJson as jest.Mock).mockRejectedValueOnce(new Error('File not found'));
      
      // Call the method
      const result = await StockDataRepository.getStockDataByIsin(isin);
      
      // Check that JsonReader was called
      expect(JsonReader.readJson).toHaveBeenCalled();
      
      // Check the result
      expect(result).toBeNull();
    });
    
    it('should throw when the file exists but is invalid', async () => {
      // Mock JsonReader to return mock data
      (JsonReader.readJson as jest.Mock).mockResolvedValueOnce(mockResponse);
      
      // Mock StockDataSchema.validate to throw
      (StockDataSchema.validate as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Invalid data');
      });
      
      // Call the method and expect it to throw
      await expect(StockDataRepository.getStockDataByIsin(isin)).rejects.toThrow('Invalid data');
      
      // Check that JsonReader was called
      expect(JsonReader.readJson).toHaveBeenCalled();
      
      // Check that StockDataSchema.validate was called
      expect(StockDataSchema.validate).toHaveBeenCalledWith(mockResponse);
    });
    
    it('should throw when JsonReader throws a non-"File not found" error', async () => {
      // Mock JsonReader to throw a different error
      (JsonReader.readJson as jest.Mock).mockRejectedValueOnce(new Error('Read error'));
      
      // Call the method and expect it to throw
      await expect(StockDataRepository.getStockDataByIsin(isin)).rejects.toThrow('Read error');
      
      // Check that JsonReader was called
      expect(JsonReader.readJson).toHaveBeenCalled();
    });
  });
  
  describe('updateStockDataByIsin', () => {
    it('should validate and write the data to the cache', async () => {
      // Mock StockDataSchema.validate to not throw
      (StockDataSchema.validate as jest.Mock).mockImplementationOnce(() => {});
      
      // Mock JsonWriter to resolve
      (JsonWriter.writeJson as jest.Mock).mockResolvedValueOnce(undefined);
      
      // Call the method
      await StockDataRepository.updateStockDataByIsin(isin, mockResponse);
      
      // Check that StockDataSchema.validate was called
      expect(StockDataSchema.validate).toHaveBeenCalledWith(mockResponse);
      
      // Check that JsonWriter was called with the correct path and data
      expect(JsonWriter.writeJson).toHaveBeenCalledWith(
        expect.stringContaining('LU2090063327.json'),
        mockResponse
      );
    });
    
    it('should throw when the data is invalid', async () => {
      // Mock StockDataSchema.validate to throw
      (StockDataSchema.validate as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Invalid data');
      });
      
      // Call the method and expect it to throw
      await expect(StockDataRepository.updateStockDataByIsin(isin, mockResponse)).rejects.toThrow('Invalid data');
      
      // Check that StockDataSchema.validate was called
      expect(StockDataSchema.validate).toHaveBeenCalledWith(mockResponse);
      
      // Check that JsonWriter was not called
      expect(JsonWriter.writeJson).not.toHaveBeenCalled();
    });
    
    it('should throw when JsonWriter throws', async () => {
      // Mock StockDataSchema.validate to not throw
      (StockDataSchema.validate as jest.Mock).mockImplementationOnce(() => {});
      
      // Mock JsonWriter to throw
      (JsonWriter.writeJson as jest.Mock).mockRejectedValueOnce(new Error('Write error'));
      
      // Call the method and expect it to throw
      await expect(StockDataRepository.updateStockDataByIsin(isin, mockResponse)).rejects.toThrow('Write error');
      
      // Check that StockDataSchema.validate was called
      expect(StockDataSchema.validate).toHaveBeenCalledWith(mockResponse);
      
      // Check that JsonWriter was called
      expect(JsonWriter.writeJson).toHaveBeenCalled();
    });
  });
});