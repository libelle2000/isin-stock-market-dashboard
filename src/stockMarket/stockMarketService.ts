import { Isin } from '../shared/domainObjects/isin';
import { ApiProvider } from './apiProvider/apiProvider';
import { Ing } from './apiProvider/ing';
import { StockDataSchema } from './apiProvider/stockDataSchema';
import { BuySellEventRepository } from './buySellEvents/buySellEventRepository';
import { Chart } from '../shared/domainObjects/stockMarket/charts/chart';
import { Charts } from '../shared/domainObjects/stockMarket/charts';
import { StockDataRepository } from './stockData/stockDataRepository';

/**
 * Service for managing stock market data and charts
 */
export class StockMarketService {
  private readonly apiProvider: ApiProvider;

  /**
   * Creates a new StockMarketService instance
   * @param apiProvider The API provider to use (defaults to Ing)
   */
  constructor(apiProvider: ApiProvider = new Ing()) {
    this.apiProvider = apiProvider;
  }

  /**
   * Gets all charts for all ISINs
   * @returns Promise that resolves to a Charts collection
   * @throws Error if there's an error fetching data
   */
  async getAllCharts(): Promise<Charts> {
    try {
      // 1. Get all buy and sell events
      const events = await BuySellEventRepository.getAllEvents();

      // 2. Iterate over all ISINs
      const charts: Chart[] = [];
      for (const isin of events.isins) {
        try {
          // 3. Get stock data for the ISIN
          let stockData = await StockDataRepository.getStockDataByIsin(isin);

          // 4. If stock data is not available, fetch it from the API
          if (!stockData) {
            try {
              await this.fetchStockDataByIsin(isin);
            } catch (e) {
                console.error(`Error fetching stock data for ISIN ${isin.value}: ${e instanceof Error ? e.message : String(e)}`);
                continue; // Skip this ISIN if fetching fails
            }
            stockData = await StockDataRepository.getStockDataByIsin(isin);

            // If still null after fetching, skip this ISIN
            if (!stockData) {
              console.error(`Failed to fetch stock data for ISIN ${isin.value}`);
              continue;
            }
          }

          // 5. Create a chart and add it to the collection
          const isinEvents = events.getByIsin(isin);
          if (isinEvents) {
            charts.push(new Chart(stockData, isinEvents));
          }
        } catch (error) {
          console.error(`Error processing ISIN ${isin.value}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }

      return new Charts(charts);
    } catch (error) {
      throw new Error(`Error getting charts: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Fetches stock data for a given ISIN from the API and updates the cache
   * @param isin The ISIN to fetch data for
   * @returns Promise that resolves when the data has been fetched and cached
   * @throws Error if there's an error fetching or caching the data
   */
  async fetchStockDataByIsin(isin: Isin): Promise<void> {
    try {
      // 4.1 Fetch stock data from the API
      const data = await this.apiProvider.fetchStockData(isin);

      // 4.2 Validate the data against the schema
      StockDataSchema.validate(data);

      // 4.3 Update the cache
      await StockDataRepository.updateStockDataByIsin(isin, data);
    } catch (error) {
      throw new Error(`Error fetching stock data for ISIN ${isin.value}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
