// Reine Spiellogik ohne UI – wird von Tests abgedeckt (logic.test.ts).
import type { Game, Id, Mode, Player, Round, State } from "./types";

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

/** Offizielle Rundenzahl je Spielerzahl (60 Karten) */
export const maxRounds = (n: number) => ({ 2: 20, 3: 20, 4: 15, 5: 12, 6: 10 } as Record<number, number>)[n] ?? 10;

export const MODES: Record<Mode, { n: string; d: string; rounds: (n: number) => number; cards: (g: Game, r: number) => number; ok?: (n: number) => boolean }> = {
  classic: { n: "Klassisch", d: "1 Karte mehr pro Runde", rounds: maxRounds, cards: (_g, r) => r },
  mono: { n: "Einfarbig", d: "3–4 Personen · jede Person eine Farbe · 12 Runden · kein Trumpf", rounds: () => 12, cards: (_g, r) => r + 3, ok: (n) => n >= 3 && n <= 4 },
  maximus: { n: "Wizard Maximus", d: "5 Runden mit allen Karten · Trumpf fest", rounds: () => 5, cards: (g) => Math.floor(60 / g.players.length) },
};
export const MAXIMUS_TRUMP = ["🔵 Blau", "🔴 Rot", "🟢 Grün", "🟡 Gelb", "⚪ kein Trumpf"];

export const cardsOf = (g: Game, r: number) => MODES[g.mode ?? "classic"].cards(g, r);
export const pm1On = (g: Game) => g.pm1 && !g.hid;
export const specialsOn = (g: Game) => g.cb && (g.mode ?? "classic") === "classic";

export const newRound = (): Round => ({ phase: "bid", bids: {}, tricks: {}, cloud: {}, bomb: 0, bombBy: null, done: false });

/** Reihenfolge in Runde r: erste Person beginnt, letzte ist Dealer. Rotiert jede Runde um 1. */
export function order(g: Game, r: number): Id[] {
  const n = g.players.length, s = (r - 1) % n;
  return g.players.map((_, i) => g.players[(s + i) % n]);
}
export const starter = (g: Game, r: number) => order(g, r)[0];
export const dealer = (g: Game, r: number) => order(g, r).at(-1)!;

export const finalBid = (rd: Round, p: Id) => (rd.bids[p] ?? 0) + (rd.cloud[p] ?? 0);
export function roundScore(rd: Round, p: Id) {
  const b = finalBid(rd, p), t = rd.tricks[p] ?? 0;
  return b === t ? 20 + 10 * t : -10 * Math.abs(b - t);
}
export const doneRounds = (g: Game) => g.rounds.filter((r) => r.done).length;

export function totals(g: Game, upto?: number): Record<Id, number> {
  const t: Record<Id, number> = {};
  g.players.forEach((p) => (t[p] = 0));
  g.rounds.slice(0, upto ?? g.rounds.length).forEach((rd) => { if (rd.done) g.players.forEach((p) => (t[p] += roundScore(rd, p))); });
  return t;
}
export function winners(g: Game): Id[] {
  const t = totals(g), m = Math.max(...Object.values(t));
  return g.players.filter((p) => t[p] === m);
}

/** Erwartete Stichzahl (Bombe zieht einen Stich ab) */
export const expectedTricks = (g: Game, r: number, rd: Round) => cardsOf(g, r) - rd.bomb;

/** Plus/minus Eins: die für den Dealer verbotene Ansage (oder null) */
export function forbiddenBid(g: Game, rd: Round, p: Id): number | null {
  if (rd.phase !== "bid" || !pm1On(g)) return null;
  const r = g.rounds.indexOf(rd) + 1, o = order(g, r);
  if (p !== o.at(-1)) return null;
  const v = cardsOf(g, r) - o.slice(0, -1).reduce((a, q) => a + (rd.bids[q] ?? 0), 0);
  return v >= 0 ? v : null;
}
export function bidsComplete(g: Game, rd: Round) {
  const r = g.rounds.indexOf(rd) + 1, o = order(g, r), d = o.at(-1)!;
  const fb = forbiddenBid(g, rd, d);
  return o.every((p) => rd.bids[p] != null) && !(fb != null && rd.bids[d] === fb);
}
export function tricksComplete(g: Game, rd: Round) {
  const r = g.rounds.indexOf(rd) + 1;
  return g.players.reduce((a, p) => a + (rd.tricks[p] ?? 0), 0) === expectedTricks(g, r, rd);
}

/** Wert ändern (+1/−1) mit Grenzen und Überspringen der verbotenen Ansage. Gibt false zurück, wenn nicht möglich. */
export function step(g: Game, rd: Round, p: Id, d: 1 | -1, wrap = false): boolean {
  const r = g.rounds.indexOf(rd) + 1, key = rd.phase === "bid" ? "bids" : "tricks";
  const lim = key === "bids" ? cardsOf(g, r) : expectedTricks(g, r, rd);
  let v = (rd[key][p] ?? (d > 0 ? -1 : 0)) + d;
  if (v < 0) v = 0;
  if (v > lim) { if (wrap) v = 0; else v = lim; }
  const fb = key === "bids" ? forbiddenBid(g, rd, p) : null;
  if (v === fb) {
    const v2 = v + d;
    if (v2 >= 0 && v2 <= lim) v = v2;
    else if (wrap && v2 > lim) v = fb === 0 ? 1 : 0;
    else return false;
  }
  rd[key][p] = v;
  return true;
}

