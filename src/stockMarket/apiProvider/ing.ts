import { ApiProvider } from './apiProvider';
import { StockDataResponse } from './stockDataSchema';

/**
 * Implementation of ApiProvider for the ING API
 */
export class Ing implements ApiProvider {
  private readonly baseUrl = 'https://component-api.wertpapiere.ing.de/api/v1/components/charttooldata';
  private readonly queryParams = 'timeRange=Maximum&exchangeId=2779&currencyId=814';

  /**
   * Fetches stock data for a given ISIN from the ING API
   * @param isin The ISIN to fetch data for
   * @returns Promise that resolves to the raw JSON response from the API
   * @throws Error if the API call fails
   * @todo use Isin value object and not string
   */
  async fetchStockData(isin: string): Promise<Record<string, any>> {
    try {
      const url = `${this.baseUrl}/${isin}?${this.queryParams}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API call failed with status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data as StockDataResponse;
    } catch (error) {
      throw new Error(`Failed to fetch stock data for ISIN ${isin}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
