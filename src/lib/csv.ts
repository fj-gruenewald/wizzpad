// CSV-Export (für Excel) und Re-Import. Eine Zeile pro Spieler und Runde, Trennzeichen ";".
import { COLORS } from "./content";
import { maxRounds, roundScore, uid } from "./logic";
import type { Game, Id, Round, State } from "./types";

export const CSV_HEAD = ["datum", "start", "ende", "spiel", "runde", "spieler", "ansage", "wolke", "stiche", "bombe", "bombe_von", "punkte", "stand"];
const d2 = (n: number) => String(n).padStart(2, "0");
const dmy = (ts: number) => { const d = new Date(ts); return `${d2(d.getDate())}.${d2(d.getMonth() + 1)}.${d.getFullYear()}`; };
const esc = (v: unknown) => { const s = String(v ?? ""); return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };

export function toCsv(s: Pick<State, "games" | "players">): string {
  const name = (id: Id) => s.players.find((p) => p.id === id)?.name ?? "?";
  let o = CSV_HEAD.join(";") + "\n";
  for (const g of s.games) {
    if (!g.end) continue;
    const run: Record<Id, number> = {};
    g.rounds.filter((r) => r.done).forEach((rd, i) => g.players.forEach((p) => {
      const sc = roundScore(rd, p); run[p] = (run[p] ?? 0) + sc;
      o += [dmy(g.start), new Date(g.start).toISOString(), new Date(g.end!).toISOString(), g.id, i + 1, name(p), rd.bids[p] ?? 0, rd.cloud[p] ?? 0, rd.tricks[p] ?? 0, rd.bomb, rd.bombBy ? name(rd.bombBy) : "", sc, run[p]].map(esc).join(";") + "\n";
    }));
  }
  return o;
}

function parseLine(l: string): string[] {
  const out: string[] = []; let cur = "", q = false;
  for (let i = 0; i < l.length; i++) {
    const c = l[i];
    if (q) { if (c === '"' && l[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
    else if (c === '"') q = true; else if (c === ";") { out.push(cur); cur = ""; } else cur += c;
  }
  out.push(cur); return out;
}

export interface CsvResult { games: number; duplicates: number; players: number; mismatches: number }

/** Liest eine Wizzpad-CSV ein. Vorhandene Spiele (gleiche ID) werden übersprungen. */
export function importCsv(s: State, text: string): CsvResult {
  const lines = text.replace(/^﻿/, "").split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) throw new Error("Leere Datei");
  const head = parseLine(lines[0]).map((h) => h.trim().toLowerCase());
  const col = (k: string) => head.indexOf(k);
  for (const k of ["spiel", "runde", "spieler", "ansage", "stiche"]) if (col(k) < 0) throw new Error("Keine Wizzpad-CSV-Datei");
  const res: CsvResult = { games: 0, duplicates: 0, players: 0, mismatches: 0 };
  const groups = new Map<string, string[][]>();
  for (const l of lines.slice(1)) { const r = parseLine(l); (groups.get(r[col("spiel")]) ?? groups.set(r[col("spiel")], []).get(r[col("spiel")])!).push(r); }
  const pid = (name: string): Id => {
    const n = name.trim();
    let p = s.players.find((x) => x.name.toLowerCase() === n.toLowerCase());
    if (!p) { p = { id: uid(), name: n, color: COLORS[s.players.length % COLORS.length] }; s.players.push(p); res.players++; }
    return p.id;
  };
  const num = (r: string[], k: string) => (col(k) >= 0 ? Number(r[col(k)]) || 0 : 0);
  const time = (r: string[], k: string) => { const v = col(k) >= 0 ? Date.parse(r[col(k)]) : NaN; return Number.isNaN(v) ? null : v; };
  for (const [gid, rows] of groups) {
    if (s.games.some((g) => g.id === gid)) { res.duplicates++; continue; }
    const players: Id[] = [], rounds: Round[] = [];
    let bad = false;
    for (const r of rows) {
      const p = pid(r[col("spieler")]); if (!players.includes(p)) players.push(p);
      const i = num(r, "runde") - 1; if (i < 0) continue;
      const rd = (rounds[i] ??= { phase: "tricks", bids: {}, tricks: {}, cloud: {}, bomb: 0, bombBy: null, done: true });
      rd.bids[p] = num(r, "ansage"); rd.tricks[p] = num(r, "stiche");
      if (num(r, "wolke")) rd.cloud[p] = num(r, "wolke");
      rd.bomb = num(r, "bombe") ? 1 : 0;
      if (col("bombe_von") >= 0 && r[col("bombe_von")]) rd.bombBy = pid(r[col("bombe_von")]);
      if (col("punkte") >= 0 && roundScore(rd, p) !== num(r, "punkte")) bad = true;
    }
    if (bad) res.mismatches++;
    const first = rows[0];
    let start = time(first, "start");
    if (start == null && col("datum") >= 0) { const [d, m, y] = first[col("datum")].split("."); start = new Date(+y, +m - 1, +d, 20).getTime(); }
    start ??= Date.now();
    const g: Game = {
      id: gid || uid(), start, end: time(first, "ende") ?? start, players, mode: "classic", pm1: false,
      cb: rounds.some((r) => r?.bomb || Object.keys(r?.cloud ?? {}).length), hid: "", max: maxRounds(players.length), rounds: rounds.filter(Boolean),
    };
    s.games.push(g); res.games++;
  }
  return res;
}
