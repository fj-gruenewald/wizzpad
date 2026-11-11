// Dateien speichern oder (am Handy) über das Teilen-Menü weitergeben, Spiel als Bild.
import { finalBid, roundScore, totals, winners } from "./logic";
import type { Game } from "./types";

/** Teilen-Menü, wenn verfügbar (Android), sonst Download. Gibt "share" oder "download" zurück. */
export async function saveFile(name: string, data: Blob, preferShare = true): Promise<"share" | "download" | "cancel"> {
  const file = new File([data], name, { type: data.type });
  if (preferShare && navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: name }); return "share"; }
    catch (e) { if ((e as Error).name === "AbortError") return "cancel"; }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(data); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  return "download";
}

const css = (k: string) => getComputedStyle(document.body).getPropertyValue(k).trim();

/** Punkteübersicht eines Spiels als PNG */
export function gameImage(g: Game, o: { name: (id: string) => string; color: (id: string) => string; abbr: (id: string) => string; fg: (c: string) => string; title: string; footer: string }): Promise<Blob> {
  const rounds = g.rounds.filter((r) => r.done), n = g.players.length;
  const W = Math.max(420, 70 + n * 90), RH = 40, top = 172, H = top + (rounds.length + 1) * RH + 70, S = 2;
  const cv = document.createElement("canvas"); cv.width = W * S; cv.height = H * S;
  const c = cv.getContext("2d")!; c.scale(S, S);
  const bg = css("--bg") || "#fff8f5", tx = css("--t") || "#1d1b20", tv = css("--tv") || "#49454f", ok = css("--ok") || "#1b6c3a", err = css("--err") || "#b3261e", p = css("--p") || "#8f4c00", s2 = css("--s2") || "#fcefe6";
  const font = (sz: number, w = 400) => `${w} ${sz}px Roboto, "Noto Sans", system-ui, sans-serif`;
  c.fillStyle = bg; c.fillRect(0, 0, W, H);
  c.fillStyle = p; c.font = font(22, 700); c.textAlign = "left"; c.fillText("Wizzpad", 20, 36);
  c.fillStyle = tv; c.font = font(14); c.fillText(o.title, 20, 60);
  const win = winners(g), t = totals(g);
  c.fillStyle = tx; c.font = font(16, 600); c.fillText("🏆 " + win.map(o.name).join(" & ") + " · " + t[win[0]], 20, 88);
  const cx = (i: number) => 70 + i * ((W - 90) / n) + (W - 90) / n / 2;
  c.textAlign = "center";
  g.players.forEach((id, i) => {
    c.fillStyle = o.color(id); c.beginPath(); c.arc(cx(i), top - 48, 18, 0, 7); c.fill();
    c.fillStyle = o.fg(o.color(id)); c.font = font(14, 600); c.fillText(o.abbr(id), cx(i), top - 43);
    const nm = o.name(id); c.fillStyle = tv; c.font = font(11); c.fillText(nm.length > 12 ? nm.slice(0, 11) + "…" : nm, cx(i), top - 12);
  });
  const run: Record<string, number> = {};
  rounds.forEach((rd, r) => {
    const y = top + r * RH;
    if (r % 2 === 0) { c.fillStyle = s2; c.fillRect(10, y, W - 20, RH); }
    c.fillStyle = tv; c.font = font(13); c.fillText(String(r + 1) + (rd.bomb ? "💣" : "") + (Object.keys(rd.cloud).length ? "☁️" : ""), 38, y + 25);
    g.players.forEach((id, i) => {
      const sc = roundScore(rd, id); run[id] = (run[id] ?? 0) + sc;
      c.fillStyle = sc > 0 ? ok : err; c.font = font(15, 500); c.fillText(String(run[id]), cx(i), y + 20);
      c.fillStyle = tv; c.font = font(10); c.fillText(`${finalBid(rd, id)}/${rd.tricks[id] ?? 0}`, cx(i), y + 33);
    });
  });
  const y = top + rounds.length * RH;
  c.strokeStyle = tv; c.beginPath(); c.moveTo(10, y + 4); c.lineTo(W - 10, y + 4); c.stroke();
  c.fillStyle = tx; c.font = font(17, 700); c.fillText("Σ", 38, y + 30);
  g.players.forEach((id, i) => c.fillText(String(t[id]), cx(i), y + 30));
  c.fillStyle = tv; c.font = font(12); c.textAlign = "left"; c.fillText(o.footer, 20, H - 20);
  return new Promise((ok2) => cv.toBlob((b) => ok2(b!), "image/png"));
}
