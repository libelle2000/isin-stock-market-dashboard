import { Ing } from './ing';
import { StockDataResponse } from './stockDataSchema';

// Mock the global fetch function
global.fetch = jest.fn();

describe('Ing', () => {
  let ing: Ing;
  
  beforeEach(() => {
    ing = new Ing();
    // Clear all mocks before each test
    jest.clearAllMocks();
  });
  
  it('should fetch stock data for a valid ISIN', async () => {
    // Mock response data
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
    
    // Mock the fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });
    
    // Call the method
    const result = await ing.fetchStockData('LU2090063327');
    
    // Check that fetch was called with the correct URL
    expect(global.fetch).toHaveBeenCalledWith(
      'https://component-api.wertpapiere.ing.de/api/v1/components/charttooldata/LU2090063327?timeRange=Maximum&exchangeId=2779&currencyId=814'
    );
    
    // Check the result
    expect(result).toEqual(mockResponse);
  });
  
  it('should throw an error when the API call fails', async () => {
    // Mock a failed fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    });
    
    // Call the method and expect it to throw
    await expect(ing.fetchStockData('INVALID')).rejects.toThrow(
      'Failed to fetch stock data for ISIN INVALID: API call failed with status 404: Not Found'
    );
  });
  
  it('should throw an error when fetch throws', async () => {
    // Mock fetch to throw an error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    // Call the method and expect it to throw
    await expect(ing.fetchStockData('LU2090063327')).rejects.toThrow(
      'Failed to fetch stock data for ISIN LU2090063327: Network error'
    );
  });
});