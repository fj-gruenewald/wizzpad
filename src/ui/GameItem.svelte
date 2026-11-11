<script lang="ts">
  import { t } from "../lib/i18n";
  import { dur, fmtDate, go, player } from "../lib/store.svelte";
  import { doneRounds, isEarlyEnd, totals, winners } from "../lib/logic";
  import type { Game } from "../lib/types";
  let { g }: { g: Game } = $props();
  const w = $derived(winners(g));
</script>
<button class="li" style="width:100%;border:none;font:inherit;color:inherit;text-align:left" onclick={() => go("table", { gid: g.id })}>
  <span style="font-size:20px">🏆</span>
  <div class="sp"><span class="nm"><b>{w.map((p) => player(p).name).join(" & ")}</b> {totals(g)[w[0]]}</span>
    <span class="sub">{fmtDate(g.start)} · {t("{n} Spieler", { n: g.players.length })} · ⏱ {dur((g.end ?? g.start) - g.start)}{isEarlyEnd(g) ? " · 🏁 R" + doneRounds(g) : ""}</span></div>
  <span class="mut">›</span>
</button>
