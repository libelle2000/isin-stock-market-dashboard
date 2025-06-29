/**
 * Immutable value object representing an International Securities Identification Number (ISIN)
 * 
 * ISINs are 12-character alphanumeric codes that uniquely identify a security.
 * Format: 2-letter country code + 9-character alphanumeric identifier + check digit
 */
import { JsonSerializable } from '../jsonSerializable';

export class Isin implements JsonSerializable {
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
    if (!value) {
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
    return /^[A-Z]{2}[A-Z0-9]{10}$/.test(value);
  }

  /**
   * Checks if this ISIN equals another ISIN
   * @param other The other ISIN to compare with
   * @returns true if the ISINs are equal, false otherwise
   */
  equals(other: Isin): boolean {
    return this._value === other.value;
  }

  /**
   * Converts the ISIN to a JSON-serializable representation
   * @returns A plain object with the ISIN value
   */
  toJSON(): Record<string, any> {
    return {
      value: this._value
    };
  }
}
