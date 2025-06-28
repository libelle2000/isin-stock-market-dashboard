import { Isin } from '../shared/domainObjects/isin';
import { IsinEvents } from './buySellEvents/isin/isinEvents';
import { StockData } from './stockData/stockData';
import { DataPoint } from './stockData/dataPoint';
import { Chart } from './charts/chart';
import { Charts } from './charts';
import {Currency, Money} from "../shared/domainObjects/money";

describe('Charts', () => {
  let chart1: Chart;
  let chart2: Chart;
  let charts: Charts;
  
  beforeEach(() => {
    // Create ISINs
    const isin1 = new Isin('LU2090063327');
    const isin2 = new Isin('GB0009895292');
    
    // Create StockData objects
    const stockData1 = new StockData(isin1, [
      new DataPoint(new Date(1594245600000), new Money(25.75, Currency.EUR)),
      new DataPoint(new Date(1594332000000), new Money(29.875, Currency.EUR)),
      new DataPoint(new Date(1594591200000), new Money(30.24, Currency.EUR))
    ]);
    
    const stockData2 = new StockData(isin2, [
      new DataPoint(new Date(1594245600000), new Money(34.75, Currency.EUR)),
      new DataPoint(new Date(1594332000000), new Money(35.56, Currency.EUR)),
      new DataPoint(new Date(1594591200000), new Money(34.25, Currency.EUR))
    ]);
    
    // Create IsinEvents objects
    const isinEvents1 = { isin: isin1 } as unknown as IsinEvents;
    const isinEvents2 = { isin: isin2 } as unknown as IsinEvents;
    
    // Create Chart objects
    chart1 = new Chart(stockData1, isinEvents1);
    chart2 = new Chart(stockData2, isinEvents2);
    
    // Create Charts collection
    charts = new Charts([chart1, chart2]);
  });
  
  it('should create a Charts collection', () => {
    expect(charts.count).toBe(2);
    expect(charts.all).toHaveLength(2);
    expect(charts.all[0]).toBe(chart1);
    expect(charts.all[1]).toBe(chart2);
  });
  
  it('should return all ISINs', () => {
    const isins = charts.isins;
    
    expect(isins).toHaveLength(2);
    expect(isins[0].value).toBe('LU2090063327');
    expect(isins[1].value).toBe('GB0009895292');
  });
  
  it('should get a chart by ISIN', () => {
    const isin1 = new Isin('LU2090063327');
    const isin2 = new Isin('GB0009895292');
    const nonExistentIsin = new Isin('US0378331005');
    
    expect(charts.getByIsin(isin1)).toBe(chart1);
    expect(charts.getByIsin(isin2)).toBe(chart2);
    expect(charts.getByIsin(nonExistentIsin)).toBeUndefined();
    
    // Test with string ISIN
    expect(charts.getByIsin('LU2090063327')).toBe(chart1);
    expect(charts.getByIsin('GB0009895292')).toBe(chart2);
    expect(charts.getByIsin('US0378331005')).toBeUndefined();
  });
  
  it('should check if a chart exists for a given ISIN', () => {
    const isin1 = new Isin('LU2090063327');
    const isin2 = new Isin('GB0009895292');
    const nonExistentIsin = new Isin('US0378331005');
    
    expect(charts.hasIsin(isin1)).toBe(true);
    expect(charts.hasIsin(isin2)).toBe(true);
    expect(charts.hasIsin(nonExistentIsin)).toBe(false);
    
    // Test with string ISIN
    expect(charts.hasIsin('LU2090063327')).toBe(true);
    expect(charts.hasIsin('GB0009895292')).toBe(true);
    expect(charts.hasIsin('US0378331005')).toBe(false);
  });
  
  it('should be iterable', () => {
    const iteratedCharts: Chart[] = [];
    
    for (const chart of charts) {
      iteratedCharts.push(chart);
    }
    
    expect(iteratedCharts).toHaveLength(2);
    expect(iteratedCharts[0]).toBe(chart1);
    expect(iteratedCharts[1]).toBe(chart2);
  });
  
  it('should create an empty collection', () => {
    const emptyCharts = new Charts([]);
    
    expect(emptyCharts.count).toBe(0);
    expect(emptyCharts.all).toHaveLength(0);
    expect(emptyCharts.isins).toHaveLength(0);
    
    // Iteration should work with empty collection
    const iteratedCharts: Chart[] = [];
    for (const chart of emptyCharts) {
      iteratedCharts.push(chart);
    }
    expect(iteratedCharts).toHaveLength(0);
  });
});