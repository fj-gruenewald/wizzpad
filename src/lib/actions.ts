import { closeRound, createGame, deleteGame, endGame, finalBid, mergePlayers, nameTaken, order, playCloud, startTricks, step, uid } from "./logic";
import { COLORS } from "./content";
import { app, ask, confirmAsk, current, go, player, toast, ui } from "./store.svelte";
import { t } from "./i18n";
import type { Id } from "./types";

export function newGame(force = false) {
  if (current() && !force) { ui.sheet = "running"; return; }
  const last = [...app.games].sort((a, b) => b.start - a.start)[0];
  go("newg", { sel: last ? last.players.filter((p) => !player(p).deleted) : [], nm: { mode: "classic", pm1: app.set.pm1, cb: app.set.cb, hid: "" } });
}
export function continueGame() {
  const rd = current()?.rounds.at(-1);
  if (!rd) return;
  go(Object.keys(rd.bids).length ? "round" : "table", { fi: 0, gid: undefined });
}
export function startGame() {
  const g = createGame(ui.sel, ui.nm);
  app.games.push(g); app.cur = g.id;
  go("round", { fi: 0 });
}
export function rematch(gid: Id) {
  const g = app.games.find((x) => x.id === gid)!;
  go("newg", { sel: g.players.slice(), nm: { mode: g.mode ?? "classic", pm1: g.pm1, cb: g.cb, hid: g.hid ?? "" } });
}
export async function addPlayer(toSelection = true) {
  const n = (await ask({ title: t("Neue Person"), text: t("Name der Person:"), input: "", ok: t("Anlegen") }))?.trim();
  if (!n) return;
  if (nameTaken(app.players, n)) return toast(t("„{n}“ gibt es schon. Bitte z. B. mit Nachnamen-Kürzel unterscheiden.", { n }));
  const p = { id: uid(), name: n, color: COLORS[app.players.length % COLORS.length] };
  app.players.push(p);
  if (toSelection && ui.sel.length < 6) ui.sel.push(p.id);
}
export async function renamePlayer(id: Id) {
  const p = player(id), n = (await ask({ title: t("Umbenennen"), text: t("Neuer Name:"), input: p.name, ok: t("Speichern") }))?.trim();
  if (!n) return;
  if (nameTaken(app.players, n, id)) return toast(t("Diesen Namen gibt es schon – ggf. Profile zusammenführen"));
  p.name = n;
}
export async function setAbbr(id: Id, all: (id: Id) => string) {
  const p = player(id), a = await ask({ title: t("Kürzel"), text: t("Kürzel im Avatar (1–2 Zeichen, leer = automatisch):"), input: p.abbr ?? all(id), ok: t("Speichern") });
  if (a === null) return;
  const v = a.trim().slice(0, 2);
  if (v && app.players.some((q) => q.id !== id && (q.abbr ?? all(q.id)).toUpperCase() === v.toUpperCase())) return toast(t("Kürzel „{v}“ ist schon vergeben", { v }));
  p.abbr = v || undefined;
}
export async function deletePlayer(id: Id) {
  const p = player(id);
  if (p.deleted) { p.deleted = false; return toast(t("{n} ist wieder sichtbar", { n: p.name })); }
  const n = app.games.filter((g) => g.players.includes(id)).length;
  if (!n) {
    if (!(await confirmAsk(t("Spieler löschen"), t("{n} endgültig löschen?", { n: p.name }), t("Löschen"), true))) return;
    app.players = app.players.filter((x) => x.id !== id); toast(t("{n} gelöscht", { n: p.name })); return go("players");
  }
  if (!(await confirmAsk(t("Spieler ausblenden"), t("{n} hat {g} Spiele. Die Person wird ausgeblendet, ihre alten Spiele bleiben erhalten. Bei einer doppelten Person besser „Zusammenführen“.", { n: p.name, g: n }), t("Ausblenden"), true))) return;
  p.deleted = true; toast(t("{n} ausgeblendet", { n: p.name })); go("players");
}
export function merge(from: Id, to: Id) {
  const f = player(from).name, tn = player(to).name;
  const err = mergePlayers(app, from, to);
  if (err) return toast(t("Geht nicht: {e}", { e: t(err) }));
  toast(t("{f} → {t} zusammengeführt", { f, t: tn })); go("prof", { pid: to });
}

/* ---------- Runde ---------- */
const rd = () => current()!.rounds.at(-1)!;
export function inc(p: Id, d: 1 | -1) {
  const g = current()!;
  if (!step(g, rd(), p, d, app.set.entry === "tiles")) toast(t("Geht nicht (Plus/minus Eins)"));
}
export function setValue(p: Id, k: number) {
  const g = current()!, r = rd(), key = r.phase === "bid" ? "bids" : "tricks";
  r[key][p] = k;
  const o = order(g, g.rounds.length);
  const nx = o.findIndex((q, i) => i > ui.fi && r[key][q] == null);
  ui.fi = nx >= 0 ? nx : Math.min(ui.fi + 1, o.length - 1);
}
export function toTricks() { startTricks(current()!, rd()); ui.fi = 0; }
export function backToBids() { rd().phase = "bid"; ui.fi = 0; }
export function cloud(p: Id, d: 1 | -1) { playCloud(rd(), p, d); ui.sheet = null; toast(t("☁️ Ansage {n}: {b}", { n: player(p).name, b: finalBid(rd(), p) })); }
export function undoCloud(p: Id) { const r = rd(), old = finalBid(r, p); delete r.cloud[p]; if (r.tricks[p] === old) r.tricks[p] = finalBid(r, p); ui.sheet = null; }
export function setBomb(v: 0 | 1) { const r = rd(); r.bomb = v; r.bombBy = v ? (ui.bp ?? r.bombBy ?? null) : null; ui.bp = null; ui.sheet = null; }
export function finishRound() {
  const g = current()!, r = rd();
  const hit = g.players.filter((p) => finalBid(r, p) === r.tricks[p]).map((p) => player(p).name);
  if (closeRound(g)) { app.cur = null; return go("end", { gid: g.id }); }
  go("table", { gid: undefined });
  toast(hit.length ? t("🎯 Getroffen: {n}", { n: hit.join(", ") }) : t("Niemand hat getroffen 🙈"));
}
export function gameOver() {
  const g = current()!; endGame(g); app.cur = null; go("end", { gid: g.id });
}
export function finishAndNew() { const g = current()!; endGame(g); app.cur = null; ui.sheet = null; toast(t("Spiel gewertet")); newGame(true); }
export function removeGame(id: Id) {
  deleteGame(app, id); ui.sheet = null; toast(t("Spiel gelöscht"));
  if (ui.after === "new") { ui.after = null; return newGame(true); }
  go("hist");
}
