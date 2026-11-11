<script lang="ts">
  import { t } from "../lib/i18n";
  import Avatar from "../ui/Avatar.svelte";
  import Bar from "../ui/Bar.svelte";
  import { app, go, player, toast, ui } from "../lib/store.svelte";
  import { MODES } from "../lib/logic";
  import { addPlayer, startGame } from "../lib/actions";
  import type { Mode } from "../lib/types";
  const rest = $derived(app.players.filter((p) => !p.deleted && !ui.sel.includes(p.id)));
  const n = $derived(ui.sel.length);
  const classic = $derived(ui.nm.mode === "classic");
  $effect(() => { const m = MODES[ui.nm.mode]; if (m.ok && n && !m.ok(n)) ui.nm.mode = "classic"; });
  function toggle(id: string) { const i = ui.sel.indexOf(id); if (i >= 0) ui.sel.splice(i, 1); else if (ui.sel.length < 6) ui.sel.push(id); else toast(t("Maximal 6 Spieler")); }
  function move(i: number, d: number) { const j = i + d; if (j < 0 || j >= ui.sel.length) return; [ui.sel[i], ui.sel[j]] = [ui.sel[j], ui.sel[i]]; }
</script>
<Bar title={t("Neues Spiel")} back={() => go("home")} />
<div class="main">
  <div class="cap">{t("Spieler in Sitzreihenfolge antippen")}</div>
  {#each ui.sel as id, i (id)}
    <div class="li">
      <Avatar {id} role={i === 0 ? "st" : i === n - 1 && n > 1 ? "dl" : ""} />
      <div class="sp"><span class="nm">{player(id).name}</span>
        <span class="sub">{#if i === 0}<span class="rs">{t("beginnt")}</span> {t("in Runde 1")}{:else if i === n - 1 && n > 1}<span class="rd">{t("Dealer")}</span> {t("in Runde 1")}{:else}{t("Platz {n}", { n: i + 1 })}{/if}</span></div>
      <button class="ib" onclick={() => move(i, -1)} aria-label={t("hoch")}>↑</button><button class="ib" onclick={() => move(i, 1)} aria-label={t("runter")}>↓</button><button class="ib" onclick={() => toggle(id)} aria-label={t("entfernen")}>✕</button>
    </div>
  {/each}
  <div class="chips">{#each rest as p (p.id)}<button class="chip" onclick={() => toggle(p.id)}>＋ {p.name}</button>{/each}<button class="chip" onclick={() => addPlayer()}>＋ {t("Neue Person")}</button></div>

  <div class="cap">{t("Spielmodus")}</div>
  {#each Object.entries(MODES) as [k, m]}
    {@const dis = !!(m.ok && n && !m.ok(n))}
    <button class="li" style="border:none;font:inherit;color:inherit;text-align:left;{dis ? 'opacity:.4' : ''}" onclick={() => (dis ? toast(t("Nur mit 3–4 Personen")) : (ui.nm.mode = k as Mode))}>
      <span style="font-size:18px">{ui.nm.mode === k ? "◉" : "○"}</span><div class="sp">{t(m.n)}<span class="sub">{t(m.d)}</span></div>
    </button>
  {/each}
  <div class="cap">{t("Regeln")}</div>
  <button class="li" style="border:none;font:inherit;color:inherit;text-align:left;{ui.nm.hid ? 'opacity:.4' : ''}" onclick={() => (ui.nm.pm1 = !ui.nm.pm1)}>
    <div class="sp">{t("Plus/minus Eins")}{#if ui.nm.hid}<span class="sub">{t("nicht mit verdeckten Ansagen")}</span>{/if}</div><div class="tog" class:on={ui.nm.pm1 && !ui.nm.hid}></div></button>
  <button class="li" style="border:none;font:inherit;color:inherit;text-align:left;{classic ? '' : 'opacity:.4'}" onclick={() => (classic ? (ui.nm.cb = !ui.nm.cb) : toast(t("Nur im klassischen Modus")))}>
    <div class="sp">{t("Jubiläumsedition")}<span class="sub">{t(classic ? "Wolke & Bombe in der Runde" : "nicht mit Sonderkarten spielbar")}</span></div><div class="tog" class:on={ui.nm.cb && classic}></div></button>
  <div class="cap">{t("Ansagen")}</div>
  <div class="chips">{#each [["", "Offen"], ["tip", "Verdeckter Tipp"], ["secret", "Geheime Vorhersage"]] as [k, l]}<button class="chip" class:on={ui.nm.hid === k} onclick={() => (ui.nm.hid = k as "" | "tip" | "secret")}>{t(l)}</button>{/each}</div>
</div>
<div class="foot"><button class="btn" disabled={n < 2} onclick={startGame}>{t("Spiel starten ({n} Spieler)", { n })}</button></div>
