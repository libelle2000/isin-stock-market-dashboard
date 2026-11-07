/* istanbul ignore file -- coverage counters would leak into toString() and break the embedded page script */

/**
 * Runs updateOne for each ISIN, one after another, with a pause in between
 * so the stock data API is not overwhelmed. A failed ISIN does not stop the rest.
 *
 * This function is also embedded into the dashboard page via toString(),
 * so it must stay self-contained: no imports, no references to outer scope.
 *
 * @returns the number of ISINs whose update failed
 */
export async function updateSequentially(
  isins: string[],
  updateOne: (isin: string) => Promise<boolean>,
  delayMs: number,
  sleep: (ms: number) => Promise<void>,
  onProgress: (current: number, total: number) => void = () => {},
): Promise<number> {
  let failed = 0;
  for (let i = 0; i < isins.length; i++) {
    onProgress(i + 1, isins.length);
    const ok = await updateOne(isins[i]);
    if (!ok) failed++;
    if (i < isins.length - 1) {
      await sleep(delayMs);
    }
  }
  return failed;
}
