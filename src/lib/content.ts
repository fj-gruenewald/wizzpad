import type { Card } from "./types";

export const CARDS: Card[] = [
{e:"🐉",n:"Drache",g:"30 Jahre",w:"höchste Karte",s:"Schlägt alles, auch Wizards – außer die Fee liegt im Stich.",det:["Gewinnt jeden Stich, auch gegen Wizards","Eröffnet er den Stich: Bedienregeln wie beim Wizard","Als Trumpfkarte aufgedeckt: Dealer bestimmt Trumpf"],combo:["🐉 + 🧚: Die Fee gewinnt den Stich"]},
{e:"🧚",n:"Fee",g:"30 Jahre",w:"unter dem Narren",s:"Gewinnt den Stich, wenn der Drache darin liegt.",det:["Sonst niedriger als jeder Narr","Eröffnet sie den Stich: Bedienregeln wie beim Narren","Als Trumpfkarte aufgedeckt: kein Trumpf"],combo:["🧚 + 🐉: Die Fee gewinnt","🧚 + 💣: Niemand gewinnt den Stich"]},
{e:"💣",n:"Bombe",g:"30 Jahre",app:"Taste „💣 Bombe“ in der Runde",s:"Niemand gewinnt den Stich, er zählt für keine Ansage.",det:["Wer ohne Bombe gewonnen hätte, eröffnet den nächsten Stich","Eröffnet sie den Stich: Bedienregeln wie beim Narren","Als Trumpfkarte aufgedeckt: kein Trumpf"],combo:["💣 + ☁️: Die Ansage ändert sich nicht","💣 + 🤹: Karten werden trotzdem weitergegeben"]},
{e:"☁️",n:"Wolke",g:"30 Jahre",w:"9¾",f:"frei wählbar, auch Trumpf",app:"Taste „☁️ Wolke“ in der Runde",s:"Wer den Stich mit der Wolke gewinnt, muss seine Ansage um +1 oder −1 ändern.",det:["Beim Ausspielen eine Farbe ansagen","Eröffnet sie den Stich, muss man diese Farbe bedienen","Als Trumpfkarte aufgedeckt: Dealer bestimmt Trumpf"],combo:["💣 + ☁️: Ansage bleibt gleich","🤹 + ☁️: Erst Karten weitergeben, dann ±1"]},
{e:"🤹",n:"Jongleur",g:"30 Jahre",w:"7½",f:"frei wählbar, auch Trumpf",s:"Nach dem Stich geben alle eine Handkarte verdeckt nach links weiter.",det:["Beim Ausspielen eine Farbe ansagen","Im letzten Stich der Runde wird nicht weitergegeben","Als Trumpfkarte aufgedeckt: Dealer bestimmt Trumpf"],combo:["🤹 + 💣: Trotzdem weitergeben","🤹 + ☁️: Erst weitergeben, dann ±1"]},
{e:"🐺",n:"Werwolf",g:"30 Jahre",s:"Vor den Ansagen gegen die Trumpfkarte tauschen und Trumpf bestimmen.",det:["Man darf auch „kein Trumpf“ bestimmen","Erst danach beginnen die Ansagen","Als Trumpfkarte aufgedeckt: Dealer bestimmt Trumpf"],combo:["🐺 + 🧛: Der Vampir deckt sofort eine neue Trumpfkarte auf"]},
{e:"🎭",n:"Gestaltenwandler",g:"30 Jahre",w:"Wizard oder Narr",s:"Beim Ausspielen entscheiden: Wizard oder Narr.",det:["Wird danach genau wie die gewählte Karte behandelt","Als Trumpfkarte aufgedeckt: Dealer bestimmt Trumpf","Laut AMIGO die beste Karte für den Einstieg"],combo:[]},
{e:"🧙‍♀️",n:"Hexe",g:"30 Jahre",w:"unter Narr und Fee",s:"Nach dem Stich eine Handkarte gegen eine Karte aus dem Stich tauschen.",det:["Erst werden alle anderen Effekte abgehandelt und der Gewinner bestimmt","Die Hexe selbst darf man nicht nehmen","Als Trumpfkarte aufgedeckt: kein Trumpf"],combo:["🧙‍♀️ + ☁️: Erst Wolke, dann tauschen – auch die Wolke"]},
{e:"🧛",n:"Vampir",g:"30 Jahre",w:"wie kopierte Karte",s:"Kopiert die aufgedeckte Trumpfkarte samt Effekten.",det:["Es gelten die Bedienregeln der kopierten Karte","Als Trumpfkarte aufgedeckt: Dealer bestimmt Trumpf"],combo:["🧛 + 🐺: Sofort neue Trumpfkarte aufdecken und kopieren"]},
{e:"🧙",n:"Wizard",g:"Grundspiel",w:"höher als alle Zahlen",s:"Gewinnt den Stich – der zuerst gespielte Wizard.",det:["Darf immer gespielt werden","Eröffnet ein Wizard, dürfen alle beliebig spielen","Als Trumpfkarte aufgedeckt: Dealer bestimmt Trumpf"],combo:[]},
{e:"🃏",n:"Narr",g:"Grundspiel",w:"niedriger als alle Zahlen",s:"Verliert immer. Liegen nur Narren im Stich, gewinnt der erste.",det:["Darf immer gespielt werden","Eröffnet ein Narr, wird ab der ersten Zahlenkarte bedient","Als Trumpfkarte aufgedeckt: kein Trumpf"],combo:[]},
{e:"🍄",n:"Gnom / Dieb",g:"Eigene",w:"3½",s:"Wer den Stich gewinnt, darf eine Karte mit einer beliebigen Person tauschen.",det:["Eigene Hauskarte","Schwester des Schlafenden Jan"],combo:[]},
{e:"🦎",n:"Formwandler",g:"Eigene",w:"jede Karte",s:"Kann jede Karte annehmen, außer Sonderkarten.",det:["Eigene Hauskarte","Anders als der offizielle Gestaltenwandler (nur Wizard oder Narr)"],combo:[]},
{e:"😴",n:"Schlafender Jan",g:"Eigene",w:"wie Narr",s:"Wie ein Narr – macht gar nichts.",det:["Ob man ihn spielt oder nicht, ist egal","Bruder des Gnoms. Zzz …"],combo:[]}];

