import { Isin } from './isin';

describe('Isin', () => {
  describe('constructor', () => {
    it('should create a valid ISIN', () => {
      const isin = new Isin('GB0009895292');
      expect(isin.value).toBe('GB0009895292');
    });

    it('should throw an error for invalid ISIN format', () => {
      expect(() => new Isin('')).toThrow('Invalid ISIN format');
      expect(() => new Isin('123')).toThrow('Invalid ISIN format');
      expect(() => new Isin('INVALIDFORMAT')).toThrow('Invalid ISIN format');
      expect(() => new Isin('123456789012')).toThrow('Invalid ISIN format');
      expect(() => new Isin('G!0009895292')).toThrow('Invalid ISIN format');
    });
  });

  describe('isValid', () => {
    it('should return true for valid ISINs', () => {
      expect(Isin.isValid('GB0009895292')).toBe(true);
      expect(Isin.isValid('LU2090063327')).toBe(true);
      expect(Isin.isValid('US0378331005')).toBe(true);
    });

    it('should return false for invalid ISINs', () => {
      expect(Isin.isValid('')).toBe(false);
      expect(Isin.isValid('123')).toBe(false);
      expect(Isin.isValid('INVALIDFORMAT')).toBe(false);
      expect(Isin.isValid('123456789012')).toBe(false);
      expect(Isin.isValid('G!0009895292')).toBe(false);
      expect(Isin.isValid(null as any)).toBe(false);
      expect(Isin.isValid(undefined as any)).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true for equal ISINs', () => {
      const isin1 = new Isin('GB0009895292');
      const isin2 = new Isin('GB0009895292');
      expect(isin1.equals(isin2)).toBe(true);
    });

    it('should return false for different ISINs', () => {
      const isin1 = new Isin('GB0009895292');
      const isin2 = new Isin('LU2090063327');
      expect(isin1.equals(isin2)).toBe(false);
    });

    it('should return false for non-ISIN objects', () => {
      const isin = new Isin('GB0009895292');
      expect(isin.equals('GB0009895292' as any)).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('should return a JSON-serializable object with the ISIN value', () => {
      const isin = new Isin('GB0009895292');
      const json = isin.toJSON();

      expect(json).toEqual({
        value: 'GB0009895292'
      });

      // Verify it can be properly serialized
      const serialized = JSON.stringify(isin);
      const parsed = JSON.parse(serialized);

      expect(parsed).toEqual({
        value: 'GB0009895292'
      });
    });
  });
});
