import "./app.css";
import { mount } from "svelte";
import App from "./App.svelte";
import { app } from "./lib/store.svelte";

async function start() {
  // Daten im Browser dauerhaft halten (sonst darf der Browser bei Speichermangel löschen)
  navigator.storage?.persist?.().catch(() => {});
  // Nur in der Entwicklung: die Wizard-Block-Testdaten aus data/ automatisch laden, damit Statistiken gefüllt sind
  if (import.meta.env.DEV && !app.games.length && !app.delWb.length) {
    const [{ importWizardBlock }, g, p, r] = await Promise.all([
      import("./lib/wizardblock"), import("../data/wizardGame.json"), import("../data/wizardPlayer.json"), import("../data/wizardPlayerGame.json"),
    ]);
    importWizardBlock(app, g.default, p.default, r.default);
  }
  mount(App, { target: document.getElementById("app")! });
}
start();
