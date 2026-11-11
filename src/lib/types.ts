export type Id = string;
export type Mode = "classic" | "mono" | "maximus";
export type Hidden = "" | "tip" | "secret";
export type Effect = "" | "cloud" | "bomb";
export type Entry = "focus" | "list" | "tiles";

export interface Player {
  id: Id;
  name: string;
  color: string;
  abbr?: string;
  deleted?: boolean;
  /** Wizard-Block-ID(s), damit ein erneuter Import richtig zuordnet */
  wb?: string;
  wbIds?: string[];
}

export interface Round {
  phase: "bid" | "tricks";
  bids: Record<Id, number>;
  tricks: Record<Id, number>;
  /** Wolke: Korrektur der Ansage (+1/−1, kumuliert) */
  cloud: Record<Id, number>;
  bomb: number;
  bombBy?: Id | null;
  done: boolean;
}

export interface Game {
  id: Id;
  start: number;
  end: number | null;
  players: Id[];
  mode: Mode;
  pm1: boolean;
  cb: boolean;
  hid: Hidden;
  /** natürliche Rundengrenze (Kartenzahl), danach endet das Spiel automatisch */
  max: number;
  rounds: Round[];
  wb?: string;
  src?: "wizardblock";
}

export interface Card {
  e: string;
  n: string;
  g: string;
  w?: string;
  f?: string;
  s: string;
  det: string[];
  combo: string[];
  app?: string;
  eff?: Effect;
  own?: boolean;
  mod?: boolean;
  /** Anzeigename (Übersetzung); n bleibt der feste Schlüssel */
  dn?: string;
}

export interface Settings {
  entry: Entry;
  pm1: boolean;
  cb: boolean;
  bombBy: boolean;
  timer: boolean;
  wake: boolean;
  mode: "light" | "dark" | "system";
  dyn: string;
  lang: "de" | "en" | "system";
  /** Anzeigegröße: s = 100 %, m = 115 %, l = 130 % */
  size: "s" | "m" | "l";
}

export interface State {
  v: 1;
  players: Player[];
  games: Game[];
  cur: Id | null;
  set: Settings;
  cards: Card[];
  cardOv: Record<string, Partial<Card>>;
  delWb: string[];
}