export const RULES: { k: "base" | "var"; n: string; t: string; sel?: number }[] = [
{k:"base",n:"Aufbau & Rundenzahl",t:"60 Karten: 4 Farben × Werte 1–13, dazu 4 Wizards und 4 Narren. Runden: 3 Personen 20 · 4 Personen 15 · 5 Personen 12 · 6 Personen 10. In Runde n bekommt jede Person n Karten."},
{k:"base",n:"Trumpf bestimmen",t:"Die oberste Karte des Reststapels bestimmt die Trumpffarbe. Wizard: Der Dealer wählt. Narr: kein Trumpf. Die letzte Runde wird ohne Trumpf gespielt (ohne Sonderkarten)."},
{k:"base",n:"Ansage & Reihenfolge",t:"Die Person links vom Dealer sagt zuerst an und spielt zuerst aus. Der Dealer wechselt jede Runde im Uhrzeigersinn."},
{k:"base",n:"Bedienen & Stich gewinnen",t:"Farbe bedienen, wenn möglich. Wizards und Narren darf man immer spielen. Den Stich gewinnt: der erste Wizard › der höchste Trumpf › die höchste Karte der ausgespielten Farbe › der erste Narr (nur Narren)."},
{k:"base",n:"Wertung: 20 + 10 je Stich / −10",t:"Ansage getroffen: 20 Punkte + 10 je Stich. Daneben: −10 je Stich Abweichung. Die meisten Punkte gewinnen."},
{k:"var",sel:1,n:"Plus/minus Eins",t:"Die Summe aller Ansagen darf nicht der Zahl der Stiche entsprechen. Die App blendet beim Dealer die unerlaubte Ansage aus."},
{k:"var",sel:1,n:"Verdeckter Tipp",t:"Alle tippen geheim und decken gleichzeitig auf."},
{k:"var",sel:1,n:"Geheime Vorhersage",t:"Ansagen werden geheim notiert und erst nach der Runde aufgedeckt."},
{k:"var",sel:1,n:"Einfarbig (3–4)",t:"Jede Person bekommt eine ganze Farbe inkl. Wizard und Narr, kein Trumpf, höchster Wert gewinnt. Start mit 4 Karten, dann je +1, 12 Runden. Ohne Sonderkarten."},
{k:"var",sel:1,n:"Wizard Maximus",t:"Nur 5 Runden, jeweils alle Karten. Trumpf fest: Blau, Rot, Grün, Gelb, dann keiner. Ohne Sonderkarten. (Quelle: AMIGO, 30-Jahre-Edition)"},
{k:"var",n:"Hellsehen",t:"Runde 1: Die eigene Karte an die Stirn halten, man sieht nur die Karten der anderen. Ohne Sonderkarten."}];

