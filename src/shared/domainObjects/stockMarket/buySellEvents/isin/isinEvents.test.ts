import { IsinEvents } from './isinEvents';
import { Event, EventData } from './event/event';
import { BuyEvent } from './event/buyEvent';
import { SellEvent } from './event/sellEvent';
import { Isin } from '../../../isin';

// Mock implementation of the abstract Event class for testing
class TestEvent extends Event {
  constructor(data: EventData) {
    super(data);
  }
}

describe('IsinEvents', () => {
  // Sample event data for testing
  const isin = new Isin('GB0009895292');
  
  const buyEvent1Data: EventData = {
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

  const buyEvent2Data: EventData = {
    ...buyEvent1Data,
    TRADING_DATE: '2023-03-17',
    TRADING_TIME: '13:59:16',
    STOCK_PRICE: '€123,50',
    NOMINALE_COUNT: '9',
    TOTAL_INCLUDING_COSTS: '€1.119,18'
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

  const differentIsinData: EventData = {
    ...buyEvent1Data,
    ISIN: 'LU2090063327'
  };

  let buyEvent1: BuyEvent;
  let buyEvent2: BuyEvent;
  let sellEvent: SellEvent;
  let differentIsinEvent: TestEvent;

  beforeEach(() => {
    buyEvent1 = new BuyEvent(buyEvent1Data);
    buyEvent2 = new BuyEvent(buyEvent2Data);
    sellEvent = new SellEvent(sellEventData);
    differentIsinEvent = new TestEvent(differentIsinData);
  });

  describe('constructor', () => {
    it('should create a valid IsinEvents object', () => {
      const isinEvents = new IsinEvents(isin, [buyEvent1, buyEvent2, sellEvent]);
      
      expect(isinEvents.isin).toBe(isin);
      expect(isinEvents.count).toBe(3);
    });

    it('should throw an error if events have different ISINs', () => {
      expect(() => new IsinEvents(isin, [buyEvent1, differentIsinEvent])).toThrow(
        'Event with ISIN LU2090063327 does not match collection ISIN GB0009895292'
      );
    });

    it('should sort events by trading date and time', () => {
      // Events are added in non-chronological order
      const isinEvents = new IsinEvents(isin, [buyEvent1, sellEvent, buyEvent2]);
      
      // Expect them to be sorted chronologically
      const events = [...isinEvents.events];
      expect(events[0]).toBe(sellEvent); // 2022-04-27
      expect(events[1]).toBe(buyEvent2); // 2023-03-17
      expect(events[2]).toBe(buyEvent1); // 2024-12-04
    });
  });

  describe('getters', () => {
    it('should return the ISIN', () => {
      const isinEvents = new IsinEvents(isin, [buyEvent1, buyEvent2, sellEvent]);
      
      expect(isinEvents.isin).toBe(isin);
    });

    it('should return all events', () => {
      const isinEvents = new IsinEvents(isin, [buyEvent1, buyEvent2, sellEvent]);
      
      expect(isinEvents.events.length).toBe(3);
      expect(isinEvents.events).toContain(buyEvent1);
      expect(isinEvents.events).toContain(buyEvent2);
      expect(isinEvents.events).toContain(sellEvent);
    });

    it('should return the count of events', () => {
      const isinEvents = new IsinEvents(isin, [buyEvent1, buyEvent2, sellEvent]);
      
      expect(isinEvents.count).toBe(3);
    });

    it('should return the oldest event', () => {
      const isinEvents = new IsinEvents(isin, [buyEvent1, buyEvent2, sellEvent]);
      
      expect(isinEvents.oldestEvent).toBe(sellEvent); // 2022-04-27
    });

    it('should throw an error if there are no events when getting oldest event', () => {
      const isinEvents = new IsinEvents(isin, []);
      
      expect(() => isinEvents.oldestEvent).toThrow('No events found for ISIN GB0009895292');
    });

    it('should return the latest event', () => {
      const isinEvents = new IsinEvents(isin, [buyEvent1, buyEvent2, sellEvent]);
      
      expect(isinEvents.latestEvent).toBe(buyEvent1); // 2024-12-04
    });

    it('should throw an error if there are no events when getting latest event', () => {
      const isinEvents = new IsinEvents(isin, []);
      
      expect(() => isinEvents.latestEvent).toThrow('No events found for ISIN GB0009895292');
    });

    it('should return all buy events', () => {
      const isinEvents = new IsinEvents(isin, [buyEvent1, buyEvent2, sellEvent]);
      
      expect(isinEvents.buyEvents.length).toBe(2);
      expect(isinEvents.buyEvents).toContain(buyEvent1);
      expect(isinEvents.buyEvents).toContain(buyEvent2);
    });

    it('should return all sell events', () => {
      const isinEvents = new IsinEvents(isin, [buyEvent1, buyEvent2, sellEvent]);
      
      expect(isinEvents.sellEvents.length).toBe(1);
      expect(isinEvents.sellEvents).toContain(sellEvent);
    });
  });

  describe('iteration', () => {
    it('should be iterable', () => {
      const isinEvents = new IsinEvents(isin, [buyEvent1, buyEvent2, sellEvent]);
      
      const events = [];
      for (const event of isinEvents) {
        events.push(event);
      }
      
      expect(events.length).toBe(3);
      expect(events[0]).toBe(sellEvent); // 2022-04-27
      expect(events[1]).toBe(buyEvent2); // 2023-03-17
      expect(events[2]).toBe(buyEvent1); // 2024-12-04
    });
  });
});