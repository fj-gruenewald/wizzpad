<script lang="ts">
  import { t } from "../lib/i18n";
  import Bar from "../ui/Bar.svelte";
  import { allCards, app, confirmAsk, go, toast, ui } from "../lib/store.svelte";
  import { CARDS } from "../lib/content";
  import type { Effect } from "../lib/types";
  // Bearbeitet wird immer der deutsche Originaltext bzw. die eigene Anpassung
  const base = CARDS.find((x) => x.n === ui.n && !app.cardOv[x.n]) ?? allCards().find((x) => x.n === ui.n);
  const official = !!base && !base.own;
  const c = $state({ e: base?.e ?? "✨", n: base?.n ?? "", w: base?.w ?? "", s: base?.s ?? "", d: (base?.det ?? []).join("\n"), k: (base?.combo ?? []).join("\n"), eff: (base?.eff ?? "") as Effect });
  const E = ["✨", "🍄", "😴", "🦎", "🦄", "👻", "🐸", "🔥", "❄️", "⚡", "🌙", "🎩", "🗡️", "🛡️", "🦉", "🐲", "🍀", "💎", "🌀", "🎲"];
  const lines = (t: string) => t.split("\n").map((x) => x.trim()).filter(Boolean);
  function save() {
    if (!c.n.trim() || !c.s.trim()) return toast(t("Name und Kurztext sind Pflicht"));
    const data = { e: c.e, w: c.w.trim(), s: c.s.trim(), det: lines(c.d), combo: lines(c.k) };
    if (official) { app.cardOv[base!.n] = data; return go("card", { n: base!.n }); }
    const n = c.n.trim();
    if (n !== ui.n && allCards().some((x) => x.n.toLowerCase() === n.toLowerCase())) return toast(t("Name gibt es schon"));
    app.cards = app.cards.filter((x) => x.n !== ui.n);
    app.cards.push({ ...data, n, eff: c.eff, g: "Eigene" });
    go("card", { n });
  }
</script>
<Bar title={t(ui.n ? "Karte bearbeiten" : "Neue Karte")} back={() => (ui.n ? go("card", { n: ui.n }) : go("know"))}>{#snippet right()}<button class="chip on" style="margin-right:6px" onclick={save}>{t("Speichern")}</button>{/snippet}</Bar>
<div class="main">
  <div class="row" style="gap:12px"><div class="card" style="font-size:40px;padding:8px 16px">{c.e}</div>
    <div class="sp"><div class="mut">{t("Emoji antippen zum Ändern")}</div><div class="chips" style="margin-top:6px;gap:4px">{#each E as e}<button style="font-size:20px;border:none;padding:2px;border-radius:6px;background:{c.e === e ? 'var(--pc)' : 'transparent'}" onclick={() => (c.e = e)}>{e}</button>{/each}</div></div></div>
  <label class="fl" for="cn">{t("Name")}</label><input id="cn" class="tf" disabled={official} bind:value={c.n} />
  <div class="row" style="gap:8px"><div class="sp"><label class="fl" for="cw">{t("Wert")}</label><input id="cw" class="tf" placeholder={t("z. B. 3½")} bind:value={c.w} /></div>
    <div class="sp"><label class="fl" for="cg">{t("Gruppe")}</label><input id="cg" class="tf" disabled value={official ? base!.g : t("Eigene")} /></div></div>
  <label class="fl" for="cs">{t("Kurz gesagt (1 Satz)")}</label><input id="cs" class="tf" bind:value={c.s} />
  <label class="fl" for="cd">{t("Details (eine Zeile pro Punkt, optional)")}</label><textarea id="cd" class="tf" rows="3" bind:value={c.d}></textarea>
  <label class="fl" for="ck">{t("Kombinationen & Trumpf-Fall (optional)")}</label><textarea id="ck" class="tf" rows="2" bind:value={c.k}></textarea>
  {#if !official}
    <div class="fl">{t("Wirkung auf die Wertung")}</div>
    <div class="chips">{#each [["", "keine"], ["cloud", "Ansage ±1 (wie Wolke)"], ["bomb", "Stich zählt nicht (wie Bombe)"]] as [v, l]}<button class="chip" class:on={c.eff === v} onclick={() => (c.eff = v as Effect)}>{t(l)}</button>{/each}</div>
    <div class="mut">{t("Mit Wirkung erscheint eine eigene Taste in der Runde.")}</div>
  {/if}
  {#if official && base?.mod}<button class="btn out" style="flex:none" onclick={() => { delete app.cardOv[base!.n]; go("card", { n: base!.n }); }}>{t("Original wiederherstellen")}</button>{/if}
  {#if base?.own}<button class="btn out" style="flex:none;color:var(--err)" onclick={async () => { if (await confirmAsk(t("Karte löschen"), t("Karte löschen?"), t("Löschen"), true)) { app.cards = app.cards.filter((x) => x.n !== base!.n); go("know"); } }}>{t("Karte löschen")}</button>{/if}
</div>
