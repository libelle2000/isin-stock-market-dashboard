//- create an immutable parent class to be inherited by buyEvent.ts and sellEvent.ts
//- define getter for columns of ISIN-buy-sell-events.csv:
//-- TYPE
//-- ISIN
//-- NOMINALE_COUNT
//-- STOCK_PRICE (use an object provided by a money library to store currency and amount separately)
//-- TRADING_DATE / TRADING_TIME (combine in a native NodeJs datetime object)
//-- TOTAL_INCLUDING_COSTS (use an object provided by a money library to store currency and amount separately)