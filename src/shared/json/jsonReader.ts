import fs from 'fs';
import path from 'path';

/**
 * JSON reader for reading JSON files
 */
export class JsonReader {
  /**
   * Reads a JSON file and returns the data as an object
   * @param filePath The path to the JSON file
   * @returns Promise that resolves to the parsed JSON data
   * @throws Error if the file cannot be read or parsed
   */
  static async readJson<T>(filePath: string): Promise<T> {
    // Resolve the file path
    const resolvedPath = path.resolve(filePath);

    // Check if the file exists
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`File not found: ${resolvedPath}`);
    }

    try {
      // Read the file
      const data = await fs.promises.readFile(resolvedPath, 'utf8');

      // Parse the JSON
      return JSON.parse(data) as T;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON in file: ${resolvedPath}`);
      }
      throw new Error(`Error reading file: ${resolvedPath}, ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
