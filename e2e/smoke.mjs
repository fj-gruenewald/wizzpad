// Klick-Durchlauf durch die App (Entwicklungsserver muss laufen). Aufruf: node e2e/smoke.mjs [ausgabeordner]
import puppeteer from "puppeteer-core";
const out = process.argv[2] ?? "/tmp/wizzpad-e2e";
const URL = process.env.WIZZPAD_URL ?? "http://localhost:5173/";
const b = await puppeteer.launch({ executablePath: process.env.CHROME ?? "/usr/lib/chromium/chromium", args: ["--no-sandbox"], defaultViewport: { width: 390, height: 853 } });
const p = await b.newPage();
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
p.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
const shot = async (n) => p.screenshot({ path: `${out}/${n}.png` });
const click = async (text, sel = "button,.li,.chip,label") => {
  const ok = await p.evaluate((t, s) => { const el = [...document.querySelectorAll(s)].find((e) => e.textContent.replace(/\s+/g, " ").includes(t) && !e.disabled); if (el) { el.click(); return true; } return false; }, text, sel);
  if (!ok) throw new Error("Nicht gefunden/gesperrt: " + text);
  await new Promise((r) => setTimeout(r, 120));
};
await p.goto(URL); await p.evaluate(() => localStorage.clear()); await p.reload(); await new Promise((r) => setTimeout(r, 800));
await shot("01-home");
await click("Neues Spiel"); await shot("02-new");
await click("Spiel starten"); await shot("03-bid");
// Runde 1 (Fokus): alle sagen 0 außer erster → 1? Ansage-Buttons in .vpad
const vpad = async (k) => { await p.evaluate((k) => [...document.querySelectorAll(".vpad button")].find((b) => b.textContent.trim() === String(k)).click(), k); await new Promise((r) => setTimeout(r, 100)); };
const n = await p.evaluate(() => document.querySelectorAll(".dots .av").length);
for (let i = 0; i < n; i++) await vpad(0);
await shot("04-bid-filled");
await click("Ansagen fertig"); await shot("05-tricks");
// Stiche: erste Person bekommt den einen Stich → Fokus 0 auf 1 setzen
await p.evaluate(() => document.querySelector(".dots .av").click()); await vpad(1);
await click("Runde abschließen"); await shot("06-table");
await click("Runde 2"); 
for (let i = 0; i < n; i++) await vpad(0);
await click("Ansagen fertig");
await click("Bombe"); await shot("07-bomb"); await click("Bombe eintragen");
// Ben gewinnt den einzigen gültigen Stich mit der Wolke → Ansage 0→1, Stich wird automatisch 1
await click("Wolke"); await p.evaluate(() => document.querySelectorAll(".sheet .av")[1].click()); await shot("08-cloud"); await click("+1");
await shot("09-tricks2");
const can = await p.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Runde abschließen")).disabled);
if (can) throw new Error("Runde 2 nicht abschließbar");
await click("Runde abschließen");
await shot("10-table2");
await click("Game over"); await shot("11-gameover"); await click("Beenden & Ergebnis"); await shot("12-end");
await click("Fertig"); await click("Statistik", ".nav div"); await shot("13-stats");
await click("Spieler", ".nav div"); await click("Max"); await shot("14-profile");
await click("←"); await click("Wissen", ".nav div"); await click("Wolke"); await shot("15-card");
// Person anlegen über den app-eigenen Dialog (prompt() gibt es im Obsidian-Web-Viewer nicht)
await click("←"); await click("Spieler", ".nav div"); await p.click('[aria-label="Spieler anlegen"]'); await new Promise((r) => setTimeout(r, 150));
await p.type(".sheet input", "Testperson"); await shot("16-dialog"); await click("Anlegen");
if (!(await p.evaluate(() => document.body.innerText.includes("Testperson")))) throw new Error("Neue Person fehlt");
// Spiel aus dem Verlauf als Bild teilen/speichern
await click("Verlauf", ".nav div"); await p.evaluate(() => document.querySelector(".main .li").click()); await new Promise((r) => setTimeout(r, 150));
await p.click('[aria-label="Als Bild teilen"]'); await new Promise((r) => setTimeout(r, 600)); await shot("17-hist-game");
// Englisch
await p.click('.bar [aria-label="Zurück"]'); await click("Start", ".nav div"); await p.click('[aria-label="Einstellungen"]'); await click("English"); await shot("18-settings-en");
await p.click('[aria-label="Back"]'); await shot("19-home-en");
if (!(await p.evaluate(() => document.body.innerText.includes("New game")))) throw new Error("Englisch greift nicht");
await click("Stats", ".nav div"); await shot("20-stats-en"); await click("Knowledge", ".nav div"); await click("Cloud"); await shot("21-card-en");
await p.click('[aria-label="Back"]'); await click("Home", ".nav div"); await p.click('[aria-label="Settings"]'); await click("Deutsch"); await p.click('[aria-label="Zurück"]');
// Tablet: Runde und Punkteübersicht nebeneinander
await p.setViewport({ width: 1280, height: 800 });
await click("Neues Spiel"); await click("Spiel starten");
for (let i = 0; i < n; i++) await vpad(0);
await click("Ansagen fertig"); await shot("22-tablet-round");
if (!(await p.evaluate(() => !!document.querySelector("#ph.split .col.side table")))) throw new Error("Tablet-Ansicht fehlt");
console.log("Fehler:", errors.length ? errors : "keine");
await b.close();
