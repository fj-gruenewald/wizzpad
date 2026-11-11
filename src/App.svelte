<script lang="ts">
  import { app, applyTheme, current, dlg, go, lang, ui } from "./lib/store.svelte";
  import Home from "./screens/Home.svelte";
  import NewGame from "./screens/NewGame.svelte";
  import Round from "./screens/Round.svelte";
  import Table from "./screens/Table.svelte";
  import End from "./screens/End.svelte";
  import History from "./screens/History.svelte";
  import Players from "./screens/Players.svelte";
  import Profile from "./screens/Profile.svelte";
  import Stats from "./screens/Stats.svelte";
  import Know from "./screens/Know.svelte";
  import Card from "./screens/Card.svelte";
  import CardEdit from "./screens/CardEdit.svelte";
  import Settings from "./screens/Settings.svelte";
  import Data from "./screens/Data.svelte";
  import Sheets from "./ui/Sheets.svelte";
  import Dialog from "./ui/Dialog.svelte";

  if (app.cur && current()) ui.v = "table";
  $effect(() => { void app.set.mode; void app.set.dyn; applyTheme(); });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);
  $effect(() => { document.documentElement.lang = lang(); });

  // Tablet/Querformat: Runde und Punkteübersicht nebeneinander
  let width = $state(innerWidth);
  addEventListener("resize", () => (width = innerWidth));
  // Anzeigegröße: ganze Oberfläche per CSS-zoom skalieren
  const Z = { s: 1, m: 1.15, l: 1.3 } as const;
  const split = $derived(width >= 900 * Z[app.set.size] && ui.v === "round" && !!current());

  // Bildschirm wach halten während eines Spiels (Screen Wake Lock API, nur über HTTPS/localhost)
  // Android-Zurück-Geste: Außerhalb der Startseite liegt ein „Wächter“-Eintrag im Verlauf.
  // Die Geste entfernt ihn (popstate) → wir führen das In-App-Zurück aus statt die App zu schließen.
  // Auf der Startseite ohne offenes Blatt gibt es keinen Wächter → Geste schließt die App wie gewohnt.
  const needGuard = () => ui.v !== "home" || !!ui.sheet || !!dlg.a;
  function guard() {
    if (needGuard() && !history.state?.wz) history.pushState({ wz: 1 }, "");
    else if (!needGuard() && history.state?.wz) history.back();
  }
  $effect(() => { void ui.v; void ui.sheet; void dlg.a; guard(); });
  addEventListener("popstate", () => {
    if (dlg.a) { const a = dlg.a; dlg.a = null; a.done(null); }
    else if (ui.sheet) ui.sheet = null;
    else if (ui.v !== "home") {
      const b = document.querySelector<HTMLButtonElement>(".bar .back");
      if (b) b.click(); else go("home");
    }
    setTimeout(guard);
  });

  // Kein Vollbild per Fullscreen-API (0.3.1–0.3.5 getestet): braucht eine Nutzergeste und zeigt immer
  // den Browser-Hinweis „Zum Beenden wischen“. Vollbild gibt es nur über display: fullscreen im Manifest
  // (Chrome-Installation als WebAPK; Brave ignoriert das).
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});

  // Android gibt den Lock beim Wegwechseln/Sperren frei → bei Rückkehr neu anfordern.
  let lock: WakeLockSentinel | null = null, want = false, pending = false;
  async function syncLock() {
    if (want && !lock && !pending && "wakeLock" in navigator && document.visibilityState === "visible") {
      pending = true;
      try { lock = await navigator.wakeLock.request("screen"); lock.addEventListener("release", () => { lock = null; }); }
      catch { /* z. B. Akkusparmodus oder Browser ohne Freigabe */ }
      pending = false;
      if (!want) syncLock();
    }
    if (!want && lock) { const l = lock; lock = null; l.release().catch(() => {}); }
  }
  $effect(() => { want = app.set.wake && !!app.cur && ["round", "table"].includes(ui.v); syncLock(); });
  document.addEventListener("visibilitychange", syncLock);
</script>

<div id="ph" class:split class:wide={width >= 700 * Z[app.set.size]} style="--z:{Z[app.set.size]}">
  {#if split}<div class="col"><Round /></div><div class="col side"><Table side /></div>
  {:else if ui.v === "newg"}<NewGame />
  {:else if ui.v === "round" && current()}<Round />
  {:else if ui.v === "table"}<Table />
  {:else if ui.v === "end"}<End />
  {:else if ui.v === "hist"}<History />
  {:else if ui.v === "players"}<Players />
  {:else if ui.v === "prof" && ui.pid}{#key ui.pid}<Profile />{/key}
  {:else if ui.v === "stats"}<Stats />
  {:else if ui.v === "know"}<Know />
  {:else if ui.v === "card"}<Card />
  {:else if ui.v === "cedit"}{#key ui.n}<CardEdit />{/key}
  {:else if ui.v === "settings"}<Settings />
  {:else if ui.v === "data"}<Data />
  {:else}<Home />{/if}
  <Sheets />
  <Dialog />
  {#if ui.toast}<div class="toast">{ui.toast}</div>{/if}
</div>
