import express from 'express';
import path from 'path';
import { StockMarketService } from '../stockMarket/stockMarketService';
import { updateIsinStockDataRouter } from './updateIsinStockData';

// Create Express application
const app = express();
const port = process.env.PORT || 3000;

// Configure middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create StockMarketService instance
const stockMarketService = new StockMarketService();

// Register routes
app.use('/api', updateIsinStockDataRouter);

// Main HTML page endpoint
app.get('/', async (req, res) => {
  try {
    // Get all charts
    const charts = await stockMarketService.getAllCharts();

    // Generate HTML
    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ISIN Stock Market Dashboard</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation/dist/chartjs-plugin-annotation.min.js"></script>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .chart-container { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
          .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
          .update-button { padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; }
          .update-button:disabled { background-color: #cccccc; cursor: not-allowed; }
          .error-message { color: red; margin-top: 5px; display: none; }
          .sidebar { position: fixed; right: 0; top: 0; width: 300px; height: 100%; background-color: #f8f8f8; padding: 20px; box-shadow: -2px 0 5px rgba(0,0,0,0.1); overflow-y: auto; display: none; }
        </style>
      </head>
      <body>
        <script>
          Chart.register('chartjs-plugin-annotation');
        </script>
        <h1>ISIN Stock Market Dashboard</h1>
        <div id="charts-container">
    `;

    // Add a chart container for each ISIN
    for (const chart of charts.all) {
      const isin = chart.isin.value;
      html += `
        <div class="chart-container" id="chart-container-${isin}">
          <div class="chart-header">
            <h2>${isin}</h2>
            <button class="update-button" data-isin="${isin}">Update</button>
          </div>
          <div class="error-message" id="error-${isin}"></div>
          <canvas id="chart-${isin}"></canvas>
        </div>
      `;
    }

    // Add sidebar for event details and JavaScript
    html += `
        </div>
        <div class="sidebar" id="event-sidebar">
          <h3>Event Details</h3>
          <div id="event-details"></div>
        </div>

        <script>
          // Function to initialize charts
          function initializeCharts() {
            const chartsData = ${JSON.stringify(charts)};

            for (const chart of chartsData.all) {
              const isin = chart.isin.value;
              const ctx = document.getElementById('chart-' + isin).getContext('2d');

              // Extract data points
              const labels = chart.stockData.dataPoints.map(dp => new Date(dp.timestamp).toLocaleDateString());
              const prices = chart.stockData.dataPoints.map(dp => dp.price.amount);

              // Extract buy/sell events
              const buyEvents = chart.isinEvents.events.filter(e => e.type === 'buy');
              const sellEvents = chart.isinEvents.events.filter(e => e.type === 'sell');

              // Create annotations for buy/sell events
              const annotations = [];

              // Add buy events (blue upward triangle)
              for (const event of buyEvents) {
                const index = labels.indexOf(new Date(event.tradingDate).toLocaleDateString());
                if (index !== -1) {
                  annotations.push({
                    type: 'point',
                    xValue: index,
                    yValue: prices[index],
                    backgroundColor: 'blue',
                    pointStyle: 'triangle',
                    rotation: 0, // Upward
                    radius: 12,
                    borderColor: 'white',
                    borderWidth: 2,
                    label: {
                      content: 'Buy',
                      enabled: true,
                      position: 'top',
                      color: 'blue',
                      font: { weight: 'bold' }
                    },
                    click: function() {
                      showEventDetails(event);
                    }
                  });
                }
              }

              // Add sell events (red downward triangle)
              for (const event of sellEvents) {
                const index = labels.indexOf(new Date(event.tradingDate).toLocaleDateString());
                if (index !== -1) {
                  annotations.push({
                    type: 'point',
                    xValue: index,
                    yValue: prices[index],
                    backgroundColor: 'red',
                    pointStyle: 'triangle',
                    rotation: 180, // Downward
                    radius: 12,
                    borderColor: 'white',
                    borderWidth: 2,
                    label: {
                      content: 'Sell',
                      enabled: true,
                      position: 'top',
                      color: 'red',
                      font: { weight: 'bold' }
                    },
                    click: function() {
                      showEventDetails(event);
                    }
                  });
                }
              }

              // Create chart
              new Chart(ctx, {
                type: 'line',
                data: {
                  labels: labels,
                  datasets: [{
                    label: 'Stock Price',
                    data: prices,
                    borderColor: 'black',
                    borderWidth: 1,
                    tension: 0.1,
                    pointStyle: false,
                  }]
                },
                options: {
                  responsive: true,
                  plugins: {
                    annotation: {
                      annotations: annotations
                    }
                  }
                }
              });
            }
          }

          // Function to show event details in sidebar
          function showEventDetails(event) {
            const sidebar = document.getElementById('event-sidebar');
            const detailsContainer = document.getElementById('event-details');

            // Format event details
            let details = '';
            for (const [key, value] of Object.entries(event)) {
              details += '<p><strong>' + key + ':</strong> ' + value + '</p>';
            }

            detailsContainer.innerHTML = details;
            sidebar.style.display = 'block';
          }

          // Function to update stock data for an ISIN
          async function updateStockData(isin) {
            const button = document.querySelector('.update-button[data-isin="' + isin + '"]');
            const errorElement = document.getElementById('error-' + isin);

            try {
              button.disabled = true;
              button.textContent = 'Updating...';
              errorElement.style.display = 'none';

              const response = await fetch('/api/update-stock-data', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isin })
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update stock data');
              }

              button.textContent = 'Updated';
              // Reload the page to show updated data
              setTimeout(() => window.location.reload(), 1000);
            } catch (error) {
              console.error('Error updating stock data:', error);
              button.textContent = 'Error';
              errorElement.textContent = error.message;
              errorElement.style.display = 'block';
            }
          }

          // Add event listeners to update buttons
          document.addEventListener('DOMContentLoaded', function() {
            const updateButtons = document.querySelectorAll('.update-button');
            updateButtons.forEach(button => {
              button.addEventListener('click', function() {
                const isin = this.getAttribute('data-isin');
                updateStockData(isin);
              });
            });

            // Close sidebar when clicking outside
            document.addEventListener('click', function(event) {
              const sidebar = document.getElementById('event-sidebar');
              if (!sidebar.contains(event.target) && event.target.tagName !== 'CANVAS') {
                sidebar.style.display = 'none';
              }
            });

            // Initialize charts
            initializeCharts();
          });
        </script>
      </body>
      </html>
    `;

    // Send HTML response
    res.send(html);
  } catch (error) {
    console.error('Error rendering charts:', error);
    res.status(500).send(`
      <html lang="en">
        <head><title>Error</title></head>
        <body>
          <h1>Error</h1>
          <p>Failed to load charts: ${error instanceof Error ? error.message : String(error)}</p>
          <a href="/">Try again</a>
        </body>
      </html>
    `);
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
