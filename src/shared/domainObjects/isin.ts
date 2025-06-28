/**
 * Immutable value object representing an International Securities Identification Number (ISIN)
 * 
 * ISINs are 12-character alphanumeric codes that uniquely identify a security.
 * Format: 2-letter country code + 9-character alphanumeric identifier + check digit
 */
export class Isin {
  private readonly _value: string;

  /**
   * Creates a new ISIN instance
   * @param value The ISIN string value
   * @throws Error if the ISIN format is invalid
   */
  constructor(value: string) {
    if (!Isin.isValid(value)) {
      throw new Error(`Invalid ISIN format: ${value}`);
    }
    this._value = value;
  }

  /**
   * Returns the string value of the ISIN
   */
  get value(): string {
    return this._value;
  }

  /**
   * Validates the ISIN format
   * @param value The ISIN string to validate
   * @returns true if the ISIN is valid, false otherwise
   */
  static isValid(value: string): boolean {
    if (!value || typeof value !== 'string') {
      return false;
    }

    // ISIN must be 12 characters
    if (value.length !== 12) {
      return false;
    }

    // First two characters must be letters (country code)
    if (!/^[A-Z]{2}/.test(value)) {
      return false;
    }

    // Remaining characters must be alphanumeric
    if (!/^[A-Z]{2}[A-Z0-9]{10}$/.test(value)) {
      return false;
    }

    return true;
  }

  /**
   * Checks if this ISIN equals another ISIN
   * @param other The other ISIN to compare with
   * @returns true if the ISINs are equal, false otherwise
   */
  equals(other: Isin): boolean {
    if (!(other instanceof Isin)) {
      return false;
    }
    return this._value === other.value;
  }
}
