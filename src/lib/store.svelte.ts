import { abbreviations } from "./logic";
import { CARDS, CARDS_EN } from "./content";
import type { Card, Game, Id, Player, Settings, State } from "./types";

const KEY = "wizzpad";
const DEFAULT_SET: Settings = { entry: "focus", pm1: true, cb: true, bombBy: true, timer: true, wake: true, mode: "light", dyn: "", lang: "de", size: "m" };

function load(): State {
  try {
    const x = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (x?.v === 1) return { ...x, set: { ...DEFAULT_SET, ...x.set }, cards: x.cards ?? [], cardOv: x.cardOv ?? {}, delWb: x.delWb ?? [] };
  } catch { /* defekt → neu */ }
  return { v: 1, players: [], games: [], cur: null, set: { ...DEFAULT_SET }, cards: [], cardOv: {}, delWb: [] };
}

export const app: State = $state(load());

/** Aktuelle Ansicht + offene Dialoge (nicht gespeichert) */
export const ui = $state<{
  v: string; gid?: Id; pid?: Id; n?: string; fi: number; tab: string; q: string; open: string | null; sf: { y: number[]; n: string[] };
  sheet: string | null; cp: Id | null; bp: Id | null; er?: number; eg?: Id; dg?: Id; after?: string | null; showDel: boolean;
  sel: Id[]; nm: { mode: Game["mode"]; pm1: boolean; cb: boolean; hid: Game["hid"] }; toast: string | null; now: number;
}>({
  v: "home", fi: 0, tab: "cards", q: "", open: null, sf: { y: [], n: [] }, sheet: null, cp: null, bp: null, showDel: false,
  sel: [], nm: { mode: "classic", pm1: true, cb: true, hid: "" }, toast: null, now: Date.now(),
});

$effect.root(() => {
  $effect(() => { localStorage.setItem(KEY, JSON.stringify(app)); });
});
setInterval(() => (ui.now = Date.now()), 30_000);

/** App-eigener Dialog statt prompt()/confirm() (die gibt es z. B. im Obsidian-Web-Viewer nicht) */
export interface Ask { title: string; text?: string; input?: string; ok: string; danger?: boolean; done: (v: string | null) => void }
export const dlg = $state<{ a: Ask | null }>({ a: null });
export function ask(o: Omit<Ask, "done">): Promise<string | null> {
  return new Promise((done) => { dlg.a?.done(null); dlg.a = { ...o, done }; });
}
export const confirmAsk = async (title: string, text: string, ok: string, danger = false) => (await ask({ title, text, ok, danger })) !== null;

let toastTimer: ReturnType<typeof setTimeout> | undefined;
export function toast(m: string) { ui.toast = m; clearTimeout(toastTimer); toastTimer = setTimeout(() => (ui.toast = null), 2400); }

export function go(v: string, extra: Partial<typeof ui> = {}) { Object.assign(ui, { sheet: null, ...extra, v }); document.querySelector(".main")?.scrollTo(0, 0); }

export const player = (id: Id): Player => app.players.find((p) => p.id === id) ?? { id, name: "?", color: "#888" };
export const current = (): Game | undefined => app.games.find((g) => g.id === app.cur);

let abbrCache: { key: string; m: Record<Id, string> } | null = null;
export function abbr(id: Id) {
  const key = app.players.map((p) => p.id + p.name + (p.abbr ?? "")).join("|") + app.games.length;
  if (abbrCache?.key !== key) abbrCache = { key, m: abbreviations(app) };
  return abbrCache.m[id] ?? "?";
}

export function allCards(): Card[] {
  const en = lang() === "en";
  return [
    ...CARDS.map((c) => {
      const x = en && CARDS_EN[c.n] ? { ...c, ...CARDS_EN[c.n] } : c;
      return app.cardOv[c.n] ? { ...x, ...app.cardOv[c.n], mod: true } : x;
    }),
    ...app.cards.map((c) => ({ ...c, own: true })),
  ];
}

/** Aktive Sprache (Einstellung „Wie System“ → Browsersprache) */
export const lang = (): "de" | "en" => (app.set.lang === "system" ? (navigator.language.toLowerCase().startsWith("de") ? "de" : "en") : app.set.lang);
export const fmtDate = (ts: number) => new Date(ts).toLocaleDateString(lang() === "en" ? "en-GB" : "de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
export function dur(ms: number) { const m = Math.round(ms / 60000); return m < 60 ? m + " min" : Math.floor(m / 60) + ":" + String(m % 60).padStart(2, "0") + " h"; }
export function fg(hex: string) {
  const n = parseInt((hex || "#888").slice(1), 16), l = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return l > 0.62 ? "#1d1b20" : "#fff";
}

export function applyTheme() {
  const m = app.set.mode === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : app.set.mode;
  document.body.className = (m === "dark" ? "dark " : "") + (app.set.dyn || "");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", getComputedStyle(document.body).getPropertyValue("--bg").trim() || "#fff8f5");
}
