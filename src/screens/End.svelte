<script lang="ts">
  import { t, tn } from "../lib/i18n";
  import Avatar from "../ui/Avatar.svelte";
  import { app, dur, go, player, ui } from "../lib/store.svelte";
  import { doneRounds, finalBid, isEarlyEnd, totals } from "../lib/logic";
  import { rematch } from "../lib/actions";
  const g = $derived(app.games.find((x) => x.id === ui.gid)!);
  const sc = $derived(totals(g));
  const rk = $derived([...g.players].sort((a, b) => sc[b] - sc[a]));
  const d = $derived(doneRounds(g));
  const hits = $derived(Object.fromEntries(g.players.map((p) => [p, g.rounds.filter((rd) => rd.done && finalBid(rd, p) === rd.tricks[p]).length])));
  // Wahrsager-Award: bei Gleichstand bekommen ihn alle mit der besten Trefferzahl
  const top = $derived(Math.max(0, ...g.players.map((p) => hits[p])));
  const seers = $derived(g.players.filter((p) => hits[p] === top));
  const pod = $derived([rk[1], rk[0], rk[2]].filter(Boolean));
</script>
<div class="bar"><h1>{t("Spiel beendet")}</h1></div>
<div class="main">
  <div class="pod">
    {#each pod as p (p)}
      {@const pl = rk.indexOf(p) + 1}
      <div>{pl === 1 ? "👑" : ""}<div style="display:flex;justify-content:center"><Avatar id={p} /></div><div class="sub">{player(p).name}</div>
        <div class="blk" style="height:{pl === 1 ? 90 : pl === 2 ? 66 : 46}px{pl === 1 ? ';background:var(--pc)' : ''}"><b>{pl}.</b><br>{sc[p]}</div></div>
    {/each}
  </div>
  <div class="card" style="font-size:14px;line-height:1.8">
    🏁 {tn(d, "{n} Runde", "{n} Runden")}{isEarlyEnd(g) ? " " + t("(von {n})", { n: g.max }) : ""}<br>
    ⏱ {dur((g.end ?? g.start) - g.start)} · {t("Ø {x} pro Runde", { x: dur(((g.end ?? g.start) - g.start) / Math.max(1, d)) })}<br>
    {#if top}🔮 {t("Wahrsager-Award")}: {seers.map((p) => player(p).name).join(" & ")} ({t("{a} von {n} Ansagen getroffen", { a: top, n: d })})<br>{/if}
    💣 {t("{n} Bomben", { n: g.rounds.reduce((a, r) => a + r.bomb, 0) })} · ☁️ {t("{n} Wolken", { n: g.rounds.reduce((a, r) => a + Object.keys(r.cloud).length, 0) })}
  </div>
  {#each rk.slice(3) as p, i (p)}<div class="li"><b>{i + 4}.</b><Avatar id={p} /><span class="sp">{player(p).name}</span><b>{sc[p]}</b></div>{/each}
</div>
<div class="foot"><button class="btn ton" onclick={() => rematch(g.id)}>{t("Revanche")}</button><button class="btn" onclick={() => go("home")}>{t("Fertig")}</button></div>
