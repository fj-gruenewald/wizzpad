<script lang="ts">
  import { t } from "../lib/i18n";
  import Avatar from "../ui/Avatar.svelte";
  import Nav from "../ui/Nav.svelte";
  import GameItem from "../ui/GameItem.svelte";
  import { app, current, dur, go, player, ui } from "../lib/store.svelte";
  import { MODES, order, totals } from "../lib/logic";
  import { continueGame, newGame } from "../lib/actions";
  const g = $derived(current());
  const recent = $derived([...app.games].filter((x) => x.end).sort((a, b) => b.start - a.start).slice(0, 4));
</script>
<div class="bar"><h1>Wizzpad</h1><button class="ib" onclick={() => go("settings")} aria-label={t("Einstellungen")}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61zM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z"/></svg></button></div>
<div class="main">
  {#if g}
    {@const r = g.rounds.length}{@const o = order(g, r)}{@const sc = totals(g)}{@const lead = [...g.players].sort((a, b) => sc[b] - sc[a])[0]}
    <div class="card t">
      <div class="mut" style="color:inherit;opacity:.8">{t("LAUFENDES SPIEL")}{app.set.timer ? " · ⏱ " + dur(ui.now - g.start) : ""}</div>
      <div class="row" style="margin:6px 0"><b style="font-size:20px">{t("Runde {r}", { r })}{g.mode !== "classic" ? " · " + t(MODES[g.mode].n) : ""}</b></div>
      <div class="row" style="gap:6px">{#each g.players as p}<Avatar id={p} role={p === o[0] ? "st" : p === o.at(-1) ? "dl" : ""} />{/each}</div>
      <div class="mut" style="color:inherit;margin-top:8px">{t("{a} beginnt · 🃏 {d} · führt: {l} {p}", { a: player(o[0]).name, d: player(o.at(-1)!).name, l: player(lead).name, p: sc[lead] })}</div>
      <div class="row" style="margin-top:10px"><button class="btn" onclick={continueGame}>{t("Weiterspielen")}</button></div>
    </div>
  {/if}
  <button class="btn {g ? 'ton' : ''}" style="flex:none" onclick={() => newGame()}>＋ {t("Neues Spiel")}</button>
  {#if !app.games.length}
    <div class="hint">{t("Noch keine Spiele. Lege ein neues Spiel an oder importiere deine Wizard-Block-Daten.")}</div>
    <button class="btn out" style="flex:none" onclick={() => go("data")}>⇅ {t("Import & Export")}</button>
  {/if}
  {#if recent.length}<div class="cap">{t("Letzte Spiele")}</div>{#each recent as x (x.id)}<GameItem g={x} />{/each}{/if}
</div>
<!-- Versionsnummer: zeigt, ob ein Update geladen wurde -->
<div style="text-align:center;font-size:11px;opacity:.4;padding:2px 0 4px;color:var(--tv)">v{__VERSION__}</div>
<Nav active="home" />
