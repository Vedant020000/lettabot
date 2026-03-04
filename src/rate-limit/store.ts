import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const DATA_DIR = 'data/rate-limits';
const getPath = (channel: string) => join(DATA_DIR, `${channel}-daily.json`);

type DailyStore = { date: string; counts: Record<string, number> };

export async function incrementAndCheck(
  channel: string,
  key: string,
  limit: number
): Promise<boolean> {
  await mkdir(DATA_DIR, { recursive: true });
  const path = getPath(channel);
  const today = new Date().toISOString().slice(0, 10);

  let store: DailyStore = { date: today, counts: {} };
  try {
    const raw = await readFile(path, 'utf8');
    const parsed = JSON.parse(raw) as DailyStore;
    if (parsed.date === today) store = parsed;
  } catch { /* first run or stale file */ }

  const count = (store.counts[key] ?? 0) + 1;
  store.counts[key] = count;
  await writeFile(path, JSON.stringify(store), 'utf8');

  return count <= limit;
}
