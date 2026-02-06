import { ApiProvider } from './apiProvider';
import { StockDataResponse } from './stockDataSchema';
import {Isin} from "../../shared/domainObjects/isin";

/**
 * Implementation of ApiProvider for the ING API
 */
export class Ing implements ApiProvider {
  private readonly baseUrl = 'https://component-api.wertpapiere.ing.de/api/v1/charts/charttooldata';
  private readonly queryParams = 'timeRange=Maximum&exchangeId=2779&exchangeCode=TGT&currencyId=814';

  private readonly queryParamsByIsin: Record<string, string> = {
    'DE000A12BSB8': 'timeRange=Maximum&exchangeId=1330&exchangeCode=BMN&currencyId=814',
    'LU2145461757': 'timeRange=Maximum&exchangeId=1330&exchangeCode=BMN&currencyId=814',
  }
  /**
   * Fetches stock data for a given ISIN from the ING API
   * @param isin The ISIN to fetch data for
   * @returns Promise that resolves to the raw JSON response from the API
   * @throws Error if the API call fails
   */
  async fetchStockData(isin: Isin): Promise<Record<string, any>> {
    try {
      const url = `${this.baseUrl}/${isin.value}?${this.getQueryParamaters(isin)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API call failed with status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data as StockDataResponse;
    } catch (error) {
      throw new Error(`Failed to fetch stock data for ISIN ${isin.value}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private getQueryParamaters(isin: Isin): string {
    return this.queryParamsByIsin[isin.value] ?? this.queryParams;
  }
}
