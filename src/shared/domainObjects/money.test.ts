import { Money } from './money';

describe('Money', () => {
  describe('constructor', () => {
    it('should create a Money instance from a string with Euro symbol', () => {
      const money = new Money('€10.50');
      expect(money.amount).toBe(10.50);
      expect(money.currency).toBe('EUR');
    });

    it('should create a Money instance from a string with Dollar symbol', () => {
      const money = new Money('$20.75');
      expect(money.amount).toBe(20.75);
      expect(money.currency).toBe('USD');
    });

    it('should create a Money instance from a string without currency symbol', () => {
      const money = new Money('30.25');
      expect(money.amount).toBe(30.25);
      expect(money.currency).toBe('EUR'); // Default currency
    });

    it('should handle European number format with comma as decimal separator', () => {
      const money = new Money('€10,50');
      expect(money.amount).toBe(10.50);
      expect(money.currency).toBe('EUR');
    });

    it('should handle European number format with thousands separator', () => {
      const money = new Money('€1.234,56');
      expect(money.amount).toBe(1234.56);
      expect(money.currency).toBe('EUR');
    });

    it('should handle currency symbol at the end', () => {
      const money = new Money('10.50€');
      expect(money.amount).toBe(10.50);
      expect(money.currency).toBe('EUR');
    });

    it('should handle whitespace', () => {
      const money = new Money(' € 10.50 ');
      expect(money.amount).toBe(10.50);
      expect(money.currency).toBe('EUR');
    });

    it('should throw an error for empty input', () => {
      expect(() => new Money('')).toThrow('Input must be a non-empty string');
    });

    it('should throw an error for null or undefined input', () => {
      expect(() => new Money(null as any)).toThrow('Input must be a non-empty string');
      expect(() => new Money(undefined as any)).toThrow('Input must be a non-empty string');
    });

    it('should accept number input', () => {
      const money = new Money(123);
      expect(money.amount).toBe(123);
      expect(money.currency).toBe('EUR');
    });

    it('should throw an error for unparseable amount', () => {
      expect(() => new Money('abc')).toThrow('Cannot parse amount from string');
      expect(() => new Money('€abc')).toThrow('Cannot parse amount from string');
    });
  });

  describe('getters', () => {
    it('should return the correct amount', () => {
      const money = new Money('€10.50');
      expect(money.amount).toBe(10.50);
    });

    it('should return the correct currency', () => {
      const money = new Money('$20.75');
      expect(money.currency).toBe('USD');
    });
  });

  describe('toString', () => {
    it('should format Euro amount correctly', () => {
      const money = new Money('€10.50');
      expect(money.toString()).toBe('EUR 10.50');
    });

    it('should format Dollar amount correctly', () => {
      const money = new Money('$20.75');
      expect(money.toString()).toBe('USD 20.75');
    });

    it('should format with two decimal places', () => {
      const money = new Money('€10');
      expect(money.toString()).toBe('EUR 10.00');
    });
  });

  describe('fromAmount', () => {
    it('should create a Money instance with the specified amount and default currency', () => {
      const money = Money.fromAmount(10.50);
      expect(money.amount).toBe(10.50);
      expect(money.currency).toBe('EUR');
    });

    it('should create a Money instance with the specified amount and currency', () => {
      const money = Money.fromAmount(20.75, 'USD');
      expect(money.amount).toBe(20.75);
      expect(money.currency).toBe('USD');
    });

    it('should handle integer amounts', () => {
      const money = Money.fromAmount(100);
      expect(money.amount).toBe(100);
      expect(money.currency).toBe('EUR');
    });
  });

  describe('equals', () => {
    it('should return true for equal Money objects', () => {
      const money1 = new Money('€10.50');
      const money2 = new Money('€10.50');
      expect(money1.equals(money2)).toBe(true);
    });

    it('should return false for Money objects with different amounts', () => {
      const money1 = new Money('€10.50');
      const money2 = new Money('€10.51');
      expect(money1.equals(money2)).toBe(false);
    });

    it('should return false for Money objects with different currencies', () => {
      const money1 = new Money('€10.50');
      const money2 = new Money('$10.50');
      expect(money1.equals(money2)).toBe(false);
    });

    it('should return false for non-Money objects', () => {
      const money = new Money('€10.50');
      expect(money.equals(null as any)).toBe(false);
      expect(money.equals(undefined as any)).toBe(false);
      expect(money.equals({} as any)).toBe(false);
      expect(money.equals('€10.50' as any)).toBe(false);
    });
  });
});
