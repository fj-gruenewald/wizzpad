<script lang="ts">
  import { t } from "../lib/i18n";
  import Avatar from "../ui/Avatar.svelte";
  import Bar from "../ui/Bar.svelte";
  import { abbr, app, current, dur, fg, fmtDate, go, player, toast, ui } from "../lib/store.svelte";
  import { gameImage, saveFile } from "../lib/files";
  import { doneRounds, finalBid, isEarlyEnd, order, roundScore } from "../lib/logic";
  /** side: Punkteübersicht neben der Runde (Tablet), ohne Zurück und ohne Fußleiste */
  let { side = false }: { side?: boolean } = $props();
  const live = $derived(side || !ui.gid);
  const g0 = $derived(side ? current() : undefined);
  const g = $derived(g0 ?? (live ? current() : app.games.find((x) => x.id === ui.gid)));
  const rows = $derived.by(() => {
    if (!g) return [];
    const run: Record<string, number> = {};
    return g.rounds.map((rd, i) => ({ rd, i, cells: g.players.map((p) => { const s = roundScore(rd, p); run[p] = (run[p] ?? 0) + (rd.done ? s : 0); return { p, s, run: run[p] }; }) })).filter((x) => x.rd.done);
  });
  async function share() {
    if (!g) return;
    const blob = await gameImage(g, { name: (id) => player(id).name, color: (id) => player(id).color, abbr, fg, title: fmtDate(g.start) + " · " + t("{n} Runden", { n: doneRounds(g) }) + (g.end ? " · ⏱ " + dur(g.end - g.start) : ""), footer: t("Wizzpad · keine Werbung, alles offline") });
    const r = await saveFile(`wizzpad-${new Date(g.start).toISOString().slice(0, 10)}.png`, blob);
    if (r === "download") toast(t("Bild gespeichert"));
  }
</script>
{#if g}
  {@const d = doneRounds(g)}
  <Bar title={live ? (d ? t("Runde {r}", { r: d }) : t("Punkte")) : fmtDate(g.start)} back={side ? undefined : () => go(live ? "home" : "hist")}>
    {#snippet right()}{#if live && !side && app.set.timer}<span class="mut" style="padding-right:8px">⏱ {dur(ui.now - g.start)}</span>{/if}{#if !live && !side}<button class="ib" style="font-size:22px" onclick={share} aria-label={t("Als Bild teilen")}>⤴</button>{/if}{/snippet}
  </Bar>
  <div class="main">
    {#if live && !side}{@const o = order(g, g.rounds.length)}<div class="mut">{t("Nächste Runde: ▶ {a} beginnt · 🃏 {d}", { a: player(o[0]).name, d: player(o.at(-1)!).name })}</div>{/if}
    <div class="card" style="padding:6px;overflow-x:auto">
      <table>
        <thead><tr><th>R</th>{#each g.players as p}<th><div style="display:flex;justify-content:center"><Avatar id={p} /></div></th>{/each}</tr></thead>
        <tbody>
          {#each rows as row (row.i)}
            <tr style="cursor:pointer" onclick={() => { ui.er = row.i; ui.eg = g.id; ui.sheet = "edit"; }}>
              <td class="r">{row.i + 1}{row.rd.bomb ? "💣" : ""}{Object.keys(row.rd.cloud).length ? "☁️" : ""}</td>
              {#each row.cells as c}<td class={c.s > 0 ? "pos" : "neg"}>{c.run}<div style="font-size:10px;color:var(--tv)">{finalBid(row.rd, c.p)}/{row.rd.tricks[c.p] ?? 0}</div></td>{/each}
            </tr>
          {/each}
          <tr class="tot"><td>Σ</td>{#each g.players as p, j}<td>{rows.at(-1)?.cells[j].run ?? 0}</td>{/each}</tr>
        </tbody>
      </table>
    </div>
    {#if g.end}<div class="hint">⏱ {dur(g.end - g.start)} · {t("{n} Runden", { n: d })}{isEarlyEnd(g) ? " · 🏁 " + t("vorzeitig beendet") : ""}</div>{/if}
  </div>
  {#if live && !side}
    <div class="foot">
      <button class="btn out" style="flex:none;padding:12px 14px;color:var(--err)" onclick={() => (ui.sheet = "end")}>✕ {t("Game over")}</button>
      <button class="btn" onclick={() => go("round", { fi: 0 })}>{t("Runde {r}", { r: g.rounds.length })} ▶</button>
    </div>
  {:else if !live}
    <div class="foot"><button class="btn out" style="color:var(--err)" onclick={() => { ui.dg = g.id; ui.sheet = "delg"; }}>🗑 {t("Spiel löschen")}</button></div>
  {/if}
{/if}