export const APPHELP: { n: string; t: string }[] = [
{n:"Punkteübersicht lesen",t:"Große Zahl = Punktestand nach der Runde. Klein darunter: Ansage/Stiche. Grün = Ansage getroffen, Rot = daneben. 💣 = Runde mit Bombe, ☁️ = Runde mit Wolke."},
{n:"Runde bearbeiten",t:"In der Punkteübersicht eine Runde antippen. Ansage, Stiche und Bombe lassen sich nachträglich ändern, die Punkte werden neu berechnet."},
{n:"Reihenfolge, beginnt & Dealer",t:"Wer beim neuen Spiel zuerst gewählt wird, sagt in Runde 1 zuerst an (▶). Die letzte Person ist Dealer (🃏). Beides rotiert jede Runde um einen Platz."},
{n:"Ansagen & Stiche eintragen",t:"Erst Ansagen, dann Stiche. Die Stiche sind mit den Ansagen vorbefüllt – nur bei Abweichungen korrigieren. Das Eingabe-Layout (Liste, Kacheln, Fokus) stellst du in den Einstellungen ein."},
{n:"Wolke & Bombe",t:"☁️ Wolke: Person wählen, die den Stich gewonnen hat, dann Ansage +1 oder −1. 💣 Bombe: Es wird ein Stich weniger verteilt. Optional angeben, wer sie gespielt hat."},
{n:"Plus/minus Eins",t:"Ist die Regel an, blendet die App beim Dealer die Ansage aus, mit der die Ansagen aufgehen würden."},
{n:"Spiel beenden",t:"In der Punkteübersicht unten links „✕ Game over“. Gewertet werden alle abgeschlossenen Runden. Die Uhr läuft bis dahin ohne Pause."},
{n:"Kürzel im Avatar",t:"Die App wählt automatisch eindeutige Kürzel (z. B. „J“ und „Ja“). Im Profil kannst du das Kürzel selbst festlegen."},
{n:"Gleiche Namen & Zusammenführen",t:"Jeder Name darf nur einmal vorkommen. Gibt es eine Person doppelt (z. B. nach einem Import), im Profil „Zusammenführen“ wählen – alle Spiele gehen auf das andere Profil über."},
{n:"Import & Export",t:"Einstellungen → Import & Export: Wizard-Block-Dateien einlesen (bereits vorhandene Spiele werden übersprungen), Backup als JSON speichern und wiederherstellen, Tabelle als CSV exportieren oder importieren, einzelnes Spiel als Bild teilen."},
{n:"Tablet & Querformat",t:"Auf breiten Bildschirmen stehen Eingabe der Runde und Punkteübersicht nebeneinander."}];

export const COLORS = ["#e8a33d", "#4a90d9", "#3fae6b", "#e0607e", "#9b6fd6", "#e07b39", "#2fa7a0", "#c0504d", "#7a8b99"];

