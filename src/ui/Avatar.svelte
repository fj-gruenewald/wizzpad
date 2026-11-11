<script lang="ts">
  import { abbr, fg, player } from "../lib/store.svelte";
  let { id, role = "", big = false, crown = false, sel = false, dim = false, cls = "", onclick }: { id: string; role?: "" | "st" | "dl"; big?: boolean; crown?: boolean; sel?: boolean; dim?: boolean; cls?: string; onclick?: () => void } = $props();
  const p = $derived(player(id));
</script>
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="av {cls}" class:crown data-big={big || undefined} style="background:{p.color};color:{fg(p.color)};text-shadow:none;{sel ? 'outline:3px solid var(--p);outline-offset:2px;' : ''}{dim ? 'opacity:.55;' : ''}{onclick ? 'cursor:pointer;' : ''}" {onclick}>
  {abbr(id)}{#if role === "st"}<span class="bd st">▶</span>{:else if role === "dl"}<span class="bd dl">🃏</span>{/if}
</div>
