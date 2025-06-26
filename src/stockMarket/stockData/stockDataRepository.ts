//This class provides two methods.
//1. getStockDataByIsin(): Retrieves stock data for a given ISIN from the cache.
//2. updateStockDataByIsin(): Updates stock data for a given ISIN in the cache. If cache is not found, it will create a new file.
//   (it gets the raw JSON data as object which is validated against a JSON schema before writing to file system)

//use TypeScript classes to represent stock data (see stockData.ts) and ISIN (see isin.ts)

//all stock data is stored in "inputData/stockData/cache", file name is the ISIN

//use jsonReader.ts and jsonWriter.ts to read and write JSON files based on a given path

//for path use a proper object and not just a string