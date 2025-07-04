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

    it('should throw an error for a string without currency symbol', () => {
      expect(() => Money.fromString('30.25')).toThrow('Currency symbol not found in input string');
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
      expect(() => Money.fromString('abc')).toThrow('Currency symbol not found in input string');
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
  
  describe('comparison methods', () => {
    it('should return true if amount is less than other', () => {
      const a = new Money(5, Currency.EUR);
      const b = new Money(10, Currency.EUR);
      expect(a.isLessThan(b)).toBe(true);
      expect(b.isLessThan(a)).toBe(false);
    });
  
    it('should return true if amount is greater than other', () => {
      const a = new Money(15, Currency.USD);
      const b = new Money(10, Currency.USD);
      expect(a.isGreaterThan(b)).toBe(true);
      expect(b.isGreaterThan(a)).toBe(false);
    });
  
    it('should return false if amounts are equal', () => {
      const a = new Money(20, Currency.EUR);
      const b = new Money(20, Currency.EUR);
      expect(a.isLessThan(b)).toBe(false);
      expect(a.isGreaterThan(b)).toBe(false);
    });

    it('should throw and error if currencies are not equal', () => {
        const a = new Money(10, Currency.EUR);
        const b = new Money(10, Currency.USD);
        expect(() => a.isLessThan(b)).toThrow('Cannot compare Money objects with different currencies: € vs $');
        expect(() => a.isGreaterThan(b)).toThrow('Cannot compare Money objects with different currencies: € vs $');
    });
  });

  describe('toJSON', () => {
    it('should return a JSON-serializable object with amount and currency', () => {
      const money = new Money(10.50, Currency.EUR);
      const json = money.toJSON();

      expect(json).toEqual({
        amount: 10.50,
        currency: '€'
      });

      // Verify it can be properly serialized
      const serialized = JSON.stringify(money);
      const parsed = JSON.parse(serialized);

      expect(parsed).toEqual({
        amount: 10.50,
        currency: '€'
      });
    });

    it('should work with USD currency', () => {
      const money = new Money(20.75, Currency.USD);
      const json = money.toJSON();

      expect(json).toEqual({
        amount: 20.75,
        currency: '$'
      });
    });
  });
});
