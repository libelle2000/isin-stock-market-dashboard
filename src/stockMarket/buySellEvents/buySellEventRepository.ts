import path from 'path';
import { CsvReader } from '../../shared/csv/csvReader';
import { Events } from './events';
import { IsinEvents } from './isin/isinEvents';
import { Event, EventData, EventType } from './isin/event/event';
import { BuyEvent } from './isin/event/buyEvent';
import { SellEvent } from './isin/event/sellEvent';
import { Isin } from '../../shared/domainObjects/isin';

/**
 * Repository for buy and sell events
 */
export class BuySellEventRepository {
  private static readonly DEFAULT_CSV_PATH = path.join('inputData', 'buySellEvents', 'ISIN-buy-sell-events.csv');

  /**
   * Gets all buy and sell events from the CSV file
   * @param csvPath Optional path to the CSV file (default: inputData/buySellEvents/ISIN-buy-sell-events.csv)
   * @returns Promise that resolves to an Events collection
   * @throws Error if the CSV file cannot be read or parsed
   */
  static async getAllEvents(csvPath: string = BuySellEventRepository.DEFAULT_CSV_PATH): Promise<Events> {
    try {
      // Read the CSV file
      const rawEvents = await CsvReader.readCsv<Record<string, string>>(csvPath);

      // Convert raw events to Event objects
      const events: Event[] = [];
      for (const rawEvent of rawEvents) {
        try {
          // Convert to EventData format
          const eventData: EventData = this.convertToEventData(rawEvent);

          // Create the appropriate event type
          if (eventData.TYPE === EventType.BUY) {
            events.push(new BuyEvent(eventData));
          } else if (eventData.TYPE === EventType.SELL) {
            events.push(new SellEvent(eventData));
          } else {
            console.warn(`Unknown event type: ${eventData.TYPE}, skipping`);
          }
        } catch (error) {
          console.error(`Error creating event: ${error instanceof Error ? error.message : String(error)}`);
        }
      }

      // Group events by ISIN
      const isinEventsMap = new Map<string, Event[]>();
      for (const event of events) {
        const isinValue = event.isin.value;
        if (!isinEventsMap.has(isinValue)) {
          isinEventsMap.set(isinValue, []);
        }
        isinEventsMap.get(isinValue)!.push(event);
      }

      // Create IsinEvents objects
      const isinEvents: IsinEvents[] = [];
      for (const [isinValue, isinEventsList] of isinEventsMap.entries()) {
        try {
          const isin = new Isin(isinValue);
          isinEvents.push(new IsinEvents(isin, isinEventsList));
        } catch (error) {
          console.error(`Error creating IsinEvents for ${isinValue}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }

      // Create and return Events collection
      return new Events(isinEvents);
    } catch (error) {
      throw new Error(`Error reading buy/sell events: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Converts a raw CSV record to EventData format
   * @param rawEvent The raw CSV record
   * @returns EventData object
   */
  private static convertToEventData(rawEvent: Record<string, string>): EventData {
    // Map CSV column names to EventData properties
    // The CSV might have different column names than our EventData interface
    const eventData: EventData = {
      TYPE: rawEvent.TYPE || '',
      ISIN: rawEvent.ISIN || '',
      STOCK_NAME: rawEvent.STOCK_NAME || '',
      NOMINALE_COUNT: rawEvent.NOMINALE_COUNT || '',
      STOCK_PRICE: rawEvent.STOCK_PRICE || '',
      TRADING_DATE: rawEvent.TRADING_DATE || '',
      TRADING_TIME: rawEvent.TRADING_TIME || '',
      MARKET_VALUE: rawEvent.MARKET_VALUE || '',
      FACTOR_USD_TO_EUR: rawEvent.FACTOR_USD_TO_EUR || '',
      STOCK_PRICE_EUR: rawEvent.STOCK_PRICE_EUR || '',
      CAPITAL_TAX: rawEvent.CAPITAL_TAX || '',
      CHURCH_TAX: rawEvent.CHURCH_TAX || '',
      SOLIDARITY_TAX: rawEvent.SOLIDARITY_TAX || '',
      COURTAGE: rawEvent.COURTAGE || '',
      STOCK_FEE: rawEvent.STOCK_FEE || '',
      PROVISION: rawEvent.PROVISION || '',
      VARIABLE_TRANSACTION_FEE: rawEvent.VARIABLE_TRANSACTION_FEE || '',
      TOTAL_COSTS: rawEvent.TOTAL_COSTS || '',
      TOTAL_INCLUDING_COSTS: rawEvent.TOTAL_INCLUDING_COSTS || ''
    };

    return eventData;
  }
}
