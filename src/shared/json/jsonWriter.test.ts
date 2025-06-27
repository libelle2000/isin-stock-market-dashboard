import { JsonWriter } from './jsonWriter';
import fs from 'fs';
import path from 'path';

// Mock fs and path modules
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  createReadStream: jest.fn(),
  promises: {
    mkdir: jest.fn(),
    writeFile: jest.fn(),
    readFile: jest.fn()
  }
}));
jest.mock('path');

describe('JsonWriter', () => {
  // Sample data to write
  const sampleData = {
    key1: 'value1',
    key2: 42,
    key3: true
  };

  // Expected JSON strings
  const prettyJson = JSON.stringify(sampleData, null, 2);
  const compactJson = JSON.stringify(sampleData);

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock path.resolve to return the input path
    (path.resolve as jest.Mock).mockImplementation((filePath) => filePath);

    // Mock path.dirname to return a directory path
    (path.dirname as jest.Mock).mockImplementation((filePath) => path.join(filePath, '..'));

    // Mock fs.promises.mkdir to do nothing
    (fs.promises.mkdir as jest.Mock).mockResolvedValue(undefined);

    // Mock fs.promises.writeFile to do nothing
    (fs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);
  });

  describe('writeJson', () => {
    it('should write data to a JSON file with pretty formatting by default', async () => {
      const filePath = 'test.json';
      await JsonWriter.writeJson(filePath, sampleData);

      // Check that the file path was resolved
      expect(path.resolve).toHaveBeenCalledWith(filePath);

      // Check that the directory was created
      expect(fs.promises.mkdir).toHaveBeenCalled();

      // Check that writeFile was called with the resolved path and pretty JSON
      expect(fs.promises.writeFile).toHaveBeenCalledWith(filePath, prettyJson, 'utf8');
    });

    it('should write data to a JSON file without pretty formatting when specified', async () => {
      const filePath = 'test.json';
      await JsonWriter.writeJson(filePath, sampleData, false);

      // Check that writeFile was called with the resolved path and compact JSON
      expect(fs.promises.writeFile).toHaveBeenCalledWith(filePath, compactJson, 'utf8');
    });

    it('should create the directory if it does not exist', async () => {
      const filePath = 'dir/test.json';
      await JsonWriter.writeJson(filePath, sampleData);

      // Check that the directory was created
      expect(fs.promises.mkdir).toHaveBeenCalledWith(path.join(filePath, '..'), { recursive: true });
    });

    it('should throw an error if writing the file fails', async () => {
      // Mock fs.promises.writeFile to reject with an error
      (fs.promises.writeFile as jest.Mock).mockRejectedValue(new Error('Write error'));

      const filePath = 'error.json';

      await expect(JsonWriter.writeJson(filePath, sampleData)).rejects.toThrow('Error writing file');
    });

    it('should throw an error if creating the directory fails', async () => {
      // Mock fs.promises.mkdir to reject with an error
      (fs.promises.mkdir as jest.Mock).mockRejectedValue(new Error('Directory error'));

      const filePath = 'dir/error.json';

      await expect(JsonWriter.writeJson(filePath, sampleData)).rejects.toThrow('Error writing file');
    });
  });
});
