/**
 * SERVER-ONLY. Protects the user from their own browser tabs.
 *
 * The backend's refresh token is single-use with NO grace window. Its rotate()
 * takes a pessimistic_write lock and, if the presented token was already
 * rotated, calls revokeFamily() - "assume theft, kill the whole session".
 *
 * Cookies are shared across tabs, so two tabs that refresh at the same instant
 * both present the same token: one wins, the other is treated as theft and the
 * user is logged out everywhere. This guard collapses those into one rotation.
 *
 *   in-flight  -> concurrent callers await the same promise
 *   grace      -> the same token presented again within 10s gets the cached pair
 *
 * Limitation, stated honestly: this is per-process. Behind several Next
 * instances you would need the same two maps in Redis. For a single-instance
 * deployment (and for dev) this is sufficient.
 */
import { createHash } from "crypto";
import type { TokenPair } from "@/lib/api/types";

const GRACE_MS = 10_000;

type Entry = { pair: TokenPair; at: number };
const recent = new Map<string, Entry>();
const inflight = new Map<string, Promise<TokenPair>>();

const keyOf = (token: string) => createHash("sha256").update(token).digest("hex");

/** Sweep expired entries so the map can't grow without bound. */
function sweep() {
  const cutoff = Date.now() - GRACE_MS;
  for (const [k, v] of recent) if (v.at < cutoff) recent.delete(k);
}

export function rotateOnce(refreshToken: string, work: () => Promise<TokenPair>): Promise<TokenPair> {
  const key = keyOf(refreshToken);

  const hit = recent.get(key);
  if (hit && Date.now() - hit.at < GRACE_MS) return Promise.resolve(hit.pair);

  const pending = inflight.get(key);
  if (pending) return pending;

  const promise = work()
    .then((pair) => {
      recent.set(key, { pair, at: Date.now() });
      inflight.delete(key);
      sweep();
      return pair;
    })
    .catch((e) => {
      inflight.delete(key);
      throw e;
    });

  inflight.set(key, promise);
  return promise;
}
