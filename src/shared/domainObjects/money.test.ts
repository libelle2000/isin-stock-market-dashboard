import { Money, Currency } from './money';

describe('Money', () => {
  describe('constructor', () => {
    it('should create a Money instance with amount and currency', () => {
      const money = new Money(10.50, Currency.EUR);
      expect(money.amount).toBe(10.50);
      expect(money.currency).toBe('€');
    });

    it('should throw an error for invalid amount', () => {
      expect(() => new Money(NaN, Currency.EUR)).toThrow('Invalid amount');
    });
  });

  describe('fromString', () => {
    it('should create a Money instance from a string with Euro symbol', () => {
      const money = Money.fromString('€10.50');
      expect(money.amount).toBe(10.50);
      expect(money.currency).toBe('€');
    });

    it('should create a Money instance from a string with Dollar symbol', () => {
      const money = Money.fromString('$20.75');
      expect(money.amount).toBe(20.75);
      expect(money.currency).toBe('$');
    });

    it('should create a Money instance from a string without currency symbol', () => {
      const money = Money.fromString('30.25');
      expect(money.amount).toBe(30.25);
      expect(money.currency).toBe('€'); // Default currency
    });

    it('should handle European number format with comma as decimal separator', () => {
      const money = Money.fromString('€10,50');
      expect(money.amount).toBe(10.50);
      expect(money.currency).toBe('€');
    });

    it('should handle European number format with thousands separator', () => {
      const money = Money.fromString('€1.234,56');
      expect(money.amount).toBe(1234.56);
      expect(money.currency).toBe('€');
    });

    it('should handle currency symbol at the end', () => {
      const money = Money.fromString('10.50€');
      expect(money.amount).toBe(10.50);
      expect(money.currency).toBe('€');
    });

    it('should handle whitespace', () => {
      const money = Money.fromString(' € 10.50 ');
      expect(money.amount).toBe(10.50);
      expect(money.currency).toBe('€');
    });

    it('should throw an error for empty input', () => {
      expect(() => Money.fromString('')).toThrow('Input must be a non-empty string');
    });

    it('should throw an error for null or undefined input', () => {
      expect(() => Money.fromString(null as any)).toThrow('Input must be a non-empty string');
      expect(() => Money.fromString(undefined as any)).toThrow('Input must be a non-empty string');
    });

    it('should throw an error for unparseable amount', () => {
      expect(() => Money.fromString('abc')).toThrow('Cannot parse amount from string');
      expect(() => Money.fromString('€abc')).toThrow('Cannot parse amount from string');
    });
  });

  describe('getters', () => {
    it('should return the correct amount', () => {
      const money = Money.fromString('€10.50');
      expect(money.amount).toBe(10.50);
    });

    it('should return the correct currency', () => {
      const money = Money.fromString('$20.75');
      expect(money.currency).toBe('$');
    });
  });
});
