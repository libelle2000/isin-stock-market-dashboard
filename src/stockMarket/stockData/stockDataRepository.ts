import path from 'path';
import { Isin } from '../../shared/domainObjects/isin';
import { JsonReader } from '../../shared/json/jsonReader';
import { JsonWriter } from '../../shared/json/jsonWriter';
import { StockData } from './stockData';
import { StockDataResponse, StockDataSchema } from '../apiProvider/stockDataSchema';

/**
 * Repository for stock data
 */
export class StockDataRepository {
  private static readonly CACHE_DIR = path.join('inputData', 'stockData', 'cache');

  /**
   * Gets the file path for a given ISIN
   * @param isin The ISIN
   * @returns The file path
   */
  private static getFilePath(isin: Isin): string {
    return path.join(this.CACHE_DIR, `${isin.value}.json`);
  }

  /**
   * Gets stock data for a given ISIN from the cache
   * @param isin The ISIN
   * @returns Promise that resolves to a StockData object, or null if not found
   * @throws Error if the file cannot be read or parsed
   */
  static async getStockDataByIsin(isin: Isin): Promise<StockData | null> {
    try {
      const filePath = this.getFilePath(isin);
      const data = await JsonReader.readJson<StockDataResponse>(filePath);

      // Validate the data against the schema
      StockDataSchema.validate(data);

      // Create a StockData object from the data
      return StockData.fromApiResponse(isin, data);
    } catch (error) {
      // If the file doesn't exist, return null
      if (error instanceof Error && error.message.includes('File not found')) {
        return null;
      }

      // Otherwise, rethrow the error
      throw error;
    }
  }

  /**
   * Updates stock data for a given ISIN in the cache
   * @param isin The ISIN
   * @param data The stock data
   * @returns Promise that resolves when the data has been written
   * @throws Error if the data is invalid or cannot be written
   */
  static async updateStockDataByIsin(isin: Isin, data: StockDataResponse): Promise<void> {
    // Validate the data against the schema
    StockDataSchema.validate(data);

    // Write the data to the cache
    const filePath = this.getFilePath(isin);
    await JsonWriter.writeJson(filePath, data);
  }
}
