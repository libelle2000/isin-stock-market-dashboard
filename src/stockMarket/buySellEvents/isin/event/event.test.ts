import { Event, EventData, EventType } from './event';
import { BuyEvent } from './buyEvent';
import { SellEvent } from './sellEvent';
import { Isin } from '../../../../shared/domainObjects/isin';
import { Money } from '../../../../shared/domainObjects/money';

// Mock implementation of the abstract Event class for testing
class TestEvent extends Event {
  constructor(data: EventData) {
    super(data);
  }
}

describe('Event', () => {
  // Sample event data for testing
  const buyEventData: EventData = {
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
  };

  const sellEventData: EventData = {
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
  };

  describe('constructor', () => {
    it('should create a valid Event object', () => {
      const event = new TestEvent(buyEventData);
      
      expect(event.type).toBe(EventType.BUY);
      expect(event.isin.value).toBe('GB0009895292');
      expect(event.stockName).toBe('AstraZeneca PLC');
      expect(event.nominaleCount).toBe(12);
      expect(event.stockPrice.amount).toBeCloseTo(130.5);
      expect(event.stockPrice.currency).toBe('€');
      
      const expectedDate = new Date(2024, 11, 4, 8, 16, 11);
      expect(event.tradingDateTime.getTime()).toBe(expectedDate.getTime());
      
      expect(event.totalIncludingCosts.amount).toBeCloseTo(1574.82);
      expect(event.totalIncludingCosts.currency).toBe('€');
    });

    it('should throw an error for invalid event type', () => {
      const invalidData = { ...buyEventData, TYPE: 'invalid' };
      expect(() => new TestEvent(invalidData)).toThrow('Invalid event type');
    });

    it('should throw an error for invalid ISIN', () => {
      const invalidData = { ...buyEventData, ISIN: 'invalid' };
      expect(() => new TestEvent(invalidData)).toThrow('Invalid ISIN');
    });

    it('should throw an error for invalid nominale count', () => {
      const invalidData = { ...buyEventData, NOMINALE_COUNT: 'invalid' };
      expect(() => new TestEvent(invalidData)).toThrow('Invalid nominale count');
    });

    it('should throw an error for invalid stock price', () => {
      const invalidData = { ...buyEventData, STOCK_PRICE: 'invalid' };
      expect(() => new TestEvent(invalidData)).toThrow('Invalid stock price');
    });

    it('should throw an error for invalid trading date/time', () => {
      const invalidData1 = { ...buyEventData, TRADING_DATE: 'invalid' };
      expect(() => new TestEvent(invalidData1)).toThrow('Invalid trading date/time');

      const invalidData2 = { ...buyEventData, TRADING_TIME: 'invalid' };
      expect(() => new TestEvent(invalidData2)).toThrow('Invalid trading date/time');
    });

    it('should throw an error for invalid total including costs', () => {
      const invalidData = { ...buyEventData, TOTAL_INCLUDING_COSTS: 'invalid' };
      expect(() => new TestEvent(invalidData)).toThrow('Invalid total including costs');
    });
  });

  describe('getters', () => {
    it('should return immutable copies of objects', () => {
      const event = new TestEvent(buyEventData);
      
      // Check that the returned date is a copy
      const tradingDateTime = event.tradingDateTime;
      const originalTime = tradingDateTime.getTime();
      tradingDateTime.setFullYear(2000);
      expect(event.tradingDateTime.getTime()).toBe(originalTime);
    });
  });
});

describe('BuyEvent', () => {
  const buyEventData: EventData = {
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
  };

  const sellEventData: EventData = {
    ...buyEventData,
    TYPE: 'sell'
  };

  it('should create a valid BuyEvent', () => {
    const buyEvent = new BuyEvent(buyEventData);
    
    expect(buyEvent.type).toBe(EventType.BUY);
    expect(buyEvent instanceof BuyEvent).toBe(true);
    expect(buyEvent instanceof Event).toBe(true);
  });

  it('should throw an error for non-buy event data', () => {
    expect(() => new BuyEvent(sellEventData)).toThrow('Invalid event type for BuyEvent');
  });
});

describe('SellEvent', () => {
  const sellEventData: EventData = {
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
  };

  const buyEventData: EventData = {
    ...sellEventData,
    TYPE: 'buy'
  };

  it('should create a valid SellEvent', () => {
    const sellEvent = new SellEvent(sellEventData);
    
    expect(sellEvent.type).toBe(EventType.SELL);
    expect(sellEvent instanceof SellEvent).toBe(true);
    expect(sellEvent instanceof Event).toBe(true);
  });

  it('should throw an error for non-sell event data', () => {
    expect(() => new SellEvent(buyEventData)).toThrow('Invalid event type for SellEvent');
  });
});