import { describe, expect, it } from "vitest";
import { abbreviations, bidsComplete, closeRound, createGame, dealer, endGame, finalBid, forbiddenBid, mergePlayers, order, playCloud, roundScore, startTricks, starter, step, totals, tricksComplete, winners } from "./logic";
import type { State } from "./types";

const four = () => createGame(["a", "b", "c", "d"], { mode: "classic", pm1: true, cb: true, hid: "" });

describe("Wertung", () => {
  it("getroffen: 20 + 10 je Stich, daneben −10 je Stich", () => {
    const rd = { phase: "tricks" as const, bids: { a: 2, b: 0, c: 1 }, tricks: { a: 2, b: 0, c: 3 }, cloud: {}, bomb: 0, done: true };
    expect(roundScore(rd, "a")).toBe(40);
    expect(roundScore(rd, "b")).toBe(20);
    expect(roundScore(rd, "c")).toBe(-20);
  });
  it("Wolke ändert die gewertete Ansage", () => {
    const rd = { phase: "tricks" as const, bids: { a: 1 }, tricks: { a: 2 }, cloud: { a: 1 }, bomb: 0, done: true };
    expect(finalBid(rd, "a")).toBe(2);
    expect(roundScore(rd, "a")).toBe(40);
  });
});

describe("Reihenfolge", () => {
  it("erste Person beginnt, letzte ist Dealer, rotiert jede Runde", () => {
    const g = four();
    expect(order(g, 1)).toEqual(["a", "b", "c", "d"]);
    expect(starter(g, 2)).toBe("b");
    expect(dealer(g, 2)).toBe("a");
    expect(order(g, 5)).toEqual(["a", "b", "c", "d"]);
  });
});

describe("Plus/minus Eins", () => {
  it("verbietet dem Dealer die Ansage, mit der es aufgeht", () => {
    const g = four(), rd = g.rounds[0];
    rd.bids = { a: 0, b: 0, c: 0 };
    expect(forbiddenBid(g, rd, "d")).toBe(1);
    expect(forbiddenBid(g, rd, "a")).toBeNull();
  });
  it("step springt über die verbotene Ansage, sonst bleibt der Wert", () => {
    const g = four(), rd = g.rounds[0];
    rd.bids = { a: 0, b: 0, c: 0 };
    expect(step(g, rd, "d", 1)).toBe(true); // undefined → 0
    expect(rd.bids.d).toBe(0);
    expect(step(g, rd, "d", 1)).toBe(false); // 1 verboten, 2 > Kartenzahl
    expect(rd.bids.d).toBe(0);
  });
  it("Ansagen gelten erst als fertig, wenn der Dealer erlaubt angesagt hat", () => {
    const g = four(), rd = g.rounds[0];
    rd.bids = { a: 0, b: 0, c: 0, d: 1 };
    expect(bidsComplete(g, rd)).toBe(false);
    rd.bids.d = 0;
    expect(bidsComplete(g, rd)).toBe(true);
  });
  it("ist bei verdeckten Ansagen aus", () => {
    const g = createGame(["a", "b", "c"], { mode: "classic", pm1: true, cb: true, hid: "tip" });
    g.rounds[0].bids = { a: 0, b: 0 };
    expect(forbiddenBid(g, g.rounds[0], "c")).toBeNull();
  });
});

