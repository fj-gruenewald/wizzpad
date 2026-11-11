<script lang="ts">
  import type { Snippet } from "svelte";
  import { ui } from "../lib/store.svelte";
  let { children }: { children: Snippet } = $props();
</script>
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="scrim" onclick={(e) => { if (e.target === e.currentTarget) ui.sheet = null; }}>
  <div class="sheet">{@render children()}</div>
</div>
