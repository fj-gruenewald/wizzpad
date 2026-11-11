<script lang="ts">
  import { t } from "../lib/i18n";
  import Nav from "../ui/Nav.svelte";
  import Sheet from "../ui/Sheet.svelte";
  import { app, dur, fmtDate, player, ui } from "../lib/store.svelte";
  import { isEarlyEnd } from "../lib/logic";
  import { playerStats, records, totalRounds, totalTime } from "../lib/stats";
  const allg = $derived(app.games.filter((g) => g.end));
  const years = $derived([...new Set(allg.map((g) => new Date(g.start).getFullYear()))].sort((a, b) => b - a));
  const gs = $derived(allg.filter((g) => (!ui.sf.y.length || ui.sf.y.includes(new Date(g.start).getFullYear())) && (!ui.sf.n.length || ui.sf.n.includes(g.players.length >= 5 ? "5+" : String(g.players.length)))));
  const NS = $derived([...(allg.some((g) => g.players.length === 2) ? [["2", "2er"]] : []), ["3", "3er"], ["4", "4er"], ["5+", "5+"]] as [string, string][]);
  const tg = <T,>(a: T[], v: T) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v]);
  const st = $derived(playerStats(app.players, gs));
  const pl = $derived(app.players.filter((p) => st[p.id].g).sort((a, b) => st[b.id].w - st[a.id].w));
  const mw = $derived(Math.max(1, ...pl.map((p) => st[p.id].w)));
  const tot = $derived(totalTime(gs)), rounds = $derived(totalRounds(gs));
  const ds = $derived(gs.map((g) => (g.end ?? g.start) - g.start));
  const byN = $derived.by(() => { const m: Record<number, number[]> = {}; gs.forEach((g) => (m[g.players.length] ??= []).push((g.end ?? g.start) - g.start)); return m; });
  const rec = $derived(records(gs));
  const streak = $derived([...pl].sort((a, b) => st[b.id].streak - st[a.id].streak)[0]);
  const seers = $derived(pl.filter((p) => st[p.id].r >= 30).sort((a, b) => st[b.id].hit / st[b.id].r - st[a.id].hit / st[a.id].r));
  const perYear = $derived.by(() => { const m: Record<number, number> = {}; gs.forEach((g) => { const y = new Date(g.start).getFullYear(); m[y] = (m[y] ?? 0) + 1; }); return m; });
  const my = $derived(Math.max(1, ...Object.values(perYear)));
