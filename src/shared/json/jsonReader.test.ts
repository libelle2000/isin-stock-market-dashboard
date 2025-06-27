import { JsonReader } from './jsonReader';
import fs from 'fs';
import path from 'path';

// Mock fs and path modules
jest.mock('fs');
jest.mock('path');

describe('JsonReader', () => {
  // Sample JSON content
  const jsonContent = '{"key1":"value1","key2":42,"key3":true}';
  
  // Expected parsed result
  const expectedResult = {
    key1: 'value1',
    key2: 42,
    key3: true
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock path.resolve to return the input path
    (path.resolve as jest.Mock).mockImplementation((filePath) => filePath);
    
    // Mock fs.existsSync to return true
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    
    // Mock fs.promises.readFile to return the JSON content
    (fs.promises.readFile as jest.Mock).mockResolvedValue(jsonContent);
  });

  describe('readJson', () => {
    it('should read and parse a JSON file', async () => {
      const filePath = 'test.json';
      const result = await JsonReader.readJson(filePath);
      
      // Check that the file path was resolved
      expect(path.resolve).toHaveBeenCalledWith(filePath);
      
      // Check that the file existence was checked
      expect(fs.existsSync).toHaveBeenCalled();
      
      // Check that readFile was called with the resolved path
      expect(fs.promises.readFile).toHaveBeenCalledWith(filePath, 'utf8');
      
      // Check that the result matches the expected result
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if the file does not exist', async () => {
      // Mock fs.existsSync to return false
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      const filePath = 'nonexistent.json';
      
      await expect(JsonReader.readJson(filePath)).rejects.toThrow('File not found');
    });

    it('should throw an error if the file contains invalid JSON', async () => {
      // Mock fs.promises.readFile to return invalid JSON
      (fs.promises.readFile as jest.Mock).mockResolvedValue('{"key1":"value1",}');
      
      const filePath = 'invalid.json';
      
      await expect(JsonReader.readJson(filePath)).rejects.toThrow('Invalid JSON in file');
    });

    it('should throw an error if reading the file fails', async () => {
      // Mock fs.promises.readFile to reject with an error
      (fs.promises.readFile as jest.Mock).mockRejectedValue(new Error('Read error'));
      
      const filePath = 'error.json';
      
      await expect(JsonReader.readJson(filePath)).rejects.toThrow('Error reading file');
    });
  });
});