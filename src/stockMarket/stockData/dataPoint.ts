//- create an immutable value object that represents a single data point in the stock data. e.g.:
// ```
// [
//     1594245600000.0,
//     30.275
// ],
// ```
//- use immutable value objects for the two values:
// 1. unix timestamp
// 2. stock price (use an external Money library) 
// 2.1 amount
// 2.2 currency (always EUR at the moment)