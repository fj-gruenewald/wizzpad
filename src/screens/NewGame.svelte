<script lang="ts">
  import { t } from "../lib/i18n";
  import Avatar from "../ui/Avatar.svelte";
  import Bar from "../ui/Bar.svelte";
  import Sheet from "../ui/Sheet.svelte";
  import { app, go, player, toast, ui } from "../lib/store.svelte";
  import { MODES } from "../lib/logic";
  import { addPlayer, startGame } from "../lib/actions";
  import type { Mode } from "../lib/types";
  import { flip } from "svelte/animate";
  const rest = $derived(app.players.filter((p) => !p.deleted && !ui.sel.includes(p.id)));
  const n = $derived(ui.sel.length);
  const classic = $derived(ui.nm.mode === "classic");
  $effect(() => { const m = MODES[ui.nm.mode]; if (m.ok && n && !m.ok(n)) ui.nm.mode = "classic"; });
  function toggle(id: string) { const i = ui.sel.indexOf(id); if (i >= 0) ui.sel.splice(i, 1); else if (ui.sel.length < 6) ui.sel.push(id); else toast(t("Maximal 6 Spieler")); }
  // Ziehen am Griff: Zeile folgt dem Finger, Reihenfolge ändert sich live beim Überfahren der Nachbarzeile
  let list: HTMLDivElement;
  let drag = $state<{ id: string; y0: number; dy: number } | null>(null);
  function down(e: PointerEvent, id: string) {
    e.preventDefault(); (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag = { id, y0: e.clientY, dy: 0 };
  }
  function moveP(e: PointerEvent) {
    if (!drag) return;
    drag.dy = e.clientY - drag.y0;
    const rows = [...list.querySelectorAll<HTMLElement>(".li")], i = ui.sel.indexOf(drag.id), r = rows[i];
    if (!r) return;
    const z = parseFloat(getComputedStyle(document.getElementById("ph")!).zoom || "1") || 1, h = r.offsetHeight * z;
    const j = drag.dy > h / 2 ? i + 1 : drag.dy < -h / 2 ? i - 1 : i;
    if (j !== i && j >= 0 && j < ui.sel.length) { ui.sel.splice(i, 1); ui.sel.splice(j, 0, drag.id); drag.y0 += (j - i) * h; drag.dy = e.clientY - drag.y0; }
  }
  const up = () => (drag = null);
</script>
<Bar title={t("Neues Spiel")} back={() => go("home")} />
<div class="main">
  <div class="cap">{t("Spieler in Sitzreihenfolge antippen")}</div>
  <div bind:this={list}>
  {#each ui.sel as id, i (id)}
    <div class="li" class:drag={drag?.id === id} style={drag?.id === id ? `transform:translateY(${drag.dy / (parseFloat(getComputedStyle(document.getElementById("ph")!).zoom || "1") || 1)}px)` : ""} animate:flip={{ duration: drag?.id === id ? 0 : 150 }}>
      <span class="grip" role="button" tabindex="-1" aria-label={t("Ziehen zum Verschieben")} onpointerdown={(e) => down(e, id)} onpointermove={moveP} onpointerup={up} onpointercancel={up}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg></span>
      <Avatar {id} role={i === 0 ? "st" : i === n - 1 && n > 1 ? "dl" : ""} />
      <div class="sp"><span class="nm">{player(id).name}</span>
        <span class="sub">{#if i === 0}<span class="rs">{t("beginnt")}</span> {t("in Runde 1")}{:else if i === n - 1 && n > 1}<span class="rd">{t("Dealer")}</span> {t("in Runde 1")}{:else}{t("Platz {n}", { n: i + 1 })}{/if}</span></div>
      <button class="ib" onclick={() => toggle(id)} aria-label={t("entfernen")}>✕</button>
    </div>
  {/each}
  </div>
  <div class="chips">{#each rest as p (p.id)}<button class="chip" onclick={() => toggle(p.id)}>＋ {p.name}</button>{/each}<button class="chip" onclick={() => addPlayer()}>＋ {t("Neue Person")}</button></div>

  <div class="cap">{t("Spielmodus")}</div>
  <button class="dd" style="flex:none;width:100%;padding:12px 16px;font-size:16px" onclick={() => (ui.sheet = "mode")}><span>{t(MODES[ui.nm.mode ?? "classic"].n)}<span class="sub">{t(MODES[ui.nm.mode ?? "classic"].d)}</span></span><i>▾</i></button>
  <div class="cap">{t("Regeln")}</div>
  <button class="li" style="border:none;font:inherit;color:inherit;text-align:left;{ui.nm.hid ? 'opacity:.4' : ''}" onclick={() => (ui.nm.pm1 = !ui.nm.pm1)}>
    <div class="sp">{t("Plus/minus Eins")}{#if ui.nm.hid}<span class="sub">{t("nicht mit verdeckten Ansagen")}</span>{/if}</div><div class="tog" class:on={ui.nm.pm1 && !ui.nm.hid}></div></button>
  <button class="li" style="border:none;font:inherit;color:inherit;text-align:left;{classic ? '' : 'opacity:.4'}" onclick={() => (classic ? (ui.nm.cb = !ui.nm.cb) : toast(t("Nur im klassischen Modus")))}>
    <div class="sp">{t("Jubiläumsedition")}<span class="sub">{t(classic ? "Wolke & Bombe in der Runde" : "nicht mit Sonderkarten spielbar")}</span></div><div class="tog" class:on={ui.nm.cb && classic}></div></button>
  <div class="cap">{t("Ansagen")}</div>
  <div class="chips">{#each [["", "Offen"], ["tip", "Verdeckter Tipp"], ["secret", "Geheime Vorhersage"]] as [k, l]}<button class="chip" class:on={ui.nm.hid === k} onclick={() => (ui.nm.hid = k as "" | "tip" | "secret")}>{t(l)}</button>{/each}</div>
</div>
<div class="foot"><button class="btn" disabled={n < 2} onclick={startGame}>{t("Spiel starten ({n} Spieler)", { n })}</button></div>
{#if ui.sheet === "mode"}
  <Sheet>
    <h2>{t("Spielmodus")}</h2>
    {#each Object.entries(MODES) as [k, m]}
      {@const dis = !!(m.ok && n && !m.ok(n))}
      <button class="li" style={dis ? "opacity:.4" : ""} onclick={() => (dis ? toast(t("Nur mit 3–4 Personen")) : ((ui.nm.mode = k as Mode), (ui.sheet = null)))}>
        <span class="rb" class:on={ui.nm.mode === k}></span><span class="sp">{t(m.n)}<span class="sub">{t(m.d)}</span></span>
      </button>
    {/each}
  </Sheet>
{/if}
