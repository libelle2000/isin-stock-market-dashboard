import Ajv, { JSONSchemaType } from 'ajv';

/**
 * Interface representing the structure of stock data from the API
 */
export interface StockDataResponse {
  instruments: Array<{
    keys: string[];
    data: Array<[number, number]>;
    identifier: string;
    currentTimezoneOffset: string;
    timeRange: string;
  }>;
  indicators?: any[];
}

/**
 * JSON schema for validating stock data from the API
 */
export const stockDataSchema: JSONSchemaType<StockDataResponse> = {
  type: 'object',
  required: ['instruments'],
  properties: {
    instruments: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['keys', 'data', 'identifier', 'currentTimezoneOffset', 'timeRange'],
        properties: {
          keys: {
            type: 'array',
            minItems: 2,
            maxItems: 2,
            items: { type: 'string' }
          },
          data: {
            type: 'array',
            items: {
              type: 'array',
              minItems: 2,
              maxItems: 2,
              items: [
                { type: 'number' }, // timestamp
                { type: 'number' }  // price
              ]
            }
          },
          identifier: { type: 'string' },
          currentTimezoneOffset: { type: 'string' },
          timeRange: { type: 'string' }
        },
        additionalProperties: true
      }
    },
    indicators: {
      type: 'array',
      nullable: true,
      items: { type: 'object', additionalProperties: true }
    }
  },
  additionalProperties: false
};

/**
 * Class for validating stock data against the schema
 */
export class StockDataSchema {
  private static ajv = new Ajv();
  //@todo: fix this
  private static validate = StockDataSchema.ajv.compile(stockDataSchema);

  /**
   * Validates stock data against the schema
   * @param data The data to validate
   * @returns true if the data is valid, false otherwise
   */
  static isValid(data: unknown): data is StockDataResponse {
    return this.validate(data);
  }

  /**
   * Validates stock data against the schema and throws an error if invalid
   * @param data The data to validate
   * @throws Error if the data is invalid
   */
  static validate(data: unknown): asserts data is StockDataResponse {
    if (!this.isValid(data)) {
      throw new Error(`Invalid stock data: ${JSON.stringify(this.validate.errors)}`);
    }
  }
}
