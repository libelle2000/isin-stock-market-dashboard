/**
 * Interface for objects that can be serialized to JSON
 * This is used to ensure proper serialization of value objects
 * when they are sent to the front-end
 */
export interface ToJSON {
  /**
   * Converts the object to a JSON-serializable representation
   * @returns A plain object that can be serialized with JSON.stringify
   */
  toJSON(): Record<string, any>;
}