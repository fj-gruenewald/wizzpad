<script lang="ts">
  import Bar from "../ui/Bar.svelte";
  import { app, applyTheme, go, ui } from "../lib/store.svelte";
  import { t } from "../lib/i18n";
  import type { Settings } from "../lib/types";
  type BoolKey = "pm1" | "cb" | "bombBy" | "timer" | "wake";
  const TG: [BoolKey, string, string][] = [["pm1", "Plus/minus Eins", "Unerlaubte Ansage beim Dealer ausblenden"], ["cb", "Jubiläumsedition", "Tasten für Wolke & Bombe in der Runde"], ["bombBy", "Erfassen, wer die Bombe spielte", "Für die Statistik"]];
  const DYN: [string, string, string][] = [["", "Aus (Wizzpad-Orange)", "#8f4c00"], ["dyn-green", "Grün", "#386a20"], ["dyn-blue", "Blau", "#0061a4"], ["dyn-purple", "Lila", "#6750a4"], ["dyn-red", "Rot", "#9c4234"], ["dyn-teal", "Türkis", "#006a6a"], ["dyn-pink", "Pink", "#984061"]];
  function set<K extends keyof Settings>(k: K, v: Settings[K]) { app.set[k] = v; applyTheme(); }
</script>
{#snippet tog(k: BoolKey, l: string, s: string)}
  <button class="li" onclick={() => (app.set[k] = !app.set[k])}><div class="sp">{t(l)}<span class="sub">{t(s)}</span></div><div class="tog" class:on={app.set[k]}></div></button>
{/snippet}
<Bar title={t("Einstellungen")} back={() => go("home")} />
<div class="main">
  <div class="cap">{t("Standard für neue Spiele")}</div>
  {#each TG as [k, l, s]}{@render tog(k, l, s)}{/each}
  <div class="cap">{t("Eingabe in der Runde")}</div>
  <div class="chips">{#each [["focus", "Fokus"], ["list", "Liste"], ["tiles", "Kacheln"]] as [v, l]}<button class="chip" class:on={app.set.entry === v} onclick={() => set("entry", v as Settings["entry"])}>{t(l)}</button>{/each}</div>
  <div class="cap">{t("Darstellung")}</div>
  <div class="chips">{#each [["light", "☀ Hell"], ["dark", "☾ Dunkel"], ["system", "System"]] as [v, l]}<button class="chip" class:on={app.set.mode === v} onclick={() => set("mode", v as Settings["mode"])}>{t(l)}</button>{/each}</div>
  <div class="mut" style="margin-top:2px">{t("Anzeigegröße")}</div>
  <div class="chips">{#each [["s", "Klein"], ["m", "Normal"], ["l", "Groß"]] as [v, l]}<button class="chip" class:on={app.set.size === v} onclick={() => set("size", v as Settings["size"])}>{t(l)}</button>{/each}</div>
  <div class="mut" style="margin-top:2px">Dynamic Color</div>
  <div class="chips">{#each DYN as [v, l, c]}<button class="chip" class:on={app.set.dyn === v} onclick={() => set("dyn", v)}><span style="width:14px;height:14px;border-radius:7px;background:{c};display:inline-block"></span>{t(l)}</button>{/each}</div>
  {@render tog("timer", "Spieldauer anzeigen", "Uhr in Runde und Punkteübersicht")}
  {@render tog("wake", "Bildschirm wach halten", "wakeLock" in navigator ? "Während eines Spiels" : "Wird von diesem Browser nicht unterstützt")}
  <div class="cap">{t("Sprache")}</div>
  <div class="chips">{#each [["de", "🇩🇪 Deutsch"], ["en", "🇬🇧 English"], ["system", "📱 Wie System"]] as [v, l]}<button class="chip" class:on={app.set.lang === v} onclick={() => set("lang", v as Settings["lang"])}>{t(l)}</button>{/each}</div>
  <div class="cap">{t("Daten")}</div>
  <button class="li" onclick={() => go("data")}><span>⇅</span><span class="sp">{t("Import & Export")}</span><span>›</span></button>
  <button class="li" onclick={() => (ui.sheet = "reset")}><span>🗑</span><span class="sp" style="color:var(--err)">{t("Alle Daten zurücksetzen")}</span></button>
  <div class="mut" style="text-align:center;margin-top:8px">Wizzpad {__VERSION__} · {t("keine Werbung, alles offline")}</div>
</div>
