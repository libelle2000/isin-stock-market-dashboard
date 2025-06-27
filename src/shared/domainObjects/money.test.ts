import { Money } from './money';

describe('Money', () => {
  describe('constructor', () => {
    it('should create a valid Money object', () => {
      const money = new Money(10.5);
      expect(money.amount).toBeCloseTo(10.5);
      expect(money.currency).toBe('EUR');
    });

    it('should create a Money object with specified currency', () => {
      const money = new Money(10.5, 'USD');
      expect(money.amount).toBeCloseTo(10.5);
      expect(money.currency).toBe('USD');
    });

    it('should throw an error for invalid amount', () => {
      expect(() => new Money(NaN)).toThrow('Invalid amount');
    });

    it('should round to nearest cent', () => {
      const money = new Money(10.567);
      expect(money.amount).toBeCloseTo(10.57);
    });
  });

  describe('fromString', () => {
    it('should create a Money object from a string with currency symbol', () => {
      const money = Money.fromString('€10.50');
      expect(money.amount).toBeCloseTo(10.5);
      expect(money.currency).toBe('EUR');
    });

    it('should create a Money object from a string without currency symbol', () => {
      const money = Money.fromString('10.50');
      expect(money.amount).toBeCloseTo(10.5);
      expect(money.currency).toBe('EUR');
    });

    it('should create a Money object from a string with comma as decimal separator', () => {
      const money = Money.fromString('10,50');
      expect(money.amount).toBeCloseTo(10.5);
      expect(money.currency).toBe('EUR');
    });

    it('should create a Money object with specified currency', () => {
      const money = Money.fromString('$10.50', 'USD');
      expect(money.amount).toBeCloseTo(10.5);
      expect(money.currency).toBe('USD');
    });

    it('should throw an error for empty string', () => {
      expect(() => Money.fromString('')).toThrow('Amount string cannot be empty');
    });

    it('should throw an error for invalid string', () => {
      expect(() => Money.fromString('not-a-number')).toThrow('Cannot parse amount from string');
    });
  });

  describe('arithmetic operations', () => {
    it('should add two Money objects', () => {
      const money1 = new Money(10.5);
      const money2 = new Money(5.25);
      const result = money1.add(money2);
      
      expect(result.amount).toBeCloseTo(15.75);
      expect(result.currency).toBe('EUR');
    });

    it('should throw an error when adding different currencies', () => {
      const money1 = new Money(10.5, 'EUR');
      const money2 = new Money(5.25, 'USD');
      
      expect(() => money1.add(money2)).toThrow('Cannot add different currencies');
    });

    it('should subtract two Money objects', () => {
      const money1 = new Money(10.5);
      const money2 = new Money(5.25);
      const result = money1.subtract(money2);
      
      expect(result.amount).toBeCloseTo(5.25);
      expect(result.currency).toBe('EUR');
    });

    it('should throw an error when subtracting different currencies', () => {
      const money1 = new Money(10.5, 'EUR');
      const money2 = new Money(5.25, 'USD');
      
      expect(() => money1.subtract(money2)).toThrow('Cannot subtract different currencies');
    });

    it('should multiply a Money object by a factor', () => {
      const money = new Money(10.5);
      const result = money.multiply(2);
      
      expect(result.amount).toBeCloseTo(21);
      expect(result.currency).toBe('EUR');
    });

    it('should throw an error when multiplying by an invalid factor', () => {
      const money = new Money(10.5);
      
      expect(() => money.multiply(NaN)).toThrow('Invalid multiplication factor');
    });
  });

  describe('equals', () => {
    it('should return true for equal Money objects', () => {
      const money1 = new Money(10.5);
      const money2 = new Money(10.5);
      
      expect(money1.equals(money2)).toBe(true);
    });

    it('should return false for Money objects with different amounts', () => {
      const money1 = new Money(10.5);
      const money2 = new Money(10.6);
      
      expect(money1.equals(money2)).toBe(false);
    });

    it('should return false for Money objects with different currencies', () => {
      const money1 = new Money(10.5, 'EUR');
      const money2 = new Money(10.5, 'USD');
      
      expect(money1.equals(money2)).toBe(false);
    });

    it('should return false for non-Money objects', () => {
      const money = new Money(10.5);
      
      expect(money.equals(10.5 as any)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string representation of the Money', () => {
      const money = new Money(10.5);
      
      expect(money.toString()).toBe('EUR 10.50');
    });

    it('should format the amount with two decimal places', () => {
      const money = new Money(10);
      
      expect(money.toString()).toBe('EUR 10.00');
    });
  });
});