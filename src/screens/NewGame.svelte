<script lang="ts">
  import { t } from "../lib/i18n";
  import Avatar from "../ui/Avatar.svelte";
  import Bar from "../ui/Bar.svelte";
  import Sheet from "../ui/Sheet.svelte";
  import { app, go, player, toast, ui } from "../lib/store.svelte";
  import { MODES } from "../lib/logic";
  import { addPlayer, startGame } from "../lib/actions";
  import type { Mode } from "../lib/types";
  const rest = $derived(app.players.filter((p) => !p.deleted && !ui.sel.includes(p.id)));
  const n = $derived(ui.sel.length);
  const classic = $derived(ui.nm.mode === "classic");
  $effect(() => { const m = MODES[ui.nm.mode]; if (m.ok && n && !m.ok(n)) ui.nm.mode = "classic"; });
  function toggle(id: string) { const i = ui.sel.indexOf(id); if (i >= 0) ui.sel.splice(i, 1); else if (ui.sel.length < 6) ui.sel.push(id); else toast(t("Maximal 6 Spieler")); }
  // Ziehen am Griff: gezogene Zeile folgt dem Finger, die anderen gleiten zur Seite. Neue Reihenfolge erst beim Loslassen.
  let list: HTMLDivElement;
  let drag = $state<{ id: string; from: number; to: number; y0: number; dy: number; h: number } | null>(null);
  const zoom = () => parseFloat(getComputedStyle(document.getElementById("ph")!).zoom || "1") || 1;
  function down(e: PointerEvent, id: string) {
    e.preventDefault(); (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const rows = list.querySelectorAll<HTMLElement>(".li"), from = ui.sel.indexOf(id);
    const h = rows.length > 1 ? rows[1].offsetTop - rows[0].offsetTop : rows[0].offsetHeight;
    drag = { id, from, to: from, y0: e.clientY, dy: 0, h };
  }
  function moveP(e: PointerEvent) {
    if (!drag) return;
    const dy = (e.clientY - drag.y0) / zoom(), max = ui.sel.length - 1;
    drag.dy = Math.max(-drag.from * drag.h, Math.min((max - drag.from) * drag.h, dy));
    drag.to = Math.max(0, Math.min(max, drag.from + Math.round(drag.dy / drag.h)));
  }
  function up() {
    if (drag && drag.to !== drag.from) { const [x] = ui.sel.splice(drag.from, 1); ui.sel.splice(drag.to, 0, x); }
    drag = null;
  }
  function shift(i: number) {
    if (!drag) return "";
    if (i === drag.from) return `transform:translateY(${drag.dy}px)`;
    if (drag.from < drag.to && i > drag.from && i <= drag.to) return `transform:translateY(${-drag.h}px);transition:transform .15s`;
    if (drag.to < drag.from && i >= drag.to && i < drag.from) return `transform:translateY(${drag.h}px);transition:transform .15s`;
    return "transition:transform .15s";
  }
</script>
<Bar title={t("Neues Spiel")} back={() => go("home")} />
<div class="main">
  <div class="cap">{t("Spieler in Sitzreihenfolge antippen")}</div>
  <div bind:this={list} style="display:flex;flex-direction:column;gap:9px">
  {#each ui.sel as id, i (id)}
    <div class="li" class:drag={drag?.id === id} style={shift(i)}>
      <span class="grip" role="button" tabindex="-1" aria-label={t("Ziehen zum Verschieben")} onpointerdown={(e) => down(e, id)} onpointermove={moveP} onpointerup={up} onpointercancel={up}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 12h16M4 16h16"/></svg></span>
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