/** Nach den Ansagen: Stiche mit den Ansagen vorbefüllen (außer bei geheimer Vorhersage) */
export function startTricks(g: Game, rd: Round) {
  const r = g.rounds.indexOf(rd) + 1;
  if (g.hid !== "secret") g.players.forEach((p) => { if (rd.tricks[p] == null) rd.tricks[p] = Math.min(finalBid(rd, p), expectedTricks(g, r, rd)); });
  rd.phase = "tricks";
}

/** Wolke: Ansage der Person ±1; vorbefüllte Stiche ziehen mit */
export function playCloud(rd: Round, p: Id, d: 1 | -1) {
  const old = finalBid(rd, p);
  if (old + d < 0) return;
  rd.cloud[p] = (rd.cloud[p] ?? 0) + d;
  if (!rd.cloud[p]) delete rd.cloud[p];
  if (rd.tricks[p] === old) rd.tricks[p] = Math.max(0, finalBid(rd, p));
}

/** Runde abschließen. Gibt true zurück, wenn das Spiel an der natürlichen Grenze endet. */
export function closeRound(g: Game): boolean {
  const rd = g.rounds.at(-1)!;
  rd.done = true;
  if (g.max && g.rounds.length >= g.max) { g.end = Date.now(); return true; }
  g.rounds.push(newRound());
  return false;
}
export function endGame(g: Game) {
  if (!g.rounds.at(-1)?.done) g.rounds.pop();
  g.end = Date.now();
}

export function createGame(players: Id[], opt: { mode: Mode; pm1: boolean; cb: boolean; hid: Game["hid"] }): Game {
  const mode = opt.mode;
  return {
    id: uid(), start: Date.now(), end: null, players: players.slice(), mode,
    pm1: opt.pm1 && !opt.hid, cb: opt.cb && mode === "classic", hid: opt.hid,
    max: MODES[mode].rounds(players.length), rounds: [newRound()],
  };
}

/** Eindeutige Kürzel für Avatare: häufigste Spieler bekommen das kürzeste */
export function abbreviations(s: Pick<State, "players" | "games">): Record<Id, string> {
  const used = new Set<string>(), m: Record<Id, string> = {}, cnt: Record<Id, number> = {};
  s.games.forEach((g) => g.players.forEach((p) => (cnt[p] = (cnt[p] ?? 0) + 1)));
  s.players.filter((p) => p.abbr).forEach((p) => { m[p.id] = p.abbr!; used.add(p.abbr!.toUpperCase()); });
  s.players.filter((p) => !p.abbr).sort((a, b) => (cnt[b.id] ?? 0) - (cnt[a.id] ?? 0)).forEach((p) => {
    const n = p.name.replace(/\(alt\)/, "").trim(), w = n.split(/[\s.\-]+/).filter(Boolean), L = n.replace(/[^\p{L}]/gu, "") || "?";
    const c = [L[0], w.length > 1 ? w[0][0] + w[1][0] : null, L.slice(0, 2), L[0] + L.at(-1), ...[...L.slice(1)].map((x) => L[0] + x), ...[2, 3, 4, 5, 6, 7, 8, 9].map((i) => L[0] + i)]
      .filter((x): x is string => !!x).map((x) => x[0].toUpperCase() + x.slice(1));
    const k = c.find((x) => !used.has(x.toUpperCase())) ?? "?";
    used.add(k.toUpperCase()); m[p.id] = k;
  });
  return m;
}

export const nameTaken = (players: Player[], name: string, exceptId?: Id) =>
  players.some((p) => p.id !== exceptId && !p.deleted && p.name.trim().toLowerCase() === name.trim().toLowerCase());

/** Profil "from" in "to" aufgehen lassen. Fehler, wenn beide im selben Spiel waren. */
export function mergePlayers(s: State, from: Id, to: Id): string | null {
  if (s.games.some((g) => g.players.includes(from) && g.players.includes(to))) return "Beide haben im selben Spiel gespielt";
  s.games.forEach((g) => {
    g.players = g.players.map((x) => (x === from ? to : x));
    g.rounds.forEach((rd) => {
      (["bids", "tricks", "cloud"] as const).forEach((k) => { if (from in rd[k]) { rd[k][to] = rd[k][from]; delete rd[k][from]; } });
      if (rd.bombBy === from) rd.bombBy = to;
    });
  });
  const f = s.players.find((p) => p.id === from)!, t = s.players.find((p) => p.id === to)!;
  t.wbIds = [...(t.wbIds ?? []), f.wb, ...(f.wbIds ?? [])].filter((x): x is string => !!x);
  s.players = s.players.filter((p) => p.id !== from);
  return null;
}

export function deleteGame(s: State, id: Id) {
  const g = s.games.find((x) => x.id === id);
  if (!g) return;
  if (g.wb) s.delWb.push(g.wb);
  s.games = s.games.filter((x) => x.id !== id);
  if (s.cur === id) s.cur = null;
}

export const isEarlyEnd = (g: Game) => !!g.max && doneRounds(g) < g.max;
