<script lang="ts">
  import Bar from "../ui/Bar.svelte";
  import { app, confirmAsk, go, toast } from "../lib/store.svelte";
  import { t } from "../lib/i18n";
  import { importWizardBlock, readWizardBlockFiles } from "../lib/wizardblock";
  import { importCsv, toCsv } from "../lib/csv";
  import { saveFile } from "../lib/files";
  const today = () => new Date().toISOString().slice(0, 10);
  // Erst kopieren, dann leeren: value = "" leert in Chrome auch die (live) FileList
  const files = (e: Event) => { const el = e.target as HTMLInputElement, f = Array.from(el.files ?? []); el.value = ""; return f; };
  const err = (e: unknown) => toast(t("Import fehlgeschlagen: {e}", { e: t((e as Error).message ?? String(e)) }));
  const summary = (r: { games: number; duplicates: number; mismatches: number }) =>
    t("{n} Spiele importiert", { n: r.games }) + (r.duplicates ? ", " + t("{n} übersprungen", { n: r.duplicates }) : "") + (r.mismatches ? " · " + t("{n} Punkte-Abweichungen", { n: r.mismatches }) : "");

  async function wb(e: Event) {
    const f = files(e); if (!f?.length) return;
    try { const x = await readWizardBlockFiles(f); toast(summary(importWizardBlock(app, x.games, x.players, x.rows))); go("hist"); } catch (x) { err(x); }
  }
  async function csvIn(e: Event) {
    const f = files(e)?.[0]; if (!f) return;
    try { toast(summary(importCsv(app, await f.text()))); go("hist"); } catch (x) { err(x); }
  }
  async function restore(e: Event) {
    const f = files(e)?.[0]; if (!f) return;
    let x;
    try { x = JSON.parse(await f.text()); if (x?.v !== 1 || !x.games || !x.players) throw 0; }
    catch { return toast(t("Keine gültige Wizzpad-Backup-Datei")); }
    if (!(await confirmAsk(t("Backup wiederherstellen"), t("Das Backup ersetzt alle aktuellen Daten. Fortfahren?"), t("Wiederherstellen"), true))) return;
    Object.assign(app, { cards: [], cardOv: {}, delWb: [], cur: null, ...x, set: { ...app.set, ...x.set } });
    toast(t("Backup wiederhergestellt")); go("home");
  }
  async function out(name: string, data: string, type: string, share: boolean) {
    const r = await saveFile(name, new Blob([data], { type }), share);
    if (r === "download") toast(t("Gespeichert: {n}", { n: name }));
  }
  const backup = (share: boolean) => out(`wizzpad-backup-${today()}.json`, JSON.stringify(app), "application/json", share);
  const csv = (share: boolean) => out(`wizzpad-${today()}.csv`, "﻿" + toCsv(app), "text/csv", share);
  const canShare = typeof navigator.canShare === "function";
</script>
<Bar title={t("Import & Export")} back={() => go("settings")} />
<div class="main">
  <div class="cap">{t("Import")}</div>
  <label class="li"><span style="font-size:22px">📂</span><div class="sp"><span class="nm">{t("Wizard-Block-Dateien wählen")}</span><span class="sub">{t("wizardGame.json, wizardPlayer.json, wizardPlayerGame.json (alle drei markieren)")}</span></div><input type="file" multiple accept=".json,application/json,text/plain,application/octet-stream" style="display:none" onchange={wb} /></label>
  <label class="li"><span style="font-size:22px">📊</span><div class="sp"><span class="nm">{t("Tabelle (CSV) importieren")}</span><span class="sub">{t("Aus Wizzpad exportierte CSV, vorhandene Spiele werden übersprungen")}</span></div><input type="file" accept=".csv,text/csv,text/comma-separated-values,text/plain,application/vnd.ms-excel,application/octet-stream" style="display:none" onchange={csvIn} /></label>
  <label class="li"><span style="font-size:22px">♻️</span><div class="sp"><span class="nm">{t("Backup wiederherstellen")}</span><span class="sub">{t("Wizzpad-Backup (JSON), ersetzt alle Daten")}</span></div><input type="file" accept=".json,application/json,text/plain,application/octet-stream" style="display:none" onchange={restore} /></label>
  <div class="cap">{t("Export")}</div>
  <!-- accept nötig: ohne Filter bietet Android Kamera/Mikrofon an und fragt nach Berechtigungen. Breite MIME-Liste, damit .json nicht ausgegraut wird. -->
  <!-- Zeile antippen = speichern (wie im Klick-Dummy). „Teilen“ nur, wo das Gerät es kann (Android). -->
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div class="li" onclick={() => backup(false)}><span style="font-size:22px">💾</span><div class="sp"><span class="nm">{t("Komplett-Backup (JSON)")}</span><span class="sub">{t("Alle Spiele, Spieler, Karten, Einstellungen")}</span></div>
    {#if canShare}<button class="chip" onclick={(e) => { e.stopPropagation(); backup(true); }}>{t("Teilen")}</button>{/if}</div>
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div class="li" onclick={() => csv(false)}><span style="font-size:22px">📊</span><div class="sp"><span class="nm">{t("Tabelle (CSV)")}</span><span class="sub">{t("Eine Zeile pro Spieler und Runde, für Excel")}</span></div>
    {#if canShare}<button class="chip" onclick={(e) => { e.stopPropagation(); csv(true); }}>{t("Teilen")}</button>{/if}</div>
</div>
