import { updateSequentially } from './updateSequentially';

describe('updateSequentially', () => {
  const noSleep = () => Promise.resolve();

  it('updates every ISIN in order and never two at the same time', async () => {
    const log: string[] = [];
    let running = 0;
    const updateOne = async (isin: string) => {
      running++;
      expect(running).toBe(1);
      log.push('start ' + isin);
      await Promise.resolve();
      log.push('end ' + isin);
      running--;
      return true;
    };

    await updateSequentially(['A', 'B', 'C'], updateOne, 500, noSleep);

    expect(log).toEqual(['start A', 'end A', 'start B', 'end B', 'start C', 'end C']);
  });

  it('waits the delay between two calls, but not after the last one', async () => {
    const log: string[] = [];
    const updateOne = async (isin: string) => { log.push('update ' + isin); return true; };
    const sleep = async (ms: number) => { log.push('sleep ' + ms); };

    await updateSequentially(['A', 'B', 'C'], updateOne, 500, sleep);

    expect(log).toEqual(['update A', 'sleep 500', 'update B', 'sleep 500', 'update C']);
  });

  it('keeps going after a failed ISIN and returns the number of failures', async () => {
    const updated: string[] = [];
    const updateOne = async (isin: string) => { updated.push(isin); return isin !== 'B'; };

    const failed = await updateSequentially(['A', 'B', 'C'], updateOne, 500, noSleep);

    expect(updated).toEqual(['A', 'B', 'C']);
    expect(failed).toBe(1);
  });

  it('reports progress before each update', async () => {
    const progress: string[] = [];
    const updateOne = async () => true;

    await updateSequentially(['A', 'B'], updateOne, 500, noSleep, (done, total) => progress.push(done + '/' + total));

    expect(progress).toEqual(['1/2', '2/2']);
  });

  it('still works when embedded into the page as source text (no outer references)', async () => {
    const embedded = new Function(updateSequentially.toString() + '\nreturn updateSequentially;')() as typeof updateSequentially;
    const updated: string[] = [];

    const failed = await embedded(['A', 'B'], async (isin) => { updated.push(isin); return false; }, 500, noSleep);

    expect(updated).toEqual(['A', 'B']);
    expect(failed).toBe(2);
  });
});
