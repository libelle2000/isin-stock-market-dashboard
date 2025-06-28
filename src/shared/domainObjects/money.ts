/**
 * Currency enum for representing different currencies
 */
export enum Currency {
  EUR = '€',
  USD = '$'
}

/**
 * Simple money class for representing monetary values
 */
export class Money {
  private readonly _amount: number;
  private readonly _currency: Currency;

  /**
   * Creates a new Money instance
   * @param amount The numeric amount
   * @param currency The currency enum value
   * @throws Error if the amount is invalid
   */
  constructor(amount: number, currency: Currency) {
    if (isNaN(amount)) {
      throw new Error(`Invalid amount: ${amount}`);
    }
    this._amount = amount;
    this._currency = currency;
  }

  /**
   * Returns the numeric amount
   */
  get amount(): number {
    return this._amount;
  }

  /**
   * Returns the currency symbol
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
    if (!value || typeof value !== 'string') {
      throw new Error('Input must be a non-empty string');
    }

    // Detect currency symbol
    let currency = Currency.EUR; // Default currency
    if (value.includes('$')) {
      currency = Currency.USD;
    } else if (value.includes('€')) {
      currency = Currency.EUR;
    } else {
      //@todo throw error
    }

    // Create a regex pattern from all currency symbols in the enum
    const currencySymbols = Object.values(Currency).join('');
    const currencyRegex = new RegExp(`[${currencySymbols}]`, 'g');

    // Remove currency symbols and whitespace
    let cleanValue = value
        .replace(currencyRegex, '')
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

    return new Money(amount, currency);
  }
}
