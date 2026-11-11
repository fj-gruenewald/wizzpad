import { describe, expect, it } from "vitest";
import { importCsv, toCsv } from "./csv";
import { closeRound, createGame, endGame, playCloud, totals } from "./logic";
import type { State } from "./types";

function state(): State {
  const s: State = { v: 1, players: [{ id: "a", name: "Anna", color: "#f00" }, { id: "b", name: "Ben; \"B\"", color: "#0f0" }], games: [], cur: null, set: {} as State["set"], cards: [], cardOv: {}, delWb: [] };
  const g = createGame(["a", "b"], { mode: "classic", pm1: false, cb: true, hid: "" });
  g.rounds[0].bids = { a: 1, b: 0 }; g.rounds[0].tricks = { a: 1, b: 0 }; closeRound(g);
  const r2 = g.rounds[1]; r2.bids = { a: 0, b: 1 }; r2.tricks = { a: 1, b: 0 }; r2.bomb = 1; r2.bombBy = "b"; playCloud(r2, "a", 1); r2.tricks.a = 1; closeRound(g);
  endGame(g); s.games.push(g);
  return s;
}

describe("CSV", () => {
  it("Export → Import ergibt dieselben Punkte", () => {
    const a = state(), csv = toCsv(a);
    const b: State = { ...state(), players: [], games: [] };
    const r = importCsv(b, csv);
    expect(r).toMatchObject({ games: 1, players: 2, mismatches: 0 });
    const ga = a.games[0], gb = b.games[0];
    const name = (s: State, id: string) => s.players.find((p) => p.id === id)!.name;
    const ta = Object.fromEntries(Object.entries(totals(ga)).map(([id, v]) => [name(a, id), v]));
    const tb = Object.fromEntries(Object.entries(totals(gb)).map(([id, v]) => [name(b, id), v]));
    expect(tb).toEqual(ta);
    expect(gb.start).toBe(ga.start);
    expect(gb.rounds[1].bomb).toBe(1);
    expect(name(b, gb.rounds[1].bombBy!)).toBe("Ben; \"B\"");
    expect(gb.rounds[1].cloud[gb.players[0]]).toBe(1);
  });
  it("vorhandene Spiele werden übersprungen", () => {
    const a = state();
    expect(importCsv(a, toCsv(a))).toMatchObject({ games: 0, duplicates: 1 });
  });
  it("lehnt fremde Dateien ab", () => {
    expect(() => importCsv(state(), "a;b;c\n1;2;3")).toThrow("Keine Wizzpad-CSV-Datei");
  });
});
