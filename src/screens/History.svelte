<script lang="ts">
  import { t } from "../lib/i18n";
  import GameItem from "../ui/GameItem.svelte";
  import Nav from "../ui/Nav.svelte";
  import { app } from "../lib/store.svelte";
  const gs = $derived([...app.games].filter((g) => g.end).sort((a, b) => b.start - a.start));
</script>
<div class="bar"><h1>{t("Verlauf")}</h1></div>
<div class="main">
  {#if !gs.length}<div class="hint">{t("Noch keine beendeten Spiele.")}</div>{/if}
  {#each gs as g, i (g.id)}
    {#if i === 0 || new Date(g.start).getFullYear() !== new Date(gs[i - 1].start).getFullYear()}<div class="cap">{new Date(g.start).getFullYear()}</div>{/if}
    <GameItem {g} />
  {/each}
</div>
<Nav active="hist" />
