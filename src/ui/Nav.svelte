<script lang="ts">
  import { t } from "../lib/i18n";
  import { go } from "../lib/store.svelte";
  let { active }: { active: string } = $props();
  const IT: [string, string, string][] = [
    ["home", "Start", '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z"/>'],
    ["players", "Spieler", '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17" cy="9" r="2.6"/><path d="M16.5 14.2c2.9.2 5 2.3 5 5.8"/>'],
    ["stats", "Statistik", '<path d="M4 20h16"/><rect x="5.5" y="11" width="3" height="7" rx="1"/><rect x="10.5" y="6" width="3" height="12" rx="1"/><rect x="15.5" y="13.5" width="3" height="4.5" rx="1"/>'],
    ["hist", "Verlauf", '<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6"/><path d="M3 4v4.5h4.5"/><path d="M12 7.5V12l3 2"/>'],
    ["know", "Wissen", '<path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5c.8 0 1.5-.7 1.5-1.5z"/>'],
  ];
</script>
<nav class="nav">
  {#each IT as [k, l, ic]}
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
    <div class:on={active === k} onclick={() => go(k)}><i><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{@html ic}</svg></i>{t(l)}</div>
  {/each}
</nav>
