import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { EN } from "./en";
import { MAXIMUS_TRUMP, MODES } from "./logic";

const SRC = join(__dirname, "..");
const files = (d: string): string[] => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? files(p) : /\.(svelte|ts)$/.test(f) && !f.endsWith(".test.ts") && f !== "en.ts" ? [p] : []; });

/** Texte, die als Variable an t() gehen (Navigation, Chips, Einstellungen …) */
const DYNAMIC = [
  "Start", "Spieler", "Statistik", "Verlauf", "Wissen", "Offen", "Verdeckter Tipp", "Geheime Vorhersage", "Fokus", "Liste", "Kacheln", "☀ Hell", "☾ Dunkel", "System",
  "Aus (Wizzpad-Orange)", "Grün", "Blau", "Lila", "Rot", "Türkis", "Pink", "🇩🇪 Deutsch", "🇬🇧 English", "📱 Wie System", "Plus/minus Eins", "Jubiläumsedition",
  "Erfassen, wer die Bombe spielte", "Unerlaubte Ansage beim Dealer ausblenden", "Tasten für Wolke & Bombe in der Runde", "Für die Statistik", "Spieldauer anzeigen",
  "Uhr in Runde und Punkteübersicht", "Bildschirm wach halten", "Während eines Spiels", "Alle", "2 Spieler", "3 Spieler", "4 Spieler", "5+ Spieler",
  "Karten", "Eigene", "Anleitung", "App", "Grundregeln", "Varianten", "keine", "Ansage ±1 (wie Wolke)", "Stich zählt nicht (wie Bombe)",
  "Beide haben im selben Spiel gespielt", "Leere Datei", "Keine Wizzpad-CSV-Datei", "Bitte alle drei Dateien gemeinsam auswählen",
  ...Object.values(MODES).flatMap((m) => [m.n, m.d]), ...MAXIMUS_TRUMP,
];

function keys(): string[] {
  const k = new Set<string>(DYNAMIC);
  for (const f of files(SRC)) {
    const s = readFileSync(f, "utf8");
    for (const m of s.matchAll(/\b(?:t|tr)\(\s*(?:[a-z.]+ \? )?"((?:[^"\\]|\\.)*)"(?:\s*:\s*"((?:[^"\\]|\\.)*)")?/g)) { k.add(m[1]); if (m[2]) k.add(m[2]); }
    for (const m of s.matchAll(/\btn\([^,]+,\s*"([^"]*)",\s*"([^"]*)"/g)) { k.add(m[1]); k.add(m[2]); }
  }
  return [...k];
}
const ph = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");

describe("Übersetzung", () => {
  it("jeder Text hat eine englische Fassung", () => {
    expect(keys().filter((k) => !(k in EN))).toEqual([]);
  });
  it("Platzhalter stimmen überein", () => {
    expect(Object.entries(EN).filter(([de, en]) => ph(de) !== ph(en)).map(([de]) => de)).toEqual([]);
  });
});
