import { dinero, Dinero, toDecimal, Currency } from 'dinero.js';

/**
 * Immutable value object representing a monetary amount with currency
 */
export class Money {
  private readonly _amount: Dinero<number>;

  /**
   * Creates a new Money instance
   * @param amount The amount as a number
   * @param currency The currency code (default: EUR)
   * @throws Error if the amount is invalid
   */
  constructor(amount: number, currency: string = 'EUR') {
    if (isNaN(amount)) {
      throw new Error(`Invalid amount: ${amount}`);
    }

    // Convert to cents (dinero.js works with minor units)
    const amountInCents = Math.round(amount * 100);
    
    this._amount = dinero({
      amount: amountInCents,
      currency: currency as Currency<number>,
      scale: 2
    });
  }

  /**
   * Creates a Money instance from a string representation
   * @param value The string value (e.g., "€10.50" or "10.50")
   * @param currency The currency code (default: EUR)
   * @returns A new Money instance
   * @throws Error if the string cannot be parsed
   */
  static fromString(value: string, currency: string = 'EUR'): Money {
    if (!value) {
      throw new Error('Amount string cannot be empty');
    }

    // Remove currency symbols and non-numeric characters except decimal point
    const cleanValue = value
      .replace(/[€$£¥]/g, '')
      .replace(/\s/g, '')
      .replace(/,/g, '.');

    const amount = parseFloat(cleanValue);
    
    if (isNaN(amount)) {
      throw new Error(`Cannot parse amount from string: ${value}`);
    }

    return new Money(amount, currency);
  }

  /**
   * Returns the amount as a number
   */
  get amount(): number {
    return parseFloat(toDecimal(this._amount));
  }

  /**
   * Returns the currency code
   */
  get currency(): string {
    return this._amount.toJSON().currency.code;
  }

  /**
   * Adds another Money object to this one
   * @param other The Money object to add
   * @returns A new Money object with the sum
   * @throws Error if currencies don't match
   */
  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error(`Cannot add different currencies: ${this.currency} and ${other.currency}`);
    }
    
    return new Money(this.amount + other.amount, this.currency);
  }

  /**
   * Subtracts another Money object from this one
   * @param other The Money object to subtract
   * @returns A new Money object with the difference
   * @throws Error if currencies don't match
   */
  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error(`Cannot subtract different currencies: ${this.currency} and ${other.currency}`);
    }
    
    return new Money(this.amount - other.amount, this.currency);
  }

  /**
   * Multiplies this Money object by a factor
   * @param factor The multiplication factor
   * @returns A new Money object with the product
   */
  multiply(factor: number): Money {
    if (isNaN(factor)) {
      throw new Error(`Invalid multiplication factor: ${factor}`);
    }
    
    return new Money(this.amount * factor, this.currency);
  }

  /**
   * Checks if this Money equals another Money
   * @param other The other Money to compare with
   * @returns true if the Money objects are equal, false otherwise
   */
  equals(other: Money): boolean {
    if (!(other instanceof Money)) {
      return false;
    }
    
    return this.amount === other.amount && this.currency === other.currency;
  }

  /**
   * Returns the string representation of the Money
   */
  toString(): string {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }
}