import { Isin } from '../../isin';
import { IsinEvents } from '../buySellEvents/isin/isinEvents';
import { StockData } from '../stockData/stockData';
import { DataPoint } from '../stockData/dataPoint';
import { Chart } from './chart';
import {Currency, Money} from "../../money";
import {BuyEvent} from "../buySellEvents/isin/event/buyEvent";
import {SellEvent} from "../buySellEvents/isin/event/sellEvent";
import {EventData} from "../buySellEvents/isin/event/event";

describe('Chart', () => {
  const isin = new Isin('GB0009895292');
  let stockData: StockData;
  let isinEvents: IsinEvents;

  beforeEach(() => {
    // Create real DataPoint objects
    const dataPoints = [
      new DataPoint(new Date(1594245600000), new Money(25.75, Currency.EUR)),
      new DataPoint(new Date(1594332000000), new Money(29.875, Currency.EUR)),
      new DataPoint(new Date(1594591200000), new Money(30.24, Currency.EUR))
    ];

    // Create a real StockData object
    stockData = new StockData(isin, dataPoints);

    const buyEventData: EventData = {
      TYPE: 'buy',
      ISIN: 'GB0009895292',
      STOCK_NAME: 'AstraZeneca PLC',
      NOMINALE_COUNT: '12',
      STOCK_PRICE: '€130,50',
      TRADING_DATE: '2024-12-04',
      TRADING_TIME: '8:16:11',
      MARKET_VALUE: '€1.566,00',
      FACTOR_USD_TO_EUR: '1',
      STOCK_PRICE_EUR: '€1.566,00',
      CAPITAL_TAX: '',
      CHURCH_TAX: '',
      SOLIDARITY_TAX: '',
      COURTAGE: '',
      STOCK_FEE: '',
      PROVISION: '€8,82',
      VARIABLE_TRANSACTION_FEE: '',
      TOTAL_COSTS: '€8,82',
      TOTAL_INCLUDING_COSTS: '€1.574,82'
    };

    const sellEventData: EventData = {
      ...buyEventData,
      TYPE: 'sell'
    };


    // Mock IsinEvents
    isinEvents = new IsinEvents(
        isin,
        [
          new BuyEvent(buyEventData),
          new SellEvent(sellEventData),
        ]
    );
  });

  it('should create a Chart instance', () => {
    const chart = new Chart(stockData, isinEvents);

    expect(chart.isin).toBe(isin);
    expect(chart.stockData).toBe(stockData);
    expect(chart.isinEvents).toBe(isinEvents);
  });

  it('should throw an error when ISINs do not match', () => {
    const differentIsin = new Isin('LU2090063327');
    const differentStockData = new StockData(differentIsin, [
      new DataPoint(new Date(1594245600000), new Money(25.75, Currency.EUR)),
    ]);

    expect(() => new Chart(differentStockData, isinEvents)).toThrow(
      `ISIN mismatch: LU2090063327 != GB0009895292`
    );
  });

  it('should return the latest price', () => {
    const chart = new Chart(stockData, isinEvents);

    expect(chart.latestPrice).toBe(30.24);
  });

  it('should return the earliest price', () => {
    const chart = new Chart(stockData, isinEvents);

    expect(chart.earliestPrice).toBe(25.75);
  });

  it('should throw when getting latest price with no data points', () => {
    // Create a StockData with no data points
    const emptyStockData = new StockData(isin, []);
    const chart = new Chart(emptyStockData, isinEvents);

    expect(() => chart.latestPrice).toThrow('No data points available');
  });

  it('should throw when getting earliest price with no data points', () => {
    // Create a StockData with no data points
    const emptyStockData = new StockData(isin, []);
    const chart = new Chart(emptyStockData, isinEvents);

    expect(() => chart.earliestPrice).toThrow('No data points available');
  });
  
    it('should convert to JSON', () => {
      const chart = new Chart(stockData, isinEvents);
      const json = chart.toJSON();
  
      expect(json.isin).toBeDefined();
      expect(json.stockData).toBeDefined();
      expect(json.isinEvents).toBeDefined();
      expect(json.latestPrice).toBeDefined();
      expect(json.earliestPrice).toBeDefined();
      expect(json.lowestTotalPriceIncludingCosts).toBeDefined();
      expect(json.highestTotalPriceIncludingCosts).toBeDefined();
    });
});
