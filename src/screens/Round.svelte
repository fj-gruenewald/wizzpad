<script lang="ts">
  import { t as tr } from "../lib/i18n";
  import Avatar from "../ui/Avatar.svelte";
  import { app, current, dur, go, player, ui } from "../lib/store.svelte";
  import { MAXIMUS_TRUMP, bidsComplete, cardsOf, expectedTricks, finalBid, forbiddenBid, order, specialsOn, totals, tricksComplete } from "../lib/logic";
  import { backToBids, finishRound, inc, setValue, toTricks } from "../lib/actions";

  const g = $derived(current()!);
  const r = $derived(g.rounds.length);
  const rd = $derived(g.rounds[r - 1]);
  const o = $derived(order(g, r));
  const n = $derived(o.length);
  const ph = $derived(rd.phase);
  const key = $derived(ph === "bid" ? "bids" : "tricks") as "bids" | "tricks";
  const C = $derived(cardsOf(g, r));
  const exp = $derived(expectedTricks(g, r, rd));
  const lim = $derived(ph === "bid" ? C : exp);
  const sc = $derived(totals(g));
  const sumB = $derived(o.reduce((a, p) => a + (rd.bids[p] ?? 0), 0));
  const sumT = $derived(o.reduce((a, p) => a + (rd.tricks[p] ?? 0), 0));
  const allBids = $derived(o.every((p) => rd.bids[p] != null));
  const ownEff = $derived(app.cards.filter((c) => c.eff));
  const fi = $derived(Math.min(ui.fi, n - 1));
  const cur = $derived(o[fi]);

  const role = (i: number) => (i === 0 ? "st" : i === n - 1 ? "dl" : "") as "" | "st" | "dl";
  const fb = (p: string) => forbiddenBid(g, rd, p);

  // Verdeckter Tipp: verborgen, bis alle abgegeben haben. Geheime Vorhersage: verborgen bis Rundenende.
  const hidden = $derived(ph === "bid" && !!g.hid && !(g.hid === "tip" && allBids));
  const shown = (p: string) => { const v = rd[key][p]; return hidden ? (v != null ? "✓" : "·") : (v ?? "·"); };
  const bad = (p: string) => ph === "bid" && fb(p) != null && rd.bids[p] === fb(p);
  function sub(p: string, i: number) {
    const s: string[] = [];
    if (i === 0) s.push(`<span class="rs">${tr("beginnt")}</span>`);
    if (i === n - 1) s.push(`<span class="rd">${tr("Dealer")}</span>`);
    if (ph === "bid") s.push(tr("{p} Pkt", { p: sc[p] }));
    else if (g.hid === "secret") s.push(tr("Ansage verdeckt"));
    else { const c = rd.cloud[p]; s.push(tr("Ansage") + " " + (c ? `<s>${rd.bids[p]}</s> → ${finalBid(rd, p)} ☁️` : (rd.bids[p] ?? 0))); }
    return s.join(" · ");
  }
</script>

