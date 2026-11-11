<script lang="ts">
  import { t } from "../lib/i18n";
  import Avatar from "../ui/Avatar.svelte";
  import Bar from "../ui/Bar.svelte";
  import { abbr, app, dur, fmtDate, go, player, ui } from "../lib/store.svelte";
  import { playerStats } from "../lib/stats";
  import { deletePlayer, renamePlayer, setAbbr } from "../lib/actions";
  const p = $derived(player(ui.pid!));
  const s = $derived(playerStats(app.players, app.games)[ui.pid!]);
  const pc = (a: number) => (s.r ? Math.round((100 * a) / s.r) : 0);
  const vs = $derived(Object.entries(s?.vs ?? {}).filter(([, v]) => v.w + v.l >= 3).sort((a, b) => b[1].w + b[1].l - (a[1].w + a[1].l)));
  const riv = $derived([...vs].sort((a, b) => a[1].w - a[1].l - (b[1].w - b[1].l))[0]);
  const fav = $derived(Object.keys(s?.bids ?? {}).sort((a, b) => s.bids[+b] - s.bids[+a])[0] ?? "–");
</script>
<Bar title={p.name} back={() => go("players")}>{#snippet right()}<button class="ib" onclick={() => renamePlayer(p.id)} aria-label={t("Umbenennen")}>✎</button>{/snippet}</Bar>
{#if s}
<div class="main">
  <div class="kp">
    <div class="card"><div class="mut">{t("Siegquote")}</div><div class="big">{s.g ? Math.round((100 * s.w) / s.g) : 0}%</div></div>
    <div class="card"><div class="mut">{t("Ansage getroffen")}</div><div class="big">{pc(s.hit)}%</div></div>
    <div class="card"><div class="mut">{t("Ø Punkte / Runde")}</div><div class="big">{s.r ? (s.pts / s.r).toFixed(1) : 0}</div></div>
    <div class="card"><div class="mut">{t("Rekord")}</div><div class="big">{s.best}</div></div>
  </div>
  <div class="card"><div class="mut">{t("ANSAGE-TENDENZ")}</div>
    <div class="row mut" style="margin-top:6px"><span>{t("zu wenig {p}%", { p: pc(s.under) })}</span><span class="sp"></span><span>{t("zu viel {p}%", { p: pc(s.over) })}</span></div>
    <div style="display:flex;height:10px;border-radius:5px;overflow:hidden;margin-top:4px"><i style="width:{pc(s.under)}%;background:#4a90d9"></i><i style="width:{pc(s.hit)}%;background:var(--ok)"></i><i style="width:{pc(s.over)}%;background:var(--err)"></i></div></div>
  <div class="card" style="font-size:14px;line-height:1.8">🎲 {t("{g} Spiele · {r} Runden", { g: s.g, r: s.r })} · ⏱ {dur(s.time)}<br>🔥 {t("Längste Trefferserie: {n} Runden", { n: s.streak })}<br>🚀 {t("Beste Runde")}: +{s.bestR}<br>
    🏆 {t("Bestes Spiel")}: {s.best}{s.bestG ? ` (${fmtDate(s.bestG.start)})` : ""}<br>🎯 {t("Lieblings-Ansage")}: {fav}<br>😴 {t("Ansage 0")}: {s.zero}× · 💣 {t("gespielt")}: {s.bombs}</div>
  {#if vs.length}
    <div class="card"><div class="mut">{t("DIREKTER VERGLEICH (vor / hinter)")}</div>
      {#each vs as [q, v] (q)}<div class="row" style="margin-top:7px"><Avatar id={q} /><span class="sp nm" style="font-size:14px">{player(q).name}</span><b class="pos">{v.w}</b>:<b class="neg">{v.l}</b></div>{/each}</div>
    <div class="card t row" style="gap:14px"><div style="font-size:30px">⚔️</div><Avatar id={riv[0]} big /><div class="sp"><div class="mut" style="color:inherit;opacity:.8">{t("ANGSTGEGNER")}</div>
      <div class="big" style="font-size:22px">{player(riv[0]).name}</div><div style="font-size:13px">{riv[1].w} : {riv[1].l} · {t(riv[1].l > riv[1].w ? "liegt öfter vorn" : "knappste Bilanz")}</div></div></div>
  {/if}
  <hr class="div">
  <div class="row" style="gap:8px"><button class="btn out" onclick={() => setAbbr(p.id, abbr)}>{t("Kürzel")}: {abbr(p.id)}</button><button class="btn out" onclick={() => (ui.sheet = "merge")}>{t("Zusammenführen")}</button></div>
  <button class="btn out" style="flex:none;color:var(--err)" onclick={() => deletePlayer(p.id)}>{t(p.deleted ? "Wieder einblenden" : "Spieler löschen")}</button>
</div>
{/if}
