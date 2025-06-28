import { Events } from './events';
import { IsinEvents } from './isin/isinEvents';
import { EventData } from './isin/event/event';
import { BuyEvent } from './isin/event/buyEvent';
import { Isin } from '../../shared/domainObjects/isin';

describe('Events', () => {
  // Sample ISINs
  const isin1 = new Isin('GB0009895292');
  const isin2 = new Isin('LU2090063327');
  
  // Sample event data
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
    ISIN: 'LU2090063327',
    STOCK_NAME: 'MUL-Am.MSCI Semic.ESG Scre.UE Nam.-Ant. EUR Dis.oN'
  };

  let buyEvent1: BuyEvent;
  let buyEvent2: BuyEvent;
  let isinEvents1: IsinEvents;
  let isinEvents2: IsinEvents;
  let events: Events;

  beforeEach(() => {
    buyEvent1 = new BuyEvent(buyEvent1Data);
    buyEvent2 = new BuyEvent(buyEvent2Data);
    
    isinEvents1 = new IsinEvents(isin1, [buyEvent1]);
    isinEvents2 = new IsinEvents(isin2, [buyEvent2]);
    
    events = new Events([isinEvents1, isinEvents2]);
  });

  describe('constructor', () => {
    it('should create a valid Events object', () => {
      expect(events.count).toBe(2);
    });

    it('should handle empty array', () => {
      const emptyEvents = new Events([]);
      expect(emptyEvents.count).toBe(0);
    });
  });

  describe('getters', () => {
    it('should return all IsinEvents', () => {
      const allIsinEvents = events.allIsinEvents;
      
      expect(allIsinEvents.length).toBe(2);
      expect(allIsinEvents).toContain(isinEvents1);
      expect(allIsinEvents).toContain(isinEvents2);
    });

    it('should return the count of IsinEvents', () => {
      expect(events.count).toBe(2);
    });

    it('should return all ISINs', () => {
      const isins = events.isins;
      
      expect(isins.length).toBe(2);
      expect(isins).toContainEqual(isin1);
      expect(isins).toContainEqual(isin2);
    });
  });

  describe('getByIsin', () => {
    it('should return IsinEvents for a given ISIN object', () => {
      expect(events.getByIsin(isin1)).toBe(isinEvents1);
      expect(events.getByIsin(isin2)).toBe(isinEvents2);
    });

    it('should return IsinEvents for a given ISIN string', () => {
      expect(events.getByIsin('GB0009895292')).toBe(isinEvents1);
      expect(events.getByIsin('LU2090063327')).toBe(isinEvents2);
    });

    it('should return undefined for a non-existent ISIN', () => {
      expect(events.getByIsin('US0378331005')).toBeUndefined();
    });
  });

  describe('hasIsin', () => {
    it('should return true for an existing ISIN object', () => {
      expect(events.hasIsin(isin1)).toBe(true);
      expect(events.hasIsin(isin2)).toBe(true);
    });

    it('should return true for an existing ISIN string', () => {
      expect(events.hasIsin('GB0009895292')).toBe(true);
      expect(events.hasIsin('LU2090063327')).toBe(true);
    });

    it('should return false for a non-existent ISIN', () => {
      expect(events.hasIsin('US0378331005')).toBe(false);
    });
  });

  describe('iteration', () => {
    it('should be iterable', () => {
      const isinEventsArray = [];
      for (const isinEvents of events) {
        isinEventsArray.push(isinEvents);
      }
      
      expect(isinEventsArray.length).toBe(2);
      expect(isinEventsArray).toContain(isinEvents1);
      expect(isinEventsArray).toContain(isinEvents2);
    });
  });
});