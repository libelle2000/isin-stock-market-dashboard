//this class is a TypeScript class with one method that does following:
//1. it calls buySellEventRepository.ts to get all buy and sell events
//2. it iterates over all isin
//3. for each isin, it calls stockDataRepository.ts to get stock data for the isin
//4. if stock data is not available, it calls ing.ts (interface apiProvider.ts) to fetch stock data from the API and calls updateStockDataByIsin() of the stockDataRepository.ts with the new data
//5. if stock data is available, it creates a chart.ts object and adds it to the charts.ts collection

// it has a second method "fetchStockDataByIsin()" with isin.ts as argument to just do step 4 from above:
// it calls ing.ts (interface apiProvider.ts) to fetch stock data from the API and calls updateStockDataByIsin() of the stockDataRepository.ts with the new data