// Englische Texte. Schlüssel = deutscher Originaltext (siehe i18n.ts).
export const EN: Record<string, string> = {
  // Navigation & allgemein
  "Start": "Home", "Spieler": "Players", "Statistik": "Stats", "Verlauf": "History", "Wissen": "Knowledge",
  "Abbrechen": "Cancel", "Speichern": "Save", "Löschen": "Delete", "Fertig": "Done", "Zurück": "Back", "Teilen": "Share",
  "Bearbeiten": "Edit", "Anlegen": "Create", "Umbenennen": "Rename", "Einstellungen": "Settings", "Anzeigegröße": "Display size", "Alle Spieler": "All players", "Spieleranzahl": "Number of players", "Jahr": "Year", "2er": "2p", "3er": "3p", "4er": "4p", "Wird von diesem Browser nicht unterstützt": "Not supported by this browser", "Klein": "Small", "Normal": "Normal", "Groß": "Large", "ja": "yes",
  "Wizzpad · keine Werbung, alles offline": "Wizzpad · no ads, fully offline", "keine Werbung, alles offline": "no ads, fully offline",

  // Start
  "LAUFENDES SPIEL": "CURRENT GAME", "Runde {r}": "Round {r}", "{a} beginnt · 🃏 {d} · führt: {l} {p}": "{a} starts · 🃏 {d} · leading: {l} {p}",
  "Noch keine beendeten Spiele.": "No finished games yet.",
  "Weiterspielen": "Continue", "Neues Spiel": "New game", "Letzte Spiele": "Recent games", "Import & Export": "Import & export",
  "Noch keine Spiele. Lege ein neues Spiel an oder importiere deine Wizard-Block-Daten.": "No games yet. Start a new game or import your Wizard Block data.",

  // Neues Spiel
  "Spieler in Sitzreihenfolge antippen": "Tap players in seating order", "beginnt": "starts", "in Runde 1": "in round 1", "Dealer": "Dealer",
  "Platz {n}": "Seat {n}", "hoch": "up", "runter": "down", "entfernen": "remove", "Neue Person": "New person", "Maximal 6 Spieler": "At most 6 players",
  "Spielmodus": "Game mode", "Nur mit 3–4 Personen": "Only with 3–4 players", "Regeln": "Rules", "Plus/minus Eins": "Plus/minus one",
  "nicht mit verdeckten Ansagen": "not with hidden bids", "Nur im klassischen Modus": "Only in classic mode", "Jubiläumsedition": "Anniversary edition",
  "Wolke & Bombe in der Runde": "Cloud & Bomb in the round", "nicht mit Sonderkarten spielbar": "not playable with special cards", "Ansagen": "Bids",
  "Offen": "Open", "Verdeckter Tipp": "Hidden bid", "Geheime Vorhersage": "Secret prediction", "Spiel starten ({n} Spieler)": "Start game ({n} players)",
  "Klassisch": "Classic", "1 Karte mehr pro Runde": "1 more card each round", "Einfarbig": "Single colour",
  "3–4 Personen · jede Person eine Farbe · 12 Runden · kein Trumpf": "3–4 players · one colour each · 12 rounds · no trump",
  "Wizard Maximus": "Wizard Maximus", "5 Runden mit allen Karten · Trumpf fest": "5 rounds with all cards · fixed trump",
  "🔵 Blau": "🔵 Blue", "🔴 Rot": "🔴 Red", "🟢 Grün": "🟢 Green", "🟡 Gelb": "🟡 Yellow", "⚪ kein Trumpf": "⚪ no trump",

  // Runde
  "Stiche": "Tricks", "{p} Pkt": "{p} pts", "Ansage verdeckt": "Bid hidden", "Ansage": "Bid", "Wolke": "Cloud", "Bombe": "Bomb",
  "▶ {a} beginnt · 🃏 {d}": "▶ {a} starts · 🃏 {d}", "⚠️ Ansagen gehen auf": "⚠️ Bids add up",
  "Ansagen verdeckt · {a} von {n} abgegeben": "Bids hidden · {a} of {n} given", "Summe der Ansagen: {a} von {n}": "Sum of bids: {a} of {n}",
  "💣 {n} Bombe": "💣 {n} Bomb", "Stiche verteilt: {a} von {n}": "Tricks assigned: {a} of {n}", "Ansagen fertig → Stiche": "Bids done → tricks",
  "Runde abschließen": "Finish round", "Geht nicht (Plus/minus Eins)": "Not allowed (plus/minus one)", "☁️ Ansage {n}: {b}": "☁️ Bid {n}: {b}",
  "🎯 Getroffen: {n}": "🎯 Hit: {n}", "Niemand hat getroffen 🙈": "Nobody hit their bid 🙈",

  // Punkteübersicht & Ende
  "Punkte": "Score", "Als Bild teilen": "Share as image", "Bild gespeichert": "Image saved", "{n} Runden": "{n} rounds", "{n} Runde": "{n} round",
  "Nächste Runde: ▶ {a} beginnt · 🃏 {d}": "Next round: ▶ {a} starts · 🃏 {d}", "vorzeitig beendet": "ended early", "Game over": "Game over",
  "Spiel löschen": "Delete game", "Spiel beendet": "Game finished", "(von {n})": "(of {n})", "Ø {x} pro Runde": "Ø {x} per round",
  "Wahrsager-Award": "Fortune-teller award", "{a} von {n} Ansagen getroffen": "{a} of {n} bids hit", "{n} Bomben": "{n} Bombs", "{n} Wolken": "{n} Clouds",
  "Revanche": "Rematch", "Spiel gewertet": "Game scored", "Spiel gelöscht": "Game deleted",

  // Dialoge
  "Es läuft noch ein Spiel": "A game is still running",
  "Spiel vom {d} ({p}), {r} gespielt. Es kann immer nur ein Spiel laufen.": "Game from {d} ({p}), {r} played. Only one game can run at a time.",
  "Beenden & werten, dann neues Spiel": "End & score, then new game", "Löschen, dann neues Spiel": "Delete, then new game",
  "Zurück zum laufenden Spiel": "Back to the current game", "Game over?": "Game over?",
  "Das Spiel endet nach Runde {d}. Gewertet werden alle abgeschlossenen Runden.": "The game ends after round {d}. All completed rounds are scored.",
  "STAND NACH RUNDE {d}": "SCORE AFTER ROUND {d}", "Beenden & Ergebnis zeigen": "End & show result", "Spiel löschen statt werten": "Delete game instead of scoring",
  "Bist du sicher?": "Are you sure?",
  "Das Spiel vom {d} ({p}) wird endgültig aus der App gelöscht und zählt nicht mehr in der Statistik.": "The game from {d} ({p}) will be permanently deleted and no longer counts in the stats.",
  "Zur Bestätigung eintippen:": "Type to confirm:", "Zur Bestätigung <b>ja</b> eintippen": "Type <b>yes</b> to confirm", "Endgültig löschen": "Delete permanently", "Alles zurücksetzen?": "Reset everything?",
  "Alle Spiele, Spieler, eigenen Karten und Einstellungen werden gelöscht. Das kann nicht rückgängig gemacht werden. Tipp: vorher unter Import & Export ein Backup speichern.":
    "All games, players, own cards and settings will be deleted. This cannot be undone. Tip: save a backup under Import & export first.",
  "Ich bin kein Narr": "I am no Jester", "Alles löschen": "Delete everything",
  "Wer hat den Stich mit der Wolke gewonnen?": "Who won the trick with the Cloud?", "Ansage von {n}: {b} ändern auf …": "Change {n}'s bid {b} to …",
  "Wolke bei {n} zurücknehmen": "Undo Cloud for {n}", "Wer hat die Bombe gespielt?": "Who played the Bomb?", "Bombe zurücknehmen": "Undo Bomb",
  "Bombe eintragen": "Record Bomb", "Runde {r} bearbeiten": "Edit round {r}", "Person": "Person", "Bombe in dieser Runde": "Bomb in this round",
  "Stiche: {a} von {n}": "Tricks: {a} of {n}", "{n} zusammenführen mit …": "Merge {n} with …",
  "Alle Spiele von {n} gehen auf die gewählte Person über, das Profil {n} verschwindet.": "All games of {n} move to the chosen person, the profile {n} disappears.",
  "Zusammenführen": "Merge", "{a} in {b} aufgehen lassen?": "Merge {a} into {b}?",

  // Spieler & Profil
  "Spieler anlegen": "Add player", "Aktiv": "Active", "Ausgeblendet ({n})": "Hidden ({n})", "Noch keine Spieler.": "No players yet.",
  "{g} Spiele · {w} Siege": "{g} games · {w} wins", "Siegquote": "Win rate", "Ansage getroffen": "Bids hit", "Ø Punkte / Runde": "Ø points / round",
  "Rekord": "Record", "ANSAGE-TENDENZ": "BIDDING TENDENCY", "zu wenig {p}%": "too low {p}%", "zu viel {p}%": "too high {p}%",
  "{g} Spiele · {r} Runden": "{g} games · {r} rounds", "Längste Trefferserie: {n} Runden": "Longest hit streak: {n} rounds", "Beste Runde": "Best round",
  "Bestes Spiel": "Best game", "Lieblings-Ansage": "Favourite bid", "Ansage 0": "Bid 0", "gespielt": "played",
  "DIREKTER VERGLEICH (vor / hinter)": "HEAD-TO-HEAD (ahead / behind)", "ANGSTGEGNER": "NEMESIS", "liegt öfter vorn": "is ahead more often",
  "knappste Bilanz": "closest record", "Kürzel": "Initials", "Wieder einblenden": "Show again", "Spieler löschen": "Delete player",
  "Name der Person:": "Name of the person:", "„{n}“ gibt es schon. Bitte z. B. mit Nachnamen-Kürzel unterscheiden.": "“{n}” already exists. Please distinguish, e.g. with a surname initial.",
  "Neuer Name:": "New name:", "Diesen Namen gibt es schon – ggf. Profile zusammenführen": "This name already exists – merge profiles if needed",
  "Kürzel im Avatar (1–2 Zeichen, leer = automatisch):": "Avatar initials (1–2 characters, empty = automatic):", "Kürzel „{v}“ ist schon vergeben": "Initials “{v}” are already taken",
  "{n} ist wieder sichtbar": "{n} is visible again", "{n} endgültig löschen?": "Delete {n} permanently?", "{n} gelöscht": "{n} deleted", "Spieler ausblenden": "Hide player",
  "{n} hat {g} Spiele. Die Person wird ausgeblendet, ihre alten Spiele bleiben erhalten. Bei einer doppelten Person besser „Zusammenführen“.":
    "{n} has {g} games. The person will be hidden, their old games are kept. For a duplicate person use “Merge” instead.",
  "Ausblenden": "Hide", "{n} ausgeblendet": "{n} hidden", "Geht nicht: {e}": "Not possible: {e}", "{f} → {t} zusammengeführt": "{f} → {t} merged",
  "Beide haben im selben Spiel gespielt": "Both played in the same game",

  // Statistik
  "Alle Jahre": "All years", "Alle": "All", "2 Spieler": "2 players", "3 Spieler": "3 players", "4 Spieler": "4 players", "5+ Spieler": "5+ players",
  "{n} Spieler": "{n} players", "Keine Spiele für diesen Filter.": "No games for this filter.", "Spiele": "Games", "Runden": "Rounds", "SIEGE": "WINS",
  "DAUER": "DURATION", "Ø Partie": "Ø game", "Ø Runde": "Ø round", "Längste / kürzeste": "Longest / shortest", "Gesamt gespielt": "Total played",
  "Ø Dauer nach Spieleranzahl": "Ø duration by number of players", "SONSTIGES": "OTHER", "Vorzeitig beendet": "Ended early", "{a} von {n}": "{a} of {n}",
  "Runden mit Bombe": "Rounds with Bomb", "REKORDE": "RECORDS", "Höchster Endstand": "Highest final score", "Tiefster Endstand": "Lowest final score",
  "Größter Absturz": "Biggest crash", "Höchste getroffene Ansage": "Highest bid hit", "Längste Trefferserie": "Longest hit streak", "R": "R",
  "WAHRSAGER-RANKING (Trefferquote, ab 30 Runden)": "FORTUNE-TELLER RANKING (hit rate, from 30 rounds)", "SPIELE PRO JAHR": "GAMES PER YEAR",

  // Wissen & Karten
  "Karte anlegen": "Add card", "Karte oder Regel suchen …": "Search card or rule …", "Karten": "Cards", "Eigene": "Own", "Anleitung": "Rules", "App": "App",
  "Meine Karten": "My cards", "in der App": "in the app", "angepasst": "customised", "Nichts gefunden.": "Nothing found.", "Eigene Karte anlegen": "Add own card",
  "Grundregeln": "Basic rules", "Varianten": "Variants", "auswählbar": "selectable", "nur Regel": "rule only",
  "Taste „{c}“ in der Runde (Ansage ±1)": "“{c}” button in the round (bid ±1)", "Taste „{c}“ in der Runde (Stich zählt nicht)": "“{c}” button in the round (trick doesn't count)",
  "KURZ GESAGT": "IN SHORT", "Wert": "Value", "Farbe": "Colour", "DETAILS": "DETAILS", "KOMBINATIONEN": "COMBINATIONS", "In der App": "In the app",
  "Name und Kurztext sind Pflicht": "Name and short text are required", "Name gibt es schon": "Name already exists", "Karte bearbeiten": "Edit card", "Neue Karte": "New card",
  "Emoji antippen zum Ändern": "Tap an emoji to change", "Name": "Name", "z. B. 3½": "e.g. 3½", "Gruppe": "Group", "Kurz gesagt (1 Satz)": "In short (1 sentence)",
  "Details (eine Zeile pro Punkt, optional)": "Details (one line per point, optional)", "Kombinationen & Trumpf-Fall (optional)": "Combinations & trump case (optional)",
  "Wirkung auf die Wertung": "Effect on scoring", "keine": "none", "Ansage ±1 (wie Wolke)": "Bid ±1 (like Cloud)", "Stich zählt nicht (wie Bombe)": "Trick doesn't count (like Bomb)",
  "Mit Wirkung erscheint eine eigene Taste in der Runde.": "With an effect, a button of its own appears in the round.", "Original wiederherstellen": "Restore original",
  "Karte löschen": "Delete card", "Karte löschen?": "Delete card?",

  // Einstellungen
  "Standard für neue Spiele": "Defaults for new games", "Unerlaubte Ansage beim Dealer ausblenden": "Hide the dealer's forbidden bid",
  "Tasten für Wolke & Bombe in der Runde": "Cloud & Bomb buttons in the round", "Erfassen, wer die Bombe spielte": "Record who played the Bomb", "Für die Statistik": "For the stats",
  "Eingabe in der Runde": "Input in the round", "Fokus": "Focus", "Liste": "List", "Kacheln": "Tiles", "Darstellung": "Appearance", "☀ Hell": "☀ Light", "☾ Dunkel": "☾ Dark",
  "Wie System": "System", "System": "System", "Aus (Wizzpad-Orange)": "Off (Wizzpad orange)", "Grün": "Green", "Blau": "Blue", "Lila": "Purple", "Rot": "Red", "Türkis": "Teal", "Pink": "Pink",
  "Spieldauer anzeigen": "Show game duration", "Uhr in Runde und Punkteübersicht": "Clock in round and score sheet", "Bildschirm wach halten": "Keep screen awake",
  "Während eines Spiels": "During a game", "Sprache": "Language", "🇩🇪 Deutsch": "🇩🇪 Deutsch", "🇬🇧 English": "🇬🇧 English", "📱 Wie System": "📱 System",
  "Daten": "Data", "Alle Daten zurücksetzen": "Reset all data",

  // Import & Export
  "Import": "Import", "Export": "Export", "Wizard-Block-Dateien wählen": "Choose Wizard Block files",
  "wizardGame.json, wizardPlayer.json, wizardPlayerGame.json (alle drei markieren)": "wizardGame.json, wizardPlayer.json, wizardPlayerGame.json (select all three)",
  "Tabelle (CSV) importieren": "Import table (CSV)", "Aus Wizzpad exportierte CSV, vorhandene Spiele werden übersprungen": "CSV exported from Wizzpad, existing games are skipped",
  "Backup wiederherstellen": "Restore backup", "Wizzpad-Backup (JSON), ersetzt alle Daten": "Wizzpad backup (JSON), replaces all data",
  "Komplett-Backup (JSON)": "Full backup (JSON)", "Alle Spiele, Spieler, Karten, Einstellungen": "All games, players, cards, settings",
  "Tabelle (CSV)": "Table (CSV)", "Eine Zeile pro Spieler und Runde, für Excel": "One row per player and round, for Excel",
  "Import fehlgeschlagen: {e}": "Import failed: {e}", "{n} Spiele importiert": "{n} games imported", "{n} übersprungen": "{n} skipped",
  "{n} Punkte-Abweichungen": "{n} score mismatches", "Keine gültige Wizzpad-Backup-Datei": "Not a valid Wizzpad backup file",
  "Das Backup ersetzt alle aktuellen Daten. Fortfahren?": "The backup replaces all current data. Continue?", "Wiederherstellen": "Restore",
  "Backup wiederhergestellt": "Backup restored", "Gespeichert: {n}": "Saved: {n}", "Leere Datei": "Empty file", "Keine Wizzpad-CSV-Datei": "Not a Wizzpad CSV file",
  "Bitte alle drei Dateien gemeinsam auswählen": "Please select all three files together",
};
