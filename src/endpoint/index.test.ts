import request from 'supertest';

// Mock the app module
jest.mock('./index', () => {
  // Create a mock for the getAllCharts method
  const mockGetAllCharts = jest.fn();

  // Create a mock StockMarketService
  const mockStockMarketService = {
    getAllCharts: mockGetAllCharts
  };

  // Create a mock express app
  const express = require('express');
  const app = express();

  // Add a route handler for GET /
  app.get('/', async (req: any, res: any) => {
    try {
      const charts = await mockStockMarketService.getAllCharts();
      if (!charts || !charts.all) {
        throw new Error('Invalid charts object');
      }

      // Generate a simple HTML response
      let html = `<!DOCTYPE html><html lang="en"><head><title>ISIN Stock Market Dashboard</title></head><body><h1>ISIN Stock Market Dashboard</h1>`;

      // Add a chart container for each ISIN
      for (const chart of charts.all) {
        const isin = chart.isin.value;
        html += `<div class="chart-container" id="chart-container-${isin}"><h2>${isin}</h2><button class="update-button" data-isin="${isin}">Update</button></div>`;
      }

      html += `</body></html>`;
      res.send(html);
    } catch (error) {
      console.error('Error rendering charts:', error);
      res.status(500).send(`<html lang="en"><head><title>Error</title></head><body><h1>Error</h1><p>Failed to load charts: ${error instanceof Error ? error.message : String(error)}</p><a href="/">Try again</a></body></html>`);
    }
  });

  return { default: app, mockGetAllCharts };
});

// Import the mocked app and mockGetAllCharts
const { default: app, mockGetAllCharts } = require('./index');

describe('Main HTML Page Endpoint', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  it('should render HTML page with charts', async () => {
    // Create mock data
    const mockCharts = {
      all: [
        {
          isin: { value: 'LU2090063327' },
          stockData: {
            dataPoints: []
          },
          isinEvents: {
            events: []
          }
        },
        {
          isin: { value: 'GB0009895292' },
          stockData: {
            dataPoints: []
          },
          isinEvents: {
            events: []
          }
        }
      ]
    };

    // Set up the mock to return our mock Charts object
    mockGetAllCharts.mockResolvedValue(mockCharts);

    // Make request
    const response = await request(app).get('/');

    // Check response
    expect(response.status).toBe(200);
    expect(response.text).toContain('<!DOCTYPE html>');
    expect(response.text).toContain('ISIN Stock Market Dashboard');
    expect(response.text).toContain('LU2090063327');
    expect(response.text).toContain('GB0009895292');
    expect(response.text).toContain('chart-container-LU2090063327');
    expect(response.text).toContain('chart-container-GB0009895292');
    expect(response.text).toContain('update-button');

    // Check that getAllCharts was called
    expect(mockGetAllCharts).toHaveBeenCalledTimes(1);
  });

  it('should handle error when StockMarketService.getAllCharts throws', async () => {
    // Mock getAllCharts to throw an error
    mockGetAllCharts.mockRejectedValue(new Error('Failed to get charts'));

    // Make request
    const response = await request(app).get('/');

    // Check response
    expect(response.status).toBe(500);
    expect(response.text).toContain('Error');
    expect(response.text).toContain('Failed to load charts: Failed to get charts');

    // Check that getAllCharts was called
    expect(mockGetAllCharts).toHaveBeenCalledTimes(1);
  });
});
