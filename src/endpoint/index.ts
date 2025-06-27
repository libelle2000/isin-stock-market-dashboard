//- create an entry point for the application
//- it calls the chartsService.ts to get all charts
//- it iterates over all charts and displays them on a HTML page with a nice chart library

//- it renders one chart per ISIN

//- on each chart:
//- create buy/sell markers:
//    - Buy → blue upward bar starting from "STOCK_PRICE" (see interface event.ts)
//    - Sell → red downward bar starting from "STOCK_PRICE" (see interface event.ts)
//    - Bar height = "TOTAL_INCLUDING_COSTS" (see interface event.ts)
//    - On hover, shows all metadata of interface event.ts in a sidebar
//- at each chart:
//-- add an "Update" button to fetch latest stock data from API (call to updateIsinStockData.ts)
//-- once the update is done (HTTP 200 OK), the button should change to "Updated" and be disabled
//-- in case of an error, the button should change to "Error" and be disabled, error message should be displayed in the console