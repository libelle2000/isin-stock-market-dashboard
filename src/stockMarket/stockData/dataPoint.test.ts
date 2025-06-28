import { DataPoint } from './dataPoint';
import { Money } from '../../shared/domainObjects/money';

describe('DataPoint', () => {
  describe('constructor', () => {
    it('should create a valid DataPoint with Date and Money', () => {
      const date = new Date('2020-07-09T00:00:00.000Z');
      const money = new Money(30.275);
      const dataPoint = new DataPoint(date, money);

      expect(dataPoint.timestamp).toEqual(date);
      expect(dataPoint.price.amount).toBe(30.275);
      expect(dataPoint.price.currency).toBe('EUR');
    });

    it('should create a valid DataPoint with timestamp and number', () => {
      const timestamp = 1594245600000; // 2020-07-09T00:00:00.000Z
      const dataPoint = new DataPoint(timestamp, 30.275);

      expect(dataPoint.unixTimestamp).toBe(timestamp);
      expect(dataPoint.price.amount).toBe(30.275);
      expect(dataPoint.price.currency).toBe('EUR');
    });

    it('should throw an error for invalid timestamp', () => {
      expect(() => new DataPoint(NaN, 30.275)).toThrow('Invalid timestamp');
      expect(() => new DataPoint(-1, 30.275)).toThrow('Invalid timestamp');
    });

    it('should throw an error for invalid timestamp type', () => {
      expect(() => new DataPoint('invalid' as any, 30.275)).toThrow('Invalid timestamp type');
    });

    it('should throw an error for invalid price type', () => {
      expect(() => new DataPoint(1594245600000, 'invalid' as any)).toThrow('Invalid price type');
    });
  });

  describe('fromArray', () => {
    it('should create a valid DataPoint from an array', () => {
      const dataPoint = DataPoint.fromArray([1594245600000, 30.275]);

      expect(dataPoint.unixTimestamp).toBe(1594245600000);
      expect(dataPoint.price.amount).toBe(30.275);
      expect(dataPoint.price.currency).toBe('EUR');
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
      const dataPoint = new DataPoint(date, 30.275);

      const returnedDate = dataPoint.timestamp;
      expect(returnedDate).toEqual(date);
      expect(returnedDate).not.toBe(date); // Should be a different object
    });

    it('should return the unix timestamp', () => {
      const timestamp = 1594245600000;
      const dataPoint = new DataPoint(timestamp, 30.275);

      expect(dataPoint.unixTimestamp).toBe(timestamp);
    });

    it('should return the price', () => {
      const money = new Money(30.275);
      const dataPoint = new DataPoint(1594245600000, money);

      expect(dataPoint.price.amount).toBe(30.275);
      expect(dataPoint.price.currency).toBe('EUR');
    });
  });

  describe('equals', () => {
    it('should return true for equal DataPoints', () => {
      const dataPoint1 = new DataPoint(1594245600000, 30.275);
      const dataPoint2 = new DataPoint(1594245600000, 30.275);

      expect(dataPoint1.equals(dataPoint2)).toBe(true);
    });

    it('should return false for DataPoints with different timestamps', () => {
      const dataPoint1 = new DataPoint(1594245600000, 30.275);
      const dataPoint2 = new DataPoint(1594332000000, 30.275);

      expect(dataPoint1.equals(dataPoint2)).toBe(false);
    });

    it('should return false for DataPoints with different prices', () => {
      const dataPoint1 = new DataPoint(1594245600000, 30.275);
      const dataPoint2 = new DataPoint(1594245600000, 29.875);

      expect(dataPoint1.equals(dataPoint2)).toBe(false);
    });

    it('should return false for non-DataPoint objects', () => {
      const dataPoint = new DataPoint(1594245600000, 30.275);

      expect(dataPoint.equals([1594245600000, 30.275] as any)).toBe(false);
    });
  });

  describe('toArray', () => {
    it('should return the DataPoint as an array', () => {
      const dataPoint = new DataPoint(1594245600000, 30.275);
      const array = dataPoint.toArray();

      expect(array).toEqual([1594245600000, 30.275]);
    });
  });

  describe('toString', () => {
    it('should return the string representation of the DataPoint', () => {
      const dataPoint = new DataPoint(1594245600000, 30.275);
      const str = dataPoint.toString();
      
      expect(str).toContain('2020-07-08T22:00:00.000Z');
      expect(str).toContain('EUR 30.275');
    });
  });
});