</script>
<div class="bar"><h1>{t("Statistik")}</h1></div>
<div class="main">
  <!-- Filterzeile: zwei Felder, Tippen öffnet ein Auswahlblatt mit Checkboxen (Mehrfachauswahl, leer = alle) -->
  <div class="dds">
    <button class="dd" class:on={ui.sf.y.length > 0} onclick={() => (ui.sheet = "sf-y")}><span>{ui.sf.y.length ? [...ui.sf.y].sort((a, b) => b - a).join(", ") : t("Alle Jahre")}</span><i>▾</i></button>
    <button class="dd" class:on={ui.sf.n.length > 0} onclick={() => (ui.sheet = "sf-n")}><span>{ui.sf.n.length ? NS.filter(([v]) => ui.sf.n.includes(v)).map(([, l]) => t(l)).join(", ") : t("Alle Spieler")}</span><i>▾</i></button>
  </div>
  {#if !gs.length}<div class="hint">{t("Keine Spiele für diesen Filter.")}</div>{:else}
    <div class="kp"><div class="card"><div class="mut">{t("Spiele")}</div><div class="big">{gs.length}</div></div><div class="card"><div class="mut">{t("Runden")}</div><div class="big">{rounds}</div></div></div>
    <div class="card"><div class="mut">{t("SIEGE")}</div>
      {#each pl as p (p.id)}<div class="row" style="margin-top:7px;font-size:13px"><span style="width:70px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">{p.name}</span><div class="sp" style="background:var(--s3);height:10px;border-radius:5px"><div style="width:{(100 * st[p.id].w) / mw}%;height:100%;background:var(--p);border-radius:5px"></div></div><b style="width:20px;text-align:right">{st[p.id].w}</b></div>{/each}</div>
    <div class="card" style="font-size:14px;line-height:1.9"><div class="mut">{t("DAUER")}</div>
      {t("Ø Partie")} <b style="float:right">{dur(tot / gs.length)}</b><br>{t("Ø Runde")} <b style="float:right">{dur(tot / Math.max(1, rounds))}</b><br>
      {t("Längste / kürzeste")} <b style="float:right">{dur(Math.max(...ds))} / {dur(Math.min(...ds))}</b><br>{t("Gesamt gespielt")} <b style="float:right">{dur(tot)}</b>
      <div class="mut" style="margin-top:6px">{t("Ø Dauer nach Spieleranzahl")}</div>
      {#each Object.keys(byN).sort() as k}<div>{t("{n} Spieler", { n: k })} <b style="float:right">{dur(byN[+k].reduce((a, b) => a + b, 0) / byN[+k].length)} ({byN[+k].length}×)</b></div>{/each}</div>
    <div class="card" style="font-size:14px;line-height:1.9"><div class="mut">{t("SONSTIGES")}</div>{t("Vorzeitig beendet")} <b style="float:right">{t("{a} von {n}", { a: gs.filter(isEarlyEnd).length, n: gs.length })}</b><br>{t("Runden mit Bombe")} <b style="float:right">{gs.reduce((a, g) => a + g.rounds.filter((r) => r.done && r.bomb).length, 0)}</b></div>
    {#if rec.top && rec.low && rec.bestR && rec.worstR}
      <div class="card" style="font-size:14px;line-height:1.9"><div class="mut">{t("REKORDE")}</div>
        🏆 {t("Höchster Endstand")}: <b>{rec.top.v}</b> {player(rec.top.p).name} <span class="mut">{fmtDate(rec.top.g.start)}</span><br>
        🥶 {t("Tiefster Endstand")}: <b>{rec.low.v}</b> {player(rec.low.p).name} <span class="mut">{fmtDate(rec.low.g.start)}</span><br>
        🚀 {t("Beste Runde")}: <b>+{rec.bestR.v}</b> {player(rec.bestR.p).name} <span class="mut">{t("R")}{rec.bestR.r}, {fmtDate(rec.bestR.g.start)}</span><br>
        📉 {t("Größter Absturz")}: <b>{rec.worstR.v}</b> {player(rec.worstR.p).name} <span class="mut">{t("R")}{rec.worstR.r}, {fmtDate(rec.worstR.g.start)}</span><br>
        {#if rec.highHit}🎯 {t("Höchste getroffene Ansage")}: <b>{rec.highHit.v}</b> {player(rec.highHit.p).name}<br>{/if}
        {#if streak}🔥 {t("Längste Trefferserie")}: <b>{st[streak.id].streak}</b> {streak.name}{/if}</div>
    {/if}
    {#if seers.length}
      <div class="card"><div class="mut">🔮 {t("WAHRSAGER-RANKING (Trefferquote, ab 30 Runden)")}</div>
        {#each seers as p (p.id)}<div class="row" style="margin-top:7px;font-size:13px"><span style="width:70px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">{p.name}</span><div class="sp" style="background:var(--s3);height:10px;border-radius:5px"><div style="width:{(100 * st[p.id].hit) / st[p.id].r}%;height:100%;background:var(--ok);border-radius:5px"></div></div><b style="width:36px;text-align:right">{Math.round((100 * st[p.id].hit) / st[p.id].r)}%</b></div>{/each}</div>
    {/if}
    <div class="card"><div class="mut">{t("SPIELE PRO JAHR")}</div>
      <div class="spark" style="height:70px;margin-top:6px">{#each Object.keys(perYear) as y}<i style="height:{(100 * perYear[+y]) / my}%"></i>{/each}</div>
      <div class="row mut" style="justify-content:space-around">{#each Object.keys(perYear) as y}<span>{y}: {perYear[+y]}</span>{/each}</div></div>
  {/if}
</div>
{#snippet pick(title: string, all: string, opts: [string | number, string][], sel: (string | number)[], toggle: (v: any) => void, clear: () => void)}
  <Sheet>
    <h2>{title}</h2>
    <button class="li" onclick={clear}><span class="cb" class:on={!sel.length}></span><span class="sp">{all}</span></button>
    {#each opts as [v, l]}<button class="li" onclick={() => toggle(v)}><span class="cb" class:on={sel.includes(v)}></span><span class="sp">{l}</span></button>{/each}
    <button class="btn" style="flex:none;margin-top:4px" onclick={() => (ui.sheet = null)}>{t("Fertig")}</button>
  </Sheet>
{/snippet}
{#if ui.sheet === "sf-y"}{@render pick(t("Jahr"), t("Alle Jahre"), years.map((y) => [y, String(y)] as [number, string]), ui.sf.y, (v: number) => (ui.sf.y = tg(ui.sf.y, v)), () => (ui.sf.y = []))}
{:else if ui.sheet === "sf-n"}{@render pick(t("Spieleranzahl"), t("Alle Spieler"), NS.map(([v, l]) => [v, t(l)] as [string, string]), ui.sf.n, (v: string) => (ui.sf.n = tg(ui.sf.n, v)), () => (ui.sf.n = []))}{/if}
<Nav active="stats" />
