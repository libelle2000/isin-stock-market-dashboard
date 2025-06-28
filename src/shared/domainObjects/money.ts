/**
 * Simple money class for parsing and representing monetary values
 */
export class Money {
  private readonly _amount: number;
  private readonly _currency: string;

  /**
   * Creates a new Money instance by parsing a string
   * @param value The string to parse (e.g., "€10.50", "$20", "15,75€")
   * @throws Error if the string cannot be parsed
   */
  constructor(value: string | number, currency: string = 'EUR') {
    // Handle number input
    if (typeof value === 'number') {
      if (isNaN(value)) {
        throw new Error(`Invalid amount: ${value}`);
      }
      this._amount = value;
      this._currency = currency;
      return;
    }

    // Handle string input
    if (!value || typeof value !== 'string') {
      throw new Error('Input must be a non-empty string');
    }

    // Detect currency symbol
    this._currency = 'EUR'; // Default currency
    if (value.includes('$')) {
      this._currency = 'USD';
    } else if (value.includes('€')) {
      this._currency = 'EUR';
    }

    // Remove currency symbols and whitespace
    let cleanValue = value
        .replace(/[€$]/g, '')
        .replace(/\s/g, '');

    // Handle European number format (comma as decimal separator)
    if (cleanValue.includes(',') && cleanValue.includes('.')) {
      // European format with thousands separator (e.g., 1.234,56)
      cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
    } else if (cleanValue.includes(',')) {
      // Simple comma as decimal separator
      cleanValue = cleanValue.replace(',', '.');
    }

    // Parse to number
    const amount = parseFloat(cleanValue);

    if (isNaN(amount)) {
      throw new Error(`Cannot parse amount from string: ${value}`);
    }

    this._amount = amount;
  }

  /**
   * Returns the numeric amount
   */
  get amount(): number {
    return this._amount;
  }

  /**
   * Returns the currency code (e.g., 'EUR', 'USD')
   */
  get currency(): string {
    return this._currency;
  }

  /**
   * Creates a Money instance from a string representation
   * @param value The string to parse (e.g., "€10.50", "$20", "15,75€")
   * @returns A new Money instance
   * @throws Error if the string cannot be parsed
   */
  static fromString(value: string): Money {
    return new Money(value);
  }
}
