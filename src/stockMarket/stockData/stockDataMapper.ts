import { Isin } from '../../shared/domainObjects/isin';
import { DataPoint } from './dataPoint';
import { StockData } from './stockData';
import { StockDataResponse } from '../apiProvider/stockDataSchema';

/**
 * Mapper class for converting API responses to StockData objects
 */
export class StockDataMapper {
  /**
   * Maps a raw API response to a StockData object
   * @param isin The ISIN
   * @param response The raw API response
   * @returns A new StockData instance
   * @throws Error if the response format is invalid
   */
  static fromApiResponse(isin: Isin, response: StockDataResponse): StockData {
    if (!response.instruments || response.instruments.length === 0) {
      throw new Error('Invalid API response: no instruments found');
    }

    const instrument = response.instruments[0];
    if (!instrument.data || !Array.isArray(instrument.data)) {
      throw new Error('Invalid API response: no data found');
    }

    const dataPoints = instrument.data.map(dataPoint => DataPoint.fromArray(dataPoint));
    return new StockData(isin, dataPoints);
  }
}