/**
 * Small in-memory guards. They are per server instance, which is fine for a
 * single-region lead form; use a shared store (e.g. Redis) if you scale out.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;
const hits = new Map<string, number[]>();

export function rateLimited(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits)
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
  }
  return false;
}

const DEDUPE_MS = 10 * 60 * 1000;
const inflight = new Map<string, Promise<void>>();
const done = new Map<string, number>();

/**
 * Runs `send` at most once per submission id. A repeat of an id that already
 * succeeded resolves without sending again; a repeat while the first is in
 * flight waits for the same result. Failures are not cached, so retries work.
 */
export async function once(
  id: string,
  send: () => Promise<void>,
  now = Date.now(),
): Promise<void> {
  for (const [key, at] of done) if (now - at > DEDUPE_MS) done.delete(key);
  if (done.has(id)) return;
  const running = inflight.get(id);
  if (running) return running;
  const p = send()
    .then(() => {
      done.set(id, Date.now());
    })
    .finally(() => {
      inflight.delete(id);
    });
  inflight.set(id, p);
  return p;
}

export function resetGuards() {
  hits.clear();
  inflight.clear();
  done.clear();
}
