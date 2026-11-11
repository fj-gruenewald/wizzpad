<script lang="ts">
  import { t } from "../lib/i18n";
  import Bar from "../ui/Bar.svelte";
  import { allCards, go, ui } from "../lib/store.svelte";
  const c = $derived(allCards().find((x) => x.n === ui.n));
  const eff = $derived(!c ? "" : c.eff === "cloud" ? t("Taste „{c}“ in der Runde (Ansage ±1)", { c: `${c.e} ${c.n}` }) : c.eff === "bomb" ? t("Taste „{c}“ in der Runde (Stich zählt nicht)", { c: `${c.e} ${c.n}` }) : c.app ?? "");
</script>
{#if c}
  <Bar title="{c.e} {c.dn ?? c.n}" back={() => go("know")}>{#snippet right()}<span class="chip" style="margin-right:4px">{c.own ? t("Eigene") : c.g}</span><button class="ib" onclick={() => go("cedit", { n: c.n })} aria-label={t("Bearbeiten")}>✎</button>{/snippet}</Bar>
  <div class="main">
    <div class="card t"><div class="mut" style="color:inherit;opacity:.8">{t("KURZ GESAGT")}</div><div style="font-size:17px;margin-top:6px;line-height:1.4">{c.s}</div></div>
    {#if c.w || c.f}<div class="kp">
      {#if c.w}<div class="card"><div class="mut">{t("Wert")}</div><div style="font-size:{c.w.length > 6 ? 16 : 26}px;font-weight:600;margin-top:4px">{c.w}</div></div>{/if}
      {#if c.f}<div class="card"><div class="mut">{t("Farbe")}</div><div style="font-size:14px;margin-top:6px">{c.f}</div></div>{/if}</div>{/if}
    {#if c.det?.length}<div class="card" style="font-size:14px;line-height:1.7"><div class="mut">{t("DETAILS")}</div>{#each c.det as d}• {d}<br>{/each}</div>{/if}
    {#if c.combo?.length}<div class="card" style="font-size:14px;line-height:1.7"><div class="mut">{t("KOMBINATIONEN")}</div>{#each c.combo as d}{d}<br>{/each}</div>{/if}
    {#if eff}<div class="hint">📱 {t("In der App")}: {eff}</div>{/if}
  </div>
{/if}