/* ---------- English ---------- */
type CardEn = { dn: string; g: string; w?: string; f?: string; s: string; det: string[]; combo: string[]; app?: string };
export const CARDS_EN: Record<string, CardEn> = {
  "Drache": { dn: "Dragon", g: "30 Years", w: "highest card", s: "Beats everything, even Wizards – unless the Fairy is in the trick.", det: ["Wins every trick, even against Wizards", "If it leads the trick: follow rules as for a Wizard", "Turned up as trump: the dealer chooses trump"], combo: ["🐉 + 🧚: The Fairy wins the trick"] },
  "Fee": { dn: "Fairy", g: "30 Years", w: "below the Jester", s: "Wins the trick if the Dragon is in it.", det: ["Otherwise lower than any Jester", "If it leads the trick: follow rules as for a Jester", "Turned up as trump: no trump"], combo: ["🧚 + 🐉: The Fairy wins", "🧚 + 💣: Nobody wins the trick"] },
  "Bombe": { dn: "Bomb", g: "30 Years", app: "“💣 Bomb” button in the round", s: "Nobody wins the trick, it counts for no bid.", det: ["Whoever would have won without the Bomb leads the next trick", "If it leads the trick: follow rules as for a Jester", "Turned up as trump: no trump"], combo: ["💣 + ☁️: The bid does not change", "💣 + 🤹: Cards are still passed on"] },
  "Wolke": { dn: "Cloud", g: "30 Years", w: "9¾", f: "any colour, trump too", app: "“☁️ Cloud” button in the round", s: "Whoever wins the trick with the Cloud must change their bid by +1 or −1.", det: ["Name a colour when playing it", "If it leads the trick, that colour must be followed", "Turned up as trump: the dealer chooses trump"], combo: ["💣 + ☁️: Bid stays the same", "🤹 + ☁️: Pass cards first, then ±1"] },
  "Jongleur": { dn: "Juggler", g: "30 Years", w: "7½", f: "any colour, trump too", s: "After the trick everyone passes one hand card face down to the left.", det: ["Name a colour when playing it", "No passing in the last trick of the round", "Turned up as trump: the dealer chooses trump"], combo: ["🤹 + 💣: Still pass on", "🤹 + ☁️: Pass first, then ±1"] },
  "Werwolf": { dn: "Werewolf", g: "30 Years", s: "Before bidding, swap it for the trump card and choose trump.", det: ["You may also choose “no trump”", "Bidding starts afterwards", "Turned up as trump: the dealer chooses trump"], combo: ["🐺 + 🧛: The Vampire immediately turns up a new trump card"] },
  "Gestaltenwandler": { dn: "Shapeshifter", g: "30 Years", w: "Wizard or Jester", s: "When playing it, decide: Wizard or Jester.", det: ["Then treated exactly like the chosen card", "Turned up as trump: the dealer chooses trump", "According to AMIGO the best card to start with"], combo: [] },
  "Hexe": { dn: "Witch", g: "30 Years", w: "below Jester and Fairy", s: "After the trick, swap one hand card for a card from the trick.", det: ["All other effects and the winner are resolved first", "You may not take the Witch itself", "Turned up as trump: no trump"], combo: ["🧙‍♀️ + ☁️: Cloud first, then swap – the Cloud too"] },
  "Vampir": { dn: "Vampire", g: "30 Years", w: "as copied card", s: "Copies the face-up trump card including its effects.", det: ["The follow rules of the copied card apply", "Turned up as trump: the dealer chooses trump"], combo: ["🧛 + 🐺: Immediately turn up a new trump card and copy it"] },
  "Wizard": { dn: "Wizard", g: "Base game", w: "higher than all numbers", s: "Wins the trick – the first Wizard played.", det: ["May always be played", "If a Wizard leads, everyone may play anything", "Turned up as trump: the dealer chooses trump"], combo: [] },
  "Narr": { dn: "Jester", g: "Base game", w: "lower than all numbers", s: "Always loses. If only Jesters are in the trick, the first one wins.", det: ["May always be played", "If a Jester leads, follow from the first number card", "Turned up as trump: no trump"], combo: [] },
  "Gnom / Dieb": { dn: "Gnome / Thief", g: "Own", w: "3½", s: "Whoever wins the trick may swap a card with any player.", det: ["Custom house card", "Sister of Sleeping Jan"], combo: [] },
  "Formwandler": { dn: "Morph", g: "Own", w: "any card", s: "Can become any card except special cards.", det: ["Custom house card", "Unlike the official Shapeshifter (only Wizard or Jester)"], combo: [] },
  "Schlafender Jan": { dn: "Sleeping Jan", g: "Own", w: "like Jester", s: "Like a Jester – does nothing at all.", det: ["Doesn't matter whether you play it or not", "Brother of the Gnome. Zzz …"], combo: [] },
};

export const RULES_EN: Record<string, { n: string; t: string }> = {
  "Aufbau & Rundenzahl": { n: "Setup & number of rounds", t: "60 cards: 4 colours × values 1–13, plus 4 Wizards and 4 Jesters. Rounds: 3 players 20 · 4 players 15 · 5 players 12 · 6 players 10. In round n everyone gets n cards." },
  "Trumpf bestimmen": { n: "Determining trump", t: "The top card of the remaining deck sets the trump colour. Wizard: the dealer chooses. Jester: no trump. The last round is played without trump (without special cards)." },
  "Ansage & Reihenfolge": { n: "Bidding & order", t: "The player left of the dealer bids first and leads first. The dealer moves clockwise every round." },
  "Bedienen & Stich gewinnen": { n: "Following suit & winning tricks", t: "Follow suit if possible. Wizards and Jesters may always be played. The trick goes to: the first Wizard › the highest trump › the highest card of the led colour › the first Jester (only Jesters)." },
  "Wertung: 20 + 10 je Stich / −10": { n: "Scoring: 20 + 10 per trick / −10", t: "Bid met: 20 points + 10 per trick. Missed: −10 per trick of difference. Most points wins." },
  "Plus/minus Eins": { n: "Plus/minus one", t: "The sum of all bids must not equal the number of tricks. The app blocks the forbidden bid for the dealer." },
  "Verdeckter Tipp": { n: "Hidden bid", t: "Everyone bids secretly and reveals at the same time." },
  "Geheime Vorhersage": { n: "Secret prediction", t: "Bids are noted secretly and only revealed after the round." },
  "Einfarbig (3–4)": { n: "Single colour (3–4)", t: "Each player gets a whole colour incl. Wizard and Jester, no trump, highest value wins. Start with 4 cards, then +1 each, 12 rounds. Without special cards." },
  "Wizard Maximus": { n: "Wizard Maximus", t: "Only 5 rounds, each with all cards. Fixed trump: blue, red, green, yellow, then none. Without special cards. (Source: AMIGO, 30 Years edition)" },
  "Hellsehen": { n: "Clairvoyance", t: "Round 1: hold your own card to your forehead, you only see the others' cards. Without special cards." },
};

export const APPHELP_EN: Record<string, { n: string; t: string }> = {
  "Punkteübersicht lesen": { n: "Reading the score sheet", t: "Big number = score after the round. Small below: bid/tricks. Green = bid met, red = missed. 💣 = round with Bomb, ☁️ = round with Cloud." },
  "Runde bearbeiten": { n: "Editing a round", t: "Tap a round in the score sheet. Bid, tricks and Bomb can be changed afterwards, points are recalculated." },
  "Reihenfolge, beginnt & Dealer": { n: "Order, starts & dealer", t: "Whoever is picked first for a new game bids first in round 1 (▶). The last person is the dealer (🃏). Both rotate by one seat every round." },
  "Ansagen & Stiche eintragen": { n: "Entering bids & tricks", t: "Bids first, then tricks. Tricks are prefilled with the bids – only correct deviations. Choose the input layout (list, tiles, focus) in the settings." },
  "Wolke & Bombe": { n: "Cloud & Bomb", t: "☁️ Cloud: pick the person who won the trick, then bid +1 or −1. 💣 Bomb: one trick fewer is distributed. Optionally record who played it." },
  "Plus/minus Eins": { n: "Plus/minus one", t: "If the rule is on, the app blocks the dealer's bid that would make the bids add up." },
  "Spiel beenden": { n: "Ending a game", t: "In the score sheet bottom left “✕ Game over”. All completed rounds are scored. The clock runs without pause until then." },
  "Kürzel im Avatar": { n: "Avatar initials", t: "The app picks unique initials automatically (e.g. “J” and “Ja”). You can set them yourself in the profile." },
  "Gleiche Namen & Zusammenführen": { n: "Same names & merging", t: "Every name may only exist once. If a person exists twice (e.g. after an import), choose “Merge” in the profile – all games move to the other profile." },
  "Import & Export": { n: "Import & export", t: "Settings → Import & export: read Wizard Block files (existing games are skipped), save and restore a JSON backup, export or import a CSV table, share a single game as an image." },
  "Tablet & Querformat": { n: "Tablet & landscape", t: "On wide screens the round input and the score sheet are shown side by side." },
};
