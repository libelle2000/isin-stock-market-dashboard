import { Isin } from '../../shared/domainObjects/isin';
import { IsinEvents } from './isin/isinEvents';

/**
 * Immutable collection of all IsinEvents
 */
export class Events {
  private readonly _isinEventsMap: Map<string, IsinEvents>;

  /**
   * Creates a new Events instance
   * @param isinEvents Array of IsinEvents objects
   */
  constructor(isinEvents: IsinEvents[]) {
    this._isinEventsMap = new Map<string, IsinEvents>();

    // Store IsinEvents by ISIN value for quick lookup
    for (const isinEvent of isinEvents) {
      this._isinEventsMap.set(isinEvent.isin.value, isinEvent);
    }
  }

  /**
   * Returns all IsinEvents
   */
  get allIsinEvents(): ReadonlyArray<IsinEvents> {
    return Array.from(this._isinEventsMap.values());
  }

  /**
   * Returns the number of IsinEvents
   */
  get count(): number {
    return this._isinEventsMap.size;
  }

  /**
   * Returns all ISINs
   */
  get isins(): ReadonlyArray<Isin> {
    return this.allIsinEvents.map(isinEvents => isinEvents.isin);
  }

  /**
   * Gets IsinEvents by ISIN
   * @param isin The ISIN to look up
   * @returns The IsinEvents for the given ISIN, or undefined if not found
   */
  getByIsin(isin: Isin | string): IsinEvents | undefined {
    const isinValue = isin instanceof Isin ? isin.value : isin;
    return this._isinEventsMap.get(isinValue);
  }

  /**
   * Checks if the collection has events for the given ISIN
   * @param isin The ISIN to check
   * @returns true if the collection has events for the given ISIN, false otherwise
   */
  hasIsin(isin: Isin | string): boolean {
    const isinValue = isin instanceof Isin ? isin.value : isin;
    return this._isinEventsMap.has(isinValue);
  }

  /**
   * Implements the iterable protocol to allow iterating over IsinEvents
   */
  [Symbol.iterator](): Iterator<IsinEvents> {
    return this.allIsinEvents[Symbol.iterator]();
  }
}
