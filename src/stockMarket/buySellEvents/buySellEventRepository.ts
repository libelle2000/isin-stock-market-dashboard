//- create a class that provides one method to get all buy and sell events (see events.ts) from ISIN-buy-sell-events.csv
//- based on the value of CSV's "TYP" column, create either an instance of buyEvent.ts or sellEvent.ts
//- raw data of all buy and sell events are stored in "inputData/buySellEvents/ISIN-buy-sell-events.csv"
//- use csvReader.ts to read CSV file based on a given path
//- for path use native NodeJS modules or a library if possible