import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

/**
 * JSON writer for writing JSON files
 */
export class JsonWriter {
  /**
   * Writes data to a JSON file
   * @param filePath The path to the JSON file
   * @param data The data to write
   * @param pretty Whether to format the JSON with indentation (default: true)
   * @returns Promise that resolves when the file has been written
   * @throws Error if the file cannot be written
   */
  static async writeJson<T>(filePath: string, data: T, pretty: boolean = true): Promise<void> {
    // Resolve the file path
    const resolvedPath = path.resolve(filePath);

    try {
      // Create the directory if it doesn't exist
      const directory = path.dirname(resolvedPath);
      await fsPromises.mkdir(directory, { recursive: true });

      // Convert the data to JSON
      const jsonString = pretty 
        ? JSON.stringify(data, null, 2) // Pretty print with 2-space indentation
        : JSON.stringify(data);

      // Write the file
      await fsPromises.writeFile(resolvedPath, jsonString, 'utf8');
    } catch (error) {
      throw new Error(`Error writing file: ${resolvedPath}, ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
