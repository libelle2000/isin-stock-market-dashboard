import { Event, EventData, EventType } from './event';

/**
 * Immutable value object representing a sell event
 */
export class SellEvent extends Event {
  /**
   * Creates a new SellEvent instance
   * @param data The raw event data from CSV
   * @throws Error if the data is invalid or not a sell event
   */
  constructor(data: EventData) {
    super(data);

    // Ensure this is a sell event
    if (this.type !== EventType.SELL) {
      throw new Error(`Invalid event type for SellEvent: ${data.TYPE}`);
    }
  }
}
