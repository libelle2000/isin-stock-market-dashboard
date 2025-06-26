//this TS class calls the ING API to get stock data for a given ISIN
// endpoint is: https://component-api.wertpapiere.ing.de/api/v1/components/charttooldata/LU2090063327?timeRange=Maximum&exchangeId=2779&currencyId=814
// (LU2090063327 is the ISIN and must be replaced with the actual ISIN)
// it returns the raw JSON response from the API