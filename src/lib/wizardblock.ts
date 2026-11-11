// Import des JSON-Exports der App "Wizard Block" (siehe Vault-Notiz "Wizard Block Exportformat").
import { maxRounds, uid } from "./logic";
import type { Game, Round, State } from "./types";

interface WBGame { id: string; start_time: number; end_time?: number }
interface WBPlayer { id: string; name: string; color: number; deleted: boolean }
interface WBRow { player_id: string; game_id: string; bids: number; tricks: number; score: number; round: number }

const hex = (c: number) => "#" + ((c >>> 0) & 0xffffff).toString(16).padStart(6, "0");

export interface ImportResult { games: number; duplicates: number; players: number; mismatches: number }

/** Import in den bestehenden Zustand. Bereits vorhandene oder gelöschte Spiele werden übersprungen. */
export function importWizardBlock(s: State, games: WBGame[], players: WBPlayer[], rows: WBRow[]): ImportResult {
  const res: ImportResult = { games: 0, duplicates: 0, players: 0, mismatches: 0 };
  const map: Record<string, string> = {};
  const used = new Set(rows.map((r) => r.player_id));
  // Aktive Spieler zuerst, damit gelöschte Doppelgänger den Zusatz „(alt)“ bekommen
  for (const wp of [...players].sort((a, b) => Number(a.deleted) - Number(b.deleted))) {
    if (wp.deleted && !used.has(wp.id)) continue;
    let p = s.players.find((x) => x.wb === wp.id || x.wbIds?.includes(wp.id))
      ?? s.players.find((x) => !x.wb && !wp.deleted && x.name.toLowerCase() === wp.name.toLowerCase());
    if (!p) {
      let name = wp.name;
      if (s.players.some((x) => x.name.toLowerCase() === name.toLowerCase())) name += " (alt)";
      p = { id: uid(), wb: wp.id, name, color: hex(wp.color), deleted: wp.deleted || undefined };
      s.players.push(p); res.players++;
    } else p.wb ??= wp.id;
    map[wp.id] = p.id;
  }
  const by: Record<string, WBRow[]> = {};
  rows.forEach((r) => (by[r.game_id] ??= []).push(r));
  for (const wg of games) {
    const rs = by[wg.id];
    if (!rs) continue;
    if (s.games.some((g) => g.wb === wg.id) || s.delWb.includes(wg.id)) { res.duplicates++; continue; }
    const nums = [...new Set(rs.map((r) => r.round))].sort((a, b) => a - b);
    const ord = rs.filter((r) => r.round === nums[0]).map((r) => map[r.player_id]);
    const rounds: Round[] = nums.map((n) => {
      const rr = rs.filter((r) => r.round === n), bids: Record<string, number> = {}, tricks: Record<string, number> = {};
      rr.forEach((r) => { bids[map[r.player_id]] = r.bids; tricks[map[r.player_id]] = r.tricks; });
      const sum = rr.reduce((a, r) => a + r.tricks, 0);
      return { phase: "tricks", bids, tricks, cloud: {}, bomb: Math.max(0, n - sum), bombBy: null, done: true };
    });
    // Kontrolle: unsere Punkte = kumulierter Punktestand aus dem Export?
    const run: Record<string, number> = {};
    nums.forEach((n, i) => rs.filter((r) => r.round === n).forEach((r) => {
      const b = r.bids, t = r.tricks, p = map[r.player_id];
      run[p] = (run[p] ?? 0) + (b === t ? 20 + 10 * t : -10 * Math.abs(b - t));
      if (run[p] !== r.score) res.mismatches++;
      void i;
    }));
    const g: Game = { id: uid(), wb: wg.id, src: "wizardblock", start: wg.start_time, end: wg.end_time ?? wg.start_time,
      players: ord, mode: "classic", pm1: false, cb: true, hid: "", max: maxRounds(ord.length), rounds };
    s.games.push(g); res.games++;
  }
  return res;
}

/** Dateien (wizardGame.json, wizardPlayer.json, wizardPlayerGame.json) einlesen */
export const wbName = (n: string) => n.toLowerCase().replace(/\.json$/, "").replace(/[\s_-]*[(\[]?\d+[)\]]?$/, "").trim();

export async function readWizardBlockFiles(files: FileList | File[]) {
  const f: Record<string, unknown> = {};
  // Name normalisieren: Android hängt bei Kopien „ (1)“ o. Ä. an, Groß-/Kleinschreibung egal
  for (const x of Array.from(files)) f[wbName(x.name)] = JSON.parse(await x.text());
  const g = f["wizardgame"], p = f["wizardplayer"], r = f["wizardplayergame"];
  if (!g || !p || !r) throw new Error("Bitte alle drei Dateien gemeinsam auswählen");
  return { games: g as WBGame[], players: p as WBPlayer[], rows: r as WBRow[] };
}