describe("Runde spielen", () => {
  it("Stiche werden mit den Ansagen vorbefüllt, Bombe zieht einen Stich ab", () => {
    const g = four(), rd = g.rounds[0];
    rd.bids = { a: 1, b: 0, c: 0, d: 1 };
    rd.bomb = 1;
    startTricks(g, rd);
    expect(rd.tricks).toEqual({ a: 0, b: 0, c: 0, d: 0 });
    expect(tricksComplete(g, rd)).toBe(true);
  });
  it("Wolke passt vorbefüllte Stiche an", () => {
    const g = four();
    const rd = g.rounds[0];
    rd.bids = { a: 0, b: 1, c: 0, d: 0 };
    startTricks(g, rd);
    playCloud(rd, "b", -1);
    expect(finalBid(rd, "b")).toBe(0);
    expect(rd.tricks.b).toBe(0);
  });
  it("Spiel endet an der natürlichen Grenze, Game over wertet nur abgeschlossene Runden", () => {
    const g = createGame(["a", "b", "c"], { mode: "maximus", pm1: false, cb: false, hid: "" });
    expect(g.max).toBe(5);
    for (let i = 0; i < 4; i++) expect(closeRound(g)).toBe(false);
    expect(closeRound(g)).toBe(true);
    const h = four();
    h.rounds[0].bids = { a: 0, b: 0, c: 0, d: 0 }; h.rounds[0].tricks = { a: 0, b: 0, c: 1, d: 0 };
    closeRound(h);
    endGame(h);
    expect(h.rounds.length).toBe(1);
    expect(totals(h)).toEqual({ a: 20, b: 20, c: -10, d: 20 });
    expect(winners(h)).toEqual(["a", "b", "d"]);
  });
  it("Einfarbig: Kartenzahl = Runde + 3, Sonderkarten aus", () => {
    const g = createGame(["a", "b", "c"], { mode: "mono", pm1: true, cb: true, hid: "" });
    expect(g.cb).toBe(false);
    g.rounds[0].bids = { a: 0, b: 0 };
    expect(forbiddenBid(g, g.rounds[0], "c")).toBe(4);
  });
});

describe("Spieler", () => {
  const S = (): State => ({ v: 1, players: [
    { id: "1", name: "Bea", color: "#ff0" }, { id: "2", name: "Ben", color: "#0f0" }, { id: "3", name: "Ben K.", color: "#00f" }, { id: "4", name: "Ben K. (alt)", color: "#0ff" },
  ], games: [{ ...four(), players: ["1", "2"] }, { ...four(), players: ["1", "4"] }], cur: null, set: {} as State["set"], cards: [], cardOv: {}, delWb: [] });
  it("Kürzel sind eindeutig", () => {
    const a = abbreviations(S());
    expect(new Set(Object.values(a)).size).toBe(4);
    expect(a["1"]).toBe("B");
    expect(a["4"]).toBe("BK"); // wer mehr spielt, bekommt das kürzere Kürzel
  });
  it("Zusammenführen überträgt Spiele, blockiert bei gemeinsamem Spiel", () => {
    const s = S();
    expect(mergePlayers(s, "4", "3")).toBeNull();
    expect(s.games[1].players).toContain("3");
    expect(s.players.length).toBe(3);
    expect(mergePlayers(s, "2", "1")).not.toBeNull();
  });
});

import { readFileSync } from "node:fs";
import { importWizardBlock } from "./wizardblock";
describe("Wizard-Block-Import", () => {
  const rd = (f: string) => JSON.parse(readFileSync(new URL("../../data/" + f, import.meta.url), "utf8"));
  const empty = (): State => ({ v: 1, players: [], games: [], cur: null, set: {} as State["set"], cards: [], cardOv: {}, delWb: [] });
  it("importiert den echten Export ohne Punkte-Abweichung, zweiter Import ohne Duplikate", () => {
    const s = empty();
    const r1 = importWizardBlock(s, rd("wizardGame.json"), rd("wizardPlayer.json"), rd("wizardPlayerGame.json"));
    expect(r1.games).toBe(18);
    expect(r1.mismatches).toBe(0);
    expect(s.games.reduce((a, g) => a + g.rounds.length, 0)).toBe(200);
    expect(s.games.reduce((a, g) => a + g.rounds.filter((x) => x.bomb).length, 0)).toBe(73);
    const r2 = importWizardBlock(s, rd("wizardGame.json"), rd("wizardPlayer.json"), rd("wizardPlayerGame.json"));
    expect(r2.games).toBe(0);
    expect(r2.duplicates).toBe(18);
    expect(s.players.find((p) => p.name === "Ben K.")?.deleted).toBeFalsy();
    expect(s.players.find((p) => p.name === "Ben K. (alt)")?.deleted).toBe(true);
  });
  it("Reihenfolge: Spiel vom 07.11.2026 – Mia beginnt, Max gibt", () => {
    const s = empty();
    importWizardBlock(s, rd("wizardGame.json"), rd("wizardPlayer.json"), rd("wizardPlayerGame.json"));
    const g = s.games.sort((a, b) => b.start - a.start)[0];
    const name = (id: string) => s.players.find((p) => p.id === id)!.name;
    expect(name(starter(g, 1))).toBe("Mia");
    expect(name(dealer(g, 1))).toBe("Max");
  });
});
