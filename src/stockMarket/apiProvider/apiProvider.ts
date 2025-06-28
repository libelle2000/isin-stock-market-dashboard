/**
 * Interface for API providers that fetch stock data
 */
export interface ApiProvider {
  /**
   * Fetches stock data for a given ISIN
   * @param isin The ISIN to fetch data for
   * @returns Promise that resolves to the raw JSON response from the API
   * @throws Error if the API call fails
   */
  fetchStockData(isin: string): Promise<Record<string, any>>;
}
