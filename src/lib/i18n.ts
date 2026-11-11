// Übersetzung: deutscher Text ist der Schlüssel, EN liefert die englische Fassung.
// Platzhalter: {name}. Fehlende Übersetzungen findet der Test i18n.test.ts.
import { lang } from "./store.svelte";
import { EN } from "./en";

export function t(s: string, v?: Record<string, string | number>): string {
  let r = lang() === "en" ? (EN[s] ?? s) : s;
  if (v) for (const k in v) r = r.replaceAll("{" + k + "}", String(v[k]));
  return r;
}
/** Einzahl/Mehrzahl, z. B. tn(n, "{n} Runde", "{n} Runden") */
export const tn = (n: number, one: string, many: string) => t(n === 1 ? one : many, { n });
