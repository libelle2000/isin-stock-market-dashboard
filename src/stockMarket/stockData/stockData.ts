//- create an immutable value object represents the whole stock data over time for a single ISIN
//- internally store immutable value objects:
//  1. ISIN
//  2. stock data points, which is an immutable collection of DataPoint objects (dataPoint.ts)

//- implement it as class so there can be getters later on