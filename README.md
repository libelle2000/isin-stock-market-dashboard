# ISIN Stock Market Dashboard

A web-based dashboard application for tracking and visualizing stock market data using International Securities Identification Numbers (ISINs). The application displays stock price charts with buy/sell events, allowing users to monitor their investment portfolio and market trends.

![Dashboard Screenshot](https://via.placeholder.com/800x400?text=ISIN+Stock+Market+Dashboard)

## Features

- **Stock Price Visualization**: Interactive line charts showing historical stock prices for each ISIN
- **Buy/Sell Event Tracking**: Visual indicators for buy and sell events directly on the charts
- **Event Details**: Detailed information about each buy/sell event available in a sidebar
- **Real-time Updates**: Ability to update stock data for specific ISINs with the click of a button
- **Responsive Design**: Clean, user-friendly interface that works on various screen sizes

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/:libelle2000/isin-stock-market-dashboard.git
   cd isin-stock-market-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the application:
   ```bash
   npm run build
   ```

## Usage

### Development Mode

To run the application in development mode with hot reloading:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Production Mode

To run the application in production mode:

```bash
npm start
```

### Testing

To run the test suite:

```bash
npm test
```

For continuous testing during development:

```bash
npm run test:watch
```

## Data Format

### Buy/Sell Events

The application reads buy/sell events from CSV files located in the `inputData/buySellEvents/` directory. The CSV files should have the following format:

```
TYPE,ISIN,STOCK_NAME,NOMINALE_COUNT,STOCK_PRICE,TRADING_DATE,TRADING_TIME,MARKET_VALUE,FACTOR_USD_TO_EUR,STOCK_PRICE_EUR,CAPITAL_TAX,CHURCH_TAX,SOLIDARITY_TAX,COURTAGE,STOCK_FEE,PROVISION,VARIABLE_TRANSACTION_FEE,TOTAL_COSTS,TOTAL_INCLUDING_COSTS
buy,GB0009895292,"AstraZeneca PLC Registered Shares DL -,25",12,"€130,50",2024-12-04,8:16:11,"€1.566,00",1,"€1.566,00",,,,,,"€8,82",,"€8,82","€1.574,82"
```

## Project Structure

```
isin-stock-market-dashboard/
├── inputData/                  # Input data files (CSV)
│   └── buySellEvents/          # Buy/sell event CSV files
├── src/                        # Source code
│   ├── endpoint/               # Express server endpoints
│   ├── shared/                 # Shared code and domain objects
│   │   └── domainObjects/      # Domain value objects (ISIN, Money, etc.)
│   └── stockMarket/            # Stock market related functionality
│       ├── apiProvider/        # Stock data API providers
│       ├── buySellEvents/      # Buy/sell event processing
│       ├── charts/             # Chart generation
│       └── stockData/          # Stock data processing
├── dist/                       # Compiled JavaScript (generated)
├── coverage/                   # Test coverage reports
├── package.json                # Project metadata and dependencies
└── tsconfig.json               # TypeScript configuration
```

## Technologies Used

- **Backend**:
  - Node.js
  - Express
  - TypeScript
  - Jest (testing)

- **Frontend**:
  - Chart.js (visualization)
  - Vanilla JavaScript
  - HTML/CSS

- **Data Processing**:
  - CSV Parser
  - Axios (HTTP requests)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Chart.js](https://www.chartjs.org/) for the powerful charting library
- [Express](https://expressjs.com/) for the web server framework
- [TypeScript](https://www.typescriptlang.org/) for type safety