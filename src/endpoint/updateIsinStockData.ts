import express from 'express';
import { Isin } from '../shared/domainObjects/isin';
import { StockMarketService } from '../stockMarket/stockMarketService';

// Create router
const router = express.Router();

// Create StockMarketService instance
const stockMarketService = new StockMarketService();

/**
 * Endpoint to update stock data for a specific ISIN
 * 
 * Request body:
 * {
 *   "isin": "LU2090063327"
 * }
 * 
 * Success response (200 OK):
 * {
 *   "isin": "LU2090063327",
 *   "message": "Stock data updated successfully"
 * }
 * 
 * Error response (400 Bad Request):
 * {
 *   "error": "Invalid ISIN format: ABC123"
 * }
 * 
 * Error response (500 Internal Server Error):
 * {
 *   "error": "Error fetching stock data for ISIN LU2090063327: API call failed"
 * }
 */
router.post('/update-stock-data', async (req, res) => {
  try {
    // Get ISIN from request body
    const { isin: isinString } = req.body;

    // Validate ISIN
    if (!isinString) {
      return res.status(400).json({ error: 'ISIN is required' });
    }

    if (!Isin.isValid(isinString)) {
      return res.status(400).json({ error: `Invalid ISIN format: ${isinString}` });
    }

    // Create Isin object
    const isin = new Isin(isinString);

    // Update stock data
    await stockMarketService.fetchStockDataByIsin(isin);

    // Return success response
    return res.status(200).json({
      isin: isin.value,
      message: 'Stock data updated successfully'
    });
  } catch (error) {
    console.error('Error updating stock data:', error);

    // Return error response
    return res.status(500).json({
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export const updateIsinStockDataRouter = router;
