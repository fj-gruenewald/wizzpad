<script lang="ts">
  import { t } from "../lib/i18n";
  import Nav from "../ui/Nav.svelte";
  import { allCards, go, lang, ui } from "../lib/store.svelte";
  import { APPHELP, APPHELP_EN, RULES, RULES_EN } from "../lib/content";
  const en = $derived(lang() === "en");
  const rules = $derived(RULES.map((r) => ({ ...r, ...(en ? RULES_EN[r.n] : {}), id: r.n })));
  const help = $derived(APPHELP.map((r) => (en ? APPHELP_EN[r.n] ?? r : r)));
  const grp = (c: { own?: boolean; g: string }) => (c.own ? t("Meine Karten") : c.g);
  const q = $derived(ui.q.toLowerCase());
  const hit = (x: unknown) => !q || JSON.stringify(x).toLowerCase().includes(q);
  const cards = $derived(allCards().filter((c) => (ui.tab === "own" ? c.own || c.g === "Eigene" : true) && hit(c)));
</script>
<div class="bar"><h1>{t("Wissen")}</h1><button class="ib" onclick={() => go("cedit", { n: undefined })} aria-label={t("Karte anlegen")}>＋</button></div>
<div class="main">
  <div class="search">🔍<input placeholder={t("Karte oder Regel suchen …")} bind:value={ui.q} /></div>
  <div class="chips">{#each [["cards", "Karten"], ["own", "Eigene"], ["rules", "Anleitung"], ["app", "App"]] as [k, l]}<button class="chip" class:on={ui.tab === k} onclick={() => (ui.tab = k)}>{t(l)}</button>{/each}</div>
  {#if ui.tab === "cards" || ui.tab === "own"}
    {#each cards as c, i (c.n)}
      {#if i === 0 || grp(c) !== grp(cards[i - 1])}<div class="cap">{grp(c)}</div>{/if}
      <button class="li" onclick={() => go("card", { n: c.n })}><span style="font-size:26px;width:32px;text-align:center">{c.e}</span>
        <div class="sp"><span class="nm"><b>{c.dn ?? c.n}</b>{#if c.app || c.eff} <span class="chip on" style="padding:1px 7px;font-size:10px">{t("in der App")}</span>{/if}{#if c.mod} <span class="chip" style="padding:1px 7px;font-size:10px">{t("angepasst")}</span>{/if}</span><span class="sub">{c.s}</span></div></button>
    {/each}
    {#if !cards.length}<div class="hint">{t("Nichts gefunden.")}</div>{/if}
    {#if ui.tab === "own"}<button class="btn ton" style="flex:none" onclick={() => go("cedit", { n: undefined })}>＋ {t("Eigene Karte anlegen")}</button>{/if}
  {:else if ui.tab === "app"}
    {#each help.filter(hit) as r}<div class="card"><b>{r.n}</b><div style="font-size:14px;margin-top:4px;line-height:1.45">{r.t}</div></div>{/each}
  {:else}
    {#each [["base", "Grundregeln"], ["var", "Varianten"]] as [k, title]}
      {@const L = rules.filter((r) => r.k === k && hit(r))}
      {#if L.length}<div class="cap">{t(title)}</div>{/if}
      {#each L as r (r.id)}
        <button class="li" style="flex-wrap:wrap" onclick={() => (ui.open = ui.open === r.id ? null : r.id)}>
          <span class="sp">{r.n}</span>{#if k === "var"}<span class="chip" class:on={!!r.sel} style="padding:2px 8px;font-size:11px">{t(r.sel ? "auswählbar" : "nur Regel")}</span>{/if}<span class="mut">{ui.open === r.id ? "⌄" : "›"}</span>
          {#if ui.open === r.id}<div style="width:100%;font-size:14px;line-height:1.5;margin-top:6px">{r.t}</div>{/if}
        </button>
      {/each}
    {/each}
  {/if}
</div>
<Nav active="know" />
