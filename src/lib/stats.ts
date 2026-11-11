import { doneRounds, finalBid, roundScore, totals, winners } from "./logic";
import type { Game, Id, Player } from "./types";

export interface PStat {
  g: number; w: number; r: number; hit: number; over: number; under: number; pts: number; best: number; bestG: Game | null;
  bestR: number; time: number; zero: number; bombs: number; streak: number; bids: Record<number, number>; vs: Record<Id, { w: number; l: number }>;
}

export function playerStats(players: Player[], games: Game[]): Record<Id, PStat> {
  const st: Record<Id, PStat> = {};
  players.forEach((p) => (st[p.id] = { g: 0, w: 0, r: 0, hit: 0, over: 0, under: 0, pts: 0, best: 0, bestG: null, bestR: 0, time: 0, zero: 0, bombs: 0, streak: 0, bids: {}, vs: {} }));
  for (const g of games) {
    if (!g.end) continue;
    const t = totals(g), w = winners(g);
    for (const p of g.players) {
      const s = st[p]; if (!s) continue;
      s.g++; if (w.includes(p)) s.w++;
      if (!s.bestG || t[p] > s.best) { s.best = t[p]; s.bestG = g; }
      s.time += g.end - g.start;
      for (const q of g.players) if (q !== p) { const v = (s.vs[q] ??= { w: 0, l: 0 }); if (t[p] > t[q]) v.w++; else if (t[p] < t[q]) v.l++; }
      let cur = 0;
      for (const rd of g.rounds) {
        if (!rd.done) continue;
        const b = finalBid(rd, p), tr = rd.tricks[p] ?? 0, sc = roundScore(rd, p);
        s.r++; s.pts += sc; s.bestR = Math.max(s.bestR, sc);
        if (b === tr) { s.hit++; cur++; s.streak = Math.max(s.streak, cur); } else { cur = 0; if (b > tr) s.over++; else s.under++; }
        if (b === 0) s.zero++;
        if (rd.bombBy === p) s.bombs++;
        s.bids[b] = (s.bids[b] ?? 0) + 1;
      }
    }
  }
  return st;
}

export interface Rec { v: number; p: Id; g: Game; r?: number }
export function records(games: Game[]) {
  let top: Rec | null = null, low: Rec | null = null, bestR: Rec | null = null, worstR: Rec | null = null, highHit: Rec | null = null;
  for (const g of games) {
    const t = totals(g);
    g.players.forEach((p) => {
      if (!top || t[p] > top.v) top = { v: t[p], p, g };
      if (!low || t[p] < low.v) low = { v: t[p], p, g };
    });
    g.rounds.forEach((rd, i) => {
      if (!rd.done) return;
      g.players.forEach((p) => {
        const x = roundScore(rd, p), b = finalBid(rd, p);
        if (!bestR || x > bestR.v) bestR = { v: x, p, g, r: i + 1 };
        if (!worstR || x < worstR.v) worstR = { v: x, p, g, r: i + 1 };
        if (b === rd.tricks[p] && (!highHit || b > highHit.v)) highHit = { v: b, p, g, r: i + 1 };
      });
    });
  }
  return { top, low, bestR, worstR, highHit } as { top: Rec | null; low: Rec | null; bestR: Rec | null; worstR: Rec | null; highHit: Rec | null };
}

export const totalTime = (games: Game[]) => games.reduce((a, g) => a + ((g.end ?? g.start) - g.start), 0);
export const totalRounds = (games: Game[]) => games.reduce((a, g) => a + doneRounds(g), 0);
