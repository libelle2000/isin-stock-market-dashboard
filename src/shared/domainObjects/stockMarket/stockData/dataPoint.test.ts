import { DataPoint } from './dataPoint';
import { Money, Currency } from '../../money';

describe('DataPoint', () => {
  describe('constructor', () => {
    it('should create a valid DataPoint with Date and Money', () => {
      const date = new Date('2020-07-09T00:00:00.000Z');
      const money = new Money(30.275, Currency.EUR);
      const dataPoint = new DataPoint(date, money);

      expect(dataPoint.timestamp).toEqual(date);
      expect(dataPoint.price.amount).toBe(30.275);
      expect(dataPoint.price.currency).toBe('€');
    });

    it('should create a valid DataPoint with Date and Money', () => {
      const date = new Date(1594245600000); // 2020-07-09T00:00:00.000Z
      const money = new Money(30.275, Currency.EUR);
      const dataPoint = new DataPoint(date, money);

      expect(dataPoint.unixTimestamp).toBe(date.getTime());
      expect(dataPoint.price.amount).toBe(30.275);
      expect(dataPoint.price.currency).toBe('€');
    });
  });

  describe('fromArray', () => {
    it('should create a valid DataPoint from an array', () => {
      const dataPoint = DataPoint.fromArray([1594245600000, 30.275]);

      expect(dataPoint.unixTimestamp).toBe(1594245600000);
      expect(dataPoint.price.amount).toBe(30.275);
      expect(dataPoint.price.currency).toBe('€');
    });

    it('should throw an error for invalid array', () => {
      expect(() => DataPoint.fromArray(null as any)).toThrow('Data must be an array');
      expect(() => DataPoint.fromArray([1594245600000] as any)).toThrow('Data must be an array with exactly two elements');
      expect(() => DataPoint.fromArray([1594245600000, 30.275, 'extra'] as any)).toThrow('Data must be an array with exactly two elements');
    });
  });

  describe('getters', () => {
    it('should return a copy of the timestamp', () => {
      const date = new Date('2020-07-09T00:00:00.000Z');
      const dataPoint = new DataPoint(date, new Money(30.275, Currency.EUR));

      const returnedDate = dataPoint.timestamp;
      expect(returnedDate).toEqual(date);
      expect(returnedDate).not.toBe(date); // Should be a different object
    });

    it('should return the unix timestamp', () => {
      const date = new Date(1594245600000);
      const money = new Money(30.275, Currency.EUR);
      const dataPoint = new DataPoint(date, money);

      expect(dataPoint.unixTimestamp).toBe(date.getTime());
    });

    it('should return the price', () => {
      const date = new Date(1594245600000);
      const money = new Money(30.275, Currency.EUR);
      const dataPoint = new DataPoint(date, money);

      expect(dataPoint.price.amount).toBe(30.275);
      expect(dataPoint.price.currency).toBe('€');
    });
  });

  describe('toJSON', () => {
    it('should return a JSON-serializable object with timestamp and price', () => {
      const date = new Date('2020-07-09T00:00:00.000Z');
      const money = new Money(30.275, Currency.EUR);
      const dataPoint = new DataPoint(date, money);

      const json = dataPoint.toJSON();

      expect(json).toEqual({
        timestamp: date.toISOString(),
        unixTimestamp: date.getTime(),
        price: {
          amount: 30.275,
          currency: '€'
        }
      });

      // Verify it can be properly serialized
      const serialized = JSON.stringify(dataPoint);
      const parsed = JSON.parse(serialized);

      expect(parsed).toEqual({
        timestamp: date.toISOString(),
        unixTimestamp: date.getTime(),
        price: {
          amount: 30.275,
          currency: '€'
        }
      });
    });
  });
});
