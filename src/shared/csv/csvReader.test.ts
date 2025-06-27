import { CsvReader } from './csvReader';
import fs from 'fs';
import path from 'path';

// Mock fs and path modules
jest.mock('fs');
jest.mock('path');

describe('CsvReader', () => {
  // Sample CSV content
  const csvContent = 'header1,header2,header3\nvalue1,value2,value3\nvalue4,value5,value6';

  // Expected parsed result
  const expectedResult = [
    { header1: 'value1', header2: 'value2', header3: 'value3' },
    { header1: 'value4', header2: 'value5', header3: 'value6' }
  ];

  // Mock implementation for fs.createReadStream
  const mockCreateReadStream = jest.fn();

  // Mock implementation for pipe, on methods
  const mockPipe = jest.fn();
  const mockOn = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock path.resolve to return the input path
    (path.resolve as jest.Mock).mockImplementation((filePath) => filePath);

    // Mock fs.existsSync to return true
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    // Set up the mock stream chain
    mockOn.mockImplementation(function(this: any, event, callback) {
      if (event === 'data') {
        // Call the callback for each row of data
        callback(expectedResult[0]);
        callback(expectedResult[1]);
      } else if (event === 'end') {
        // Call the end callback
        callback();
      }
      return this;
    });

    mockPipe.mockReturnValue({ on: mockOn });
    mockCreateReadStream.mockReturnValue({ pipe: mockPipe });

    // Replace the real createReadStream with our mock
    (fs.createReadStream as jest.Mock).mockImplementation(mockCreateReadStream);
  });

  describe('readCsv', () => {
    it('should read and parse a CSV file', async () => {
      const filePath = 'test.csv';
      const result = await CsvReader.readCsv(filePath);

      // Check that the file path was resolved
      expect(path.resolve).toHaveBeenCalledWith(filePath);

      // Check that the file existence was checked
      expect(fs.existsSync).toHaveBeenCalled();

      // Check that createReadStream was called with the resolved path
      expect(fs.createReadStream).toHaveBeenCalled();

      // Check that the result matches the expected result
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if the file does not exist', async () => {
      // Mock fs.existsSync to return false
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const filePath = 'nonexistent.csv';

      await expect(CsvReader.readCsv(filePath)).rejects.toThrow('File not found');
    });

    it('should reject the promise if an error occurs during reading', async () => {
      // Mock the on method to trigger an error
      mockOn.mockImplementation(function(this: any, event, callback) {
        if (event === 'error') {
          callback(new Error('Read error'));
        }
        return this;
      });

      const filePath = 'test.csv';

      await expect(CsvReader.readCsv(filePath)).rejects.toThrow('Read error');
    });
  });
});