{#snippet specials()}
  {#if ph === "tricks" && (specialsOn(g) || ownEff.length)}
    <div class="row" style="gap:8px">
      {#if specialsOn(g)}
        <button class="btn ton" onclick={() => { ui.cp = null; ui.sheet = "cloud"; }}>☁️ {tr("Wolke")}{Object.keys(rd.cloud).length ? ` (${Object.keys(rd.cloud).length})` : ""}</button>
        <button class="btn ton" onclick={() => { ui.bp = rd.bombBy ?? null; ui.sheet = "bomb"; }}>💣 {tr("Bombe")}{rd.bomb ? ` (${rd.bomb})` : ""}</button>
      {/if}
      {#each ownEff as c}<button class="btn ton" onclick={() => { ui.cp = null; ui.bp = null; ui.sheet = c.eff!; }}>{c.e} {c.dn ?? c.n}</button>{/each}
    </div>
  {/if}
{/snippet}

<!-- Zurück → Punkteübersicht (Eingaben bleiben erhalten, „Runde n ▶“ führt zurück); von dort Zurück → Start -->
<div class="bar"><button class="ib back" onclick={() => go("table")} aria-label={tr("Zurück")}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"/></svg></button><h1>{tr("Runde {r}", { r })} · {tr(ph === "bid" ? "Ansagen" : "Stiche")}</h1>{#if g.mode === "maximus"}<span class="chip">{tr(MAXIMUS_TRUMP[r - 1] ?? "")}</span>{/if}</div>
<div class="main">
  <div class="row mut" style="justify-content:space-between"><span>{tr("▶ {a} beginnt · 🃏 {d}", { a: player(o[0]).name, d: player(o[n - 1]).name })}</span>{#if app.set.timer}<span>⏱ {dur(ui.now - g.start)}</span>{/if}</div>
  {#if app.set.entry !== "focus"}{@render specials()}{/if}

  {#if app.set.entry === "list"}
    {#each o as p, i (p)}
      <div class="card row">
        <Avatar id={p} role={role(i)} />
        <div class="sp"><span class="nm">{player(p).name}</span><span class="sub">{@html sub(p, i)}</span></div>
        {#if fb(p) != null}<span class="nochip">{fb(p)}</span>{/if}
        <div class="step"><button class="sb" onclick={() => inc(p, -1)}>−</button><span class:badv={bad(p)}>{shown(p)}</span><button class="sb" onclick={() => inc(p, 1)}>＋</button></div>
      </div>
    {/each}
  {:else if app.set.entry === "tiles"}
    <div class="tiles">
      {#each o as p, i (p)}
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
        <div class="tile" onclick={() => inc(p, 1)}>
          <div class="row" style="gap:8px"><Avatar id={p} role={role(i)} /><div class="sp"><span class="nm" style="font-size:14px">{player(p).name}</span><span class="sub">{@html sub(p, i).replace(/ (Pkt|pts)/, "")}</span></div></div>
          <div class="huge" class:badv={bad(p)}>{shown(p)}</div>
          {#if fb(p) != null}<span class="nochip" style="position:absolute;left:10px;bottom:12px">{fb(p)}</span>{/if}
          <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
          <div class="mn" onclick={(e) => { e.stopPropagation(); inc(p, -1); }}>−</div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="dots">{#each o as q, i (q)}<Avatar id={q} cls={i === fi ? "c" : rd[key][q] != null ? "d" : ""} onclick={() => (ui.fi = i)} />{/each}</div>
    <div class="dots mut">{#each o as q (q)}<span style="width:36px;text-align:center">{shown(q)}</span>{/each}</div>
    <div style="text-align:center;margin:4px 0">
      <div style="display:inline-block"><Avatar id={cur} role={role(fi)} big /></div>
      <div class="big" style="margin-top:4px">{player(cur).name}</div><div class="mut">{@html sub(cur, fi)}</div>
    </div>
    {@render specials()}
    <div class="vpad">
      {#each Array.from({ length: lim + 1 }, (_, k) => k) as k}
        {#if k === fb(cur)}<button class="no" class:bad={rd[key][cur] === k} disabled>{k}</button>
        {:else}<button class:sel={rd[key][cur] === k && !hidden} onclick={() => setValue(cur, k)}>{k}</button>{/if}
      {/each}
    </div>
  {/if}

  {#if ph === "bid"}
    {#if app.set.entry !== "focus" || g.hid}
      {#if g.pm1 && !g.hid && allBids && sumB === C}<div class="hint w">{tr("⚠️ Ansagen gehen auf")}</div>
      {:else}<div class="hint">{hidden ? tr("Ansagen verdeckt · {a} von {n} abgegeben", { a: o.filter((p) => rd.bids[p] != null).length, n }) : tr("Summe der Ansagen: {a} von {n}", { a: sumB, n: C })}</div>{/if}
    {/if}
  {:else}
    <div class="hint {sumT === exp ? 'ok' : 'w'}">{rd.bomb ? tr("💣 {n} Bombe", { n: rd.bomb }) + " · " : ""}{tr("Stiche verteilt: {a} von {n}", { a: sumT, n: exp })}{sumT === exp ? " ✓" : ""}</div>
  {/if}
</div>
<div class="foot">
  {#if ph === "bid"}
    <button class="btn" disabled={!bidsComplete(g, rd)} onclick={toTricks}>{tr("Ansagen fertig → Stiche")}</button>
  {:else}
    <button class="btn out" style="flex:none" onclick={backToBids}>← {tr("Ansagen")}</button>
    <button class="btn" disabled={!tricksComplete(g, rd)} onclick={finishRound}>{tr("Runde abschließen")}</button>
  {/if}
</div>
