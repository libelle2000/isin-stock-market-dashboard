import { BuySellEventRepository } from './buySellEventRepository';
import { CsvReader } from '../../shared/csv/csvReader';
import { Events } from './events';
import { IsinEvents } from './isin/isinEvents';
import { BuyEvent } from './isin/event/buyEvent';
import { SellEvent } from './isin/event/sellEvent';
import { EventType } from './isin/event/event';

// Mock CsvReader
jest.mock('../../shared/csv/csvReader');

describe('BuySellEventRepository', () => {
  // Sample CSV data
  const sampleCsvData = [
    {
      TYPE: 'buy',
      ISIN: 'GB0009895292',
      STOCK_NAME: 'AstraZeneca PLC',
      NOMINALE_COUNT: '12',
      STOCK_PRICE: '€130,50',
      TRADING_DATE: '2024-12-04',
      TRADING_TIME: '8:16:11',
      MARKET_VALUE: '€1.566,00',
      FACTOR_USD_TO_EUR: '1',
      STOCK_PRICE_EUR: '€1.566,00',
      CAPITAL_TAX: '',
      CHURCH_TAX: '',
      SOLIDARITY_TAX: '',
      COURTAGE: '',
      STOCK_FEE: '',
      PROVISION: '€8,82',
      VARIABLE_TRANSACTION_FEE: '',
      TOTAL_COSTS: '€8,82',
      TOTAL_INCLUDING_COSTS: '€1.574,82'
    },
    {
      TYPE: 'buy',
      ISIN: 'LU2090063327',
      STOCK_NAME: 'MUL-Am.MSCI Semic.ESG Scre.UE Nam.-Ant. EUR Dis.oN',
      NOMINALE_COUNT: '12',
      STOCK_PRICE: '€87,14',
      TRADING_DATE: '2025-01-31',
      TRADING_TIME: '9:38:38',
      MARKET_VALUE: '€1.045,68',
      FACTOR_USD_TO_EUR: '1',
      STOCK_PRICE_EUR: '€1.045,68',
      CAPITAL_TAX: '',
      CHURCH_TAX: '',
      SOLIDARITY_TAX: '',
      COURTAGE: '',
      STOCK_FEE: '€1,90',
      PROVISION: '€7,51',
      VARIABLE_TRANSACTION_FEE: '€1,25',
      TOTAL_COSTS: '€10,66',
      TOTAL_INCLUDING_COSTS: '€1.056,34'
    },
    {
      TYPE: 'sell',
      ISIN: 'GB0009895292',
      STOCK_NAME: 'AstraZeneca PLC',
      NOMINALE_COUNT: '9',
      STOCK_PRICE: '€123,20',
      TRADING_DATE: '2022-04-27',
      TRADING_TIME: '8:00:02',
      MARKET_VALUE: '€1.108,80',
      FACTOR_USD_TO_EUR: '1',
      STOCK_PRICE_EUR: '€1.108,80',
      CAPITAL_TAX: '',
      CHURCH_TAX: '',
      SOLIDARITY_TAX: '',
      COURTAGE: '',
      STOCK_FEE: '',
      PROVISION: '-€7,67',
      VARIABLE_TRANSACTION_FEE: '',
      TOTAL_COSTS: '-€7,67',
      TOTAL_INCLUDING_COSTS: '€1.101,13'
    },
    {
      TYPE: 'invalid',
      ISIN: 'GB0009895292',
      STOCK_NAME: 'AstraZeneca PLC',
      NOMINALE_COUNT: '9',
      STOCK_PRICE: '€123,20',
      TRADING_DATE: '2022-04-27',
      TRADING_TIME: '8:00:02',
      MARKET_VALUE: '€1.108,80',
      FACTOR_USD_TO_EUR: '1',
      STOCK_PRICE_EUR: '€1.108,80',
      CAPITAL_TAX: '',
      CHURCH_TAX: '',
      SOLIDARITY_TAX: '',
      COURTAGE: '',
      STOCK_FEE: '',
      PROVISION: '-€7,67',
      VARIABLE_TRANSACTION_FEE: '',
      TOTAL_COSTS: '-€7,67',
      TOTAL_INCLUDING_COSTS: '€1.101,13'
    }
  ];

  // Mock console methods to prevent test output pollution
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock CsvReader.readCsv to return the sample data
    (CsvReader.readCsv as jest.Mock).mockResolvedValue(sampleCsvData);
    
    // Mock console methods
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    // Restore console methods
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
  });

  describe('getAllEvents', () => {
    it('should read events from the CSV file and return an Events collection', async () => {
      const events = await BuySellEventRepository.getAllEvents();
      
      // Check that CsvReader.readCsv was called
      expect(CsvReader.readCsv).toHaveBeenCalled();
      
      // Check that the result is an Events object
      expect(events).toBeInstanceOf(Events);
      
      // Check that the Events collection contains the expected ISINs
      expect(events.count).toBe(2);
      expect(events.hasIsin('GB0009895292')).toBe(true);
      expect(events.hasIsin('LU2090063327')).toBe(true);
      
      // Check that the Events collection contains the expected events
      const gbEvents = events.getByIsin('GB0009895292');
      expect(gbEvents).toBeDefined();
      expect(gbEvents!.count).toBe(2);
      expect(gbEvents!.buyEvents.length).toBe(1);
      expect(gbEvents!.sellEvents.length).toBe(1);
      
      const luEvents = events.getByIsin('LU2090063327');
      expect(luEvents).toBeDefined();
      expect(luEvents!.count).toBe(1);
      expect(luEvents!.buyEvents.length).toBe(1);
      expect(luEvents!.sellEvents.length).toBe(0);
    });

    it('should handle invalid event types', async () => {
      const events = await BuySellEventRepository.getAllEvents();
      
      // Check that console.warn was called for the invalid event type
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Unknown event type: invalid'));
    });

    it('should handle errors when creating events', async () => {
      // Mock CsvReader.readCsv to return data with an invalid ISIN
      const invalidIsinData = [
        {
          ...sampleCsvData[0],
          ISIN: 'invalid'
        }
      ];
      (CsvReader.readCsv as jest.Mock).mockResolvedValue(invalidIsinData);
      
      const events = await BuySellEventRepository.getAllEvents();
      
      // Check that console.error was called for the invalid ISIN
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error creating event'));
      
      // Check that the Events collection is empty
      expect(events.count).toBe(0);
    });

    it('should throw an error if reading the CSV file fails', async () => {
      // Mock CsvReader.readCsv to throw an error
      (CsvReader.readCsv as jest.Mock).mockRejectedValue(new Error('CSV read error'));
      
      await expect(BuySellEventRepository.getAllEvents()).rejects.toThrow('Error reading buy/sell events');
    });

    it('should use the default CSV path if none is provided', async () => {
      await BuySellEventRepository.getAllEvents();
      
      // Check that CsvReader.readCsv was called with the default path
      expect(CsvReader.readCsv).toHaveBeenCalledWith(expect.stringContaining('ISIN-buy-sell-events.csv'));
    });

    it('should use the provided CSV path if one is provided', async () => {
      const customPath = 'custom/path/to/events.csv';
      await BuySellEventRepository.getAllEvents(customPath);
      
      // Check that CsvReader.readCsv was called with the custom path
      expect(CsvReader.readCsv).toHaveBeenCalledWith(customPath);
    });
  });
});