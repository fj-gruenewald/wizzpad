<script lang="ts">
  import { dlg } from "../lib/store.svelte";
  import { t } from "../lib/i18n";
  let v = $state("");
  let inp: HTMLInputElement | undefined = $state();
  $effect(() => { if (dlg.a) { v = dlg.a.input ?? ""; setTimeout(() => inp?.focus(), 50); } });
  function close(r: string | null) { const a = dlg.a; dlg.a = null; a?.done(r); }
</script>
{#if dlg.a}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div class="scrim" style="z-index:8" onclick={(e) => { if (e.target === e.currentTarget) close(null); }}>
    <div class="sheet">
      <h2>{dlg.a.title}</h2>
      {#if dlg.a.text}<div style="font-size:14px;line-height:1.5">{dlg.a.text}</div>{/if}
      {#if dlg.a.input != null}
        <input class="tf" bind:this={inp} bind:value={v} autocomplete="off" onkeydown={(e) => { if (e.key === "Enter") close(v); }} />
      {/if}
      <button class="btn" style="flex:none;{dlg.a.danger ? 'background:var(--err);color:#fff' : ''}" onclick={() => close(dlg.a?.input != null ? v : "")}>{dlg.a.ok}</button>
      <button class="btn out" style="flex:none" onclick={() => close(null)}>{t("Abbrechen")}</button>
    </div>
  </div>
{/if}
