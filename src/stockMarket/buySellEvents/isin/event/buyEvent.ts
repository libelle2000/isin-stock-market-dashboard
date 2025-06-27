import { Event, EventData, EventType } from './event';

/**
 * Immutable value object representing a buy event
 */
export class BuyEvent extends Event {
  /**
   * Creates a new BuyEvent instance
   * @param data The raw event data from CSV
   * @throws Error if the data is invalid or not a buy event
   */
  constructor(data: EventData) {
    super(data);

    // Ensure this is a buy event
    if (this.type !== EventType.BUY) {
      throw new Error(`Invalid event type for BuyEvent: ${data.TYPE}`);
    }
  }
}
