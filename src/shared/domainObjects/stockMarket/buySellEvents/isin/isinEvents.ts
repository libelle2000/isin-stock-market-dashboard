import { Isin } from '../../../isin';
import { Event } from './event/event';
import { BuyEvent } from './event/buyEvent';
import { SellEvent } from './event/sellEvent';
import { JsonSerializable } from '../../../../jsonSerializable';

/**
 * Immutable collection of events for a specific ISIN
 */
export class IsinEvents implements JsonSerializable {
  private readonly _isin: Isin;
  private readonly _events: ReadonlyArray<Event>;
  private readonly _lowestTotalIncludingCostsEvent: Event;
  private readonly _highestTotalIncludingCostsEvent: Event;

  /**
   * Creates a new IsinEvents instance
   * @param isin The ISIN
   * @param events The events for this ISIN
   * @throws Error if the events contain different ISINs
   */
  constructor(isin: Isin, events: Event[]) {
    this._isin = isin;

    // Validate that all events have the same ISIN
    for (const event of events) {
      if (!event.isin.equals(isin)) {
        throw new Error(`Event with ISIN ${event.isin.value} does not match collection ISIN ${isin.value}`);
      }
    }

    // Sort events by trading date and time
    this._events = [...events].sort((a, b) => 
      a.tradingDateTime.getTime() - b.tradingDateTime.getTime()
    );

    this._lowestTotalIncludingCostsEvent = events.reduce((lowest, current) =>
        current.totalIncludingCosts.isLessThan(lowest.totalIncludingCosts) ? current : lowest
    );
    this._highestTotalIncludingCostsEvent = events.reduce((highest, current) =>
        current.totalIncludingCosts.isGreaterThan(highest.totalIncludingCosts) ? current : highest
    );
  }

  /**
   * Returns the ISIN
   */
  get isin(): Isin {
    return this._isin;
  }

  /**
   * Returns all events
   */
  get events(): ReadonlyArray<Event> {
    return this._events;
  }
  
  get lowestTotalIncludingCostsEvent(): Event {
    return this._lowestTotalIncludingCostsEvent;
  }
  
  get highestTotalIncludingCostsEvent(): Event {
    return this._highestTotalIncludingCostsEvent;
  }

  /**
   * Returns the number of events
   */
  get count(): number {
    return this._events.length;
  }

  /**
   * Returns the oldest event (by trading date and time)
   * @throws Error if there are no events
   */
  get oldestEvent(): Event {
    if (this._events.length === 0) {
      throw new Error(`No events found for ISIN ${this._isin.value}`);
    }

    return this._events[0];
  }

  /**
   * Returns the latest event (by trading date and time)
   * @throws Error if there are no events
   */
  get latestEvent(): Event {
    if (this._events.length === 0) {
      throw new Error(`No events found for ISIN ${this._isin.value}`);
    }

    return this._events[this._events.length - 1];
  }

  /**
   * Returns all buy events
   */
  get buyEvents(): ReadonlyArray<BuyEvent> {
    return this._events.filter(event => event instanceof BuyEvent) as BuyEvent[];
  }

  /**
   * Returns all sell events
   */
  get sellEvents(): ReadonlyArray<SellEvent> {
    return this._events.filter(event => event instanceof SellEvent) as SellEvent[];
  }

  /**
   * Implements the iterable protocol to allow iterating over events
   */
  [Symbol.iterator](): Iterator<Event> {
    return this._events[Symbol.iterator]();
  }

  /**
   * Converts the IsinEvents to a JSON-serializable representation
   * @returns A plain object with the ISIN and events
   */
  toJSON(): Record<string, any> {
    return {
      isin: this._isin.toJSON(),
      events: this._events.map(event => event.toJSON()),
      count: this._events.length
    };
  }
}
