<script lang="ts">
  import { t } from "../lib/i18n";
  import Avatar from "../ui/Avatar.svelte";
  import Nav from "../ui/Nav.svelte";
  import { app, go, ui } from "../lib/store.svelte";
  import { playerStats } from "../lib/stats";
  import { addPlayer } from "../lib/actions";
  const st = $derived(playerStats(app.players, app.games));
  const hid = $derived(app.players.filter((p) => p.deleted).length);
  const pl = $derived(app.players.filter((p) => (ui.showDel ? p.deleted : !p.deleted)).sort((a, b) => st[b.id].w - st[a.id].w || st[b.id].g - st[a.id].g));
</script>
<div class="bar"><h1>{t("Spieler")}</h1><button class="ib" onclick={() => addPlayer(false)} aria-label={t("Spieler anlegen")}>＋</button></div>
<div class="main">
  {#if hid}<div class="chips"><button class="chip" class:on={!ui.showDel} onclick={() => (ui.showDel = false)}>{t("Aktiv")}</button><button class="chip" class:on={ui.showDel} onclick={() => (ui.showDel = true)}>{t("Ausgeblendet ({n})", { n: hid })}</button></div>{/if}
  {#if !pl.length}<div class="hint">{t("Noch keine Spieler.")}</div>{/if}
  {#each pl as p (p.id)}
    {@const s = st[p.id]}
    <button class="li" onclick={() => go("prof", { pid: p.id })}><Avatar id={p.id} /><div class="sp"><span class="nm">{p.name}</span><span class="sub">{t("{g} Spiele · {w} Siege", { g: s.g, w: s.w })}</span></div>
      <div style="text-align:right"><b>{s.g ? Math.round((100 * s.w) / s.g) : 0}%</b><div class="mut">{t("Siegquote")}</div></div></button>
  {/each}
</div>
<Nav active="players" />
