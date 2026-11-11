<script lang="ts">
  import { t } from "../lib/i18n";
  import type { Snippet } from "svelte";
  let { title, back, right }: { title: string; back?: () => void; right?: Snippet } = $props();
</script>
<div class="bar">
  {#if back}<button class="ib back" onclick={back} aria-label={t("Zurück")}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"/></svg></button>{/if}
  <h1>{title}</h1>
  {@render right?.()}
</div>
