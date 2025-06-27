import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

/**
 * CSV reader for reading CSV files
 */
export class CsvReader {
  /**
   * Reads a CSV file and returns the data as an array of objects
   * @param filePath The path to the CSV file
   * @returns Promise that resolves to an array of objects, where each object represents a row in the CSV file
   * @throws Error if the file cannot be read
   */
  static async readCsv<T>(filePath: string): Promise<T[]> {
    // Resolve the file path
    const resolvedPath = path.resolve(filePath);

    // Check if the file exists
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`File not found: ${resolvedPath}`);
    }

    return new Promise<T[]>((resolve, reject) => {
      const results: T[] = [];

      fs.createReadStream(resolvedPath)
        .pipe(csvParser())
        .on('data', (data: T) => results.push(data))
        .on('error', (error: Error) => reject(error))
        .on('end', () => resolve(results));
    });
  }
}
