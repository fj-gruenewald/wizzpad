<script lang="ts">
  import { t, tn } from "../lib/i18n";
  import Avatar from "./Avatar.svelte";
  import Sheet from "./Sheet.svelte";
  import { app, confirmAsk, current, fmtDate, player, ui } from "../lib/store.svelte";
  import { cardsOf, doneRounds, finalBid, order, totals } from "../lib/logic";
  import { cloud, continueGame, finishAndNew, gameOver, merge, removeGame, setBomb, undoCloud } from "../lib/actions";
  let typed = $state("");
  $effect(() => { void ui.sheet; typed = ""; });
  const g = $derived(current());
  const rd = $derived(g?.rounds.at(-1));
  const o = $derived(g ? order(g, g.rounds.length) : []);
</script>

{#if ui.sheet === "running" && g}
  {@const d = doneRounds(g)}
  <Sheet>
    <h2>{t("Es läuft noch ein Spiel")}</h2>
    <div style="font-size:14px;line-height:1.5">{t("Spiel vom {d} ({p}), {r} gespielt. Es kann immer nur ein Spiel laufen.", { d: fmtDate(g.start), p: g.players.map((p) => player(p).name).join(", "), r: tn(d, "{n} Runde", "{n} Runden") })}</div>
    <button class="btn" style="flex:none" disabled={!d} onclick={finishAndNew}>{t("Beenden & werten, dann neues Spiel")}</button>
    <button class="btn out" style="flex:none;color:var(--err)" onclick={() => { ui.dg = g.id; ui.after = "new"; ui.sheet = "delg"; }}>🗑 {t("Löschen, dann neues Spiel")}</button>
    <button class="btn out" style="flex:none" onclick={() => { ui.sheet = null; continueGame(); }}>{t("Zurück zum laufenden Spiel")}</button>
  </Sheet>
{:else if ui.sheet === "end" && g}
  {@const d = doneRounds(g)}{@const sc = totals(g)}{@const rk = [...g.players].sort((a, b) => sc[b] - sc[a])}
  <Sheet>
    <h2>🏁 {t("Game over?")}</h2>
    <div class="hint">{t("Das Spiel endet nach Runde {d}. Gewertet werden alle abgeschlossenen Runden.", { d })}</div>
    <div class="mut">{t("STAND NACH RUNDE {d}", { d })}</div>
    {#each rk as p (p)}<div class="row" style="margin-top:{sc[p] === sc[rk[0]] ? 16 : 6}px"><Avatar id={p} crown={sc[p] === sc[rk[0]]} /><span class="sp">{player(p).name}</span><b>{sc[p]}</b></div>{/each}
    <button class="btn" style="flex:none" disabled={!d} onclick={gameOver}>{t("Beenden & Ergebnis zeigen")}</button>
    <button class="btn out" style="flex:none" onclick={() => (ui.sheet = null)}>{t("Weiterspielen")}</button>
    <button class="btn txt" style="color:var(--err)" onclick={() => { ui.dg = g.id; ui.sheet = "delg"; }}>🗑 {t("Spiel löschen statt werten")}</button>
  </Sheet>
{:else if ui.sheet === "delg"}
  {@const dg = app.games.find((x) => x.id === ui.dg)}
  {#if dg}
    <Sheet>
      <h2>🗑 {t("Bist du sicher?")}</h2>
      <div style="font-size:14px;line-height:1.5">{t("Das Spiel vom {d} ({p}) wird endgültig aus der App gelöscht und zählt nicht mehr in der Statistik.", { d: fmtDate(dg.start), p: dg.players.map((p) => player(p).name).join(", ") })}</div>
      <label class="fl" for="dt">{@html t("Zur Bestätigung <b>ja</b> eintippen")}</label>
      <input class="tf" id="dt" autocomplete="off" bind:value={typed} />
      <button class="btn" style="flex:none;background:var(--err);color:#fff" disabled={typed.trim().toLowerCase() !== t("ja")} onclick={() => removeGame(dg.id)}>{t("Endgültig löschen")}</button>
      <button class="btn out" style="flex:none" onclick={() => { ui.sheet = null; ui.after = null; }}>{t("Abbrechen")}</button>
    </Sheet>
  {/if}
{:else if ui.sheet === "reset"}
  <Sheet>
    <h2>⚠️ {t("Alles zurücksetzen?")}</h2>
    <div style="font-size:14px;line-height:1.5">{t("Alle Spiele, Spieler, eigenen Karten und Einstellungen werden gelöscht. Das kann nicht rückgängig gemacht werden. Tipp: vorher unter Import & Export ein Backup speichern.")}</div>
    <label class="fl" for="rt">{t("Zur Bestätigung eintippen:")} <b>{t("Ich bin kein Narr")}</b></label>
    <input class="tf" id="rt" autocomplete="off" bind:value={typed} />
    <button class="btn" style="flex:none;background:var(--err);color:#fff" disabled={typed.trim().toLowerCase() !== t("Ich bin kein Narr").toLowerCase()} onclick={() => { localStorage.removeItem("wizzpad"); location.reload(); }}>{t("Alles löschen")}</button>
    <button class="btn out" style="flex:none" onclick={() => (ui.sheet = null)}>{t("Abbrechen")}</button>
  </Sheet>
{:else if ui.sheet === "cloud" && rd}
  <Sheet>
    <h2>☁️ {t("Wolke")}</h2>
    <div class="mut">{t("Wer hat den Stich mit der Wolke gewonnen?")}</div>
    <div class="chips" style="justify-content:space-between">{#each o as p (p)}<Avatar id={p} big sel={ui.cp === p} dim={!!ui.cp && ui.cp !== p} onclick={() => (ui.cp = p)} />{/each}</div>
    {#if ui.cp}
      {@const b = finalBid(rd, ui.cp)}{@const cp = ui.cp}
      <div class="mut">{t("Ansage von {n}: {b} ändern auf …", { n: player(cp).name, b })}</div>
      <div class="row">
        <button class="btn ton" style="font-size:24px" disabled={b <= 0} onclick={() => cloud(cp, -1)}>{b - 1}<div style="font-size:12px">−1</div></button>
        <button class="btn" style="font-size:24px" onclick={() => cloud(cp, 1)}>{b + 1}<div style="font-size:12px">+1</div></button>
      </div>
      {#if rd.cloud[cp]}<button class="btn txt" onclick={() => undoCloud(cp)}>{t("Wolke bei {n} zurücknehmen", { n: player(cp).name })}</button>{/if}
    {/if}
  </Sheet>
{:else if ui.sheet === "bomb" && rd}
  <Sheet>
    <h2>💣 {t("Bombe")}</h2>
    {#if app.set.bombBy}
      <div class="mut">{t("Wer hat die Bombe gespielt?")}</div>
      <div class="chips" style="justify-content:space-between">{#each o as p (p)}<Avatar id={p} big sel={ui.bp === p} dim={!!ui.bp && ui.bp !== p} onclick={() => (ui.bp = ui.bp === p ? null : p)} />{/each}</div>
    {/if}
    {#if rd.bomb}
      <button class="btn" style="flex:none" onclick={() => setBomb(1)}>{t("Speichern")}</button>
      <button class="btn out" style="flex:none" onclick={() => setBomb(0)}>{t("Bombe zurücknehmen")}</button>
    {:else}<button class="btn" style="flex:none" onclick={() => setBomb(1)}>{t("Bombe eintragen")}</button>{/if}
  </Sheet>
{:else if ui.sheet === "edit"}
  {@const eg = app.games.find((x) => x.id === ui.eg)}
  {#if eg && ui.er != null}
    {@const er = eg.rounds[ui.er]}{@const rn = ui.er + 1}{@const od = order(eg, rn)}{@const st = od.reduce((a, p) => a + (er.tricks[p] ?? 0), 0)}{@const ex = cardsOf(eg, rn) - er.bomb}
    <Sheet>
      <h2>{t("Runde {r} bearbeiten", { r: rn })}</h2>
      <div class="row mut"><span class="sp">{t("Person")}</span><span style="width:120px;text-align:center">{t("Ansage")}</span><span style="width:120px;text-align:center">{t("Stiche")}</span></div>
      {#each od as p (p)}
        <div class="row"><Avatar id={p} /><span class="sp nm" style="font-size:14px">{player(p).name}</span>
          <div class="step" style="width:120px"><button class="sb" style="width:34px;height:34px" onclick={() => (er.bids[p] = Math.max(-(er.cloud[p] ?? 0), (er.bids[p] ?? 0) - 1))}>−</button><span style="font-size:18px">{finalBid(er, p)}</span><button class="sb" style="width:34px;height:34px" onclick={() => (er.bids[p] = (er.bids[p] ?? 0) + 1)}>＋</button></div>
          <div class="step" style="width:120px"><button class="sb" style="width:34px;height:34px" onclick={() => (er.tricks[p] = Math.max(0, (er.tricks[p] ?? 0) - 1))}>−</button><span style="font-size:18px">{er.tricks[p] ?? 0}</span><button class="sb" style="width:34px;height:34px" onclick={() => (er.tricks[p] = (er.tricks[p] ?? 0) + 1)}>＋</button></div>
        </div>
      {/each}
      <button class="li" onclick={() => (er.bomb = er.bomb ? 0 : 1)}><span class="sp">💣 {t("Bombe in dieser Runde")}</span><div class="tog" class:on={!!er.bomb}></div></button>
      <div class="hint {st === ex ? 'ok' : 'w'}">{t("Stiche: {a} von {n}", { a: st, n: ex })}{st === ex ? " ✓" : ""}</div>
      <button class="btn" style="flex:none" onclick={() => (ui.sheet = null)}>{t("Fertig")}</button>
    </Sheet>
  {/if}
{:else if ui.sheet === "merge" && ui.pid}
  {@const me = player(ui.pid)}{@const pid = ui.pid}
  <Sheet>
    <h2>{t("{n} zusammenführen mit …", { n: me.name })}</h2>
    <div class="mut">{t("Alle Spiele von {n} gehen auf die gewählte Person über, das Profil {n} verschwindet.", { n: me.name })}</div>
    {#each app.players.filter((p) => p.id !== pid).sort((a, b) => a.name.localeCompare(b.name)) as p (p.id)}
      <button class="li" onclick={async () => { if (await confirmAsk(t("Zusammenführen"), t("{a} in {b} aufgehen lassen?", { a: me.name, b: p.name }), t("Zusammenführen"))) merge(pid, p.id); }}><Avatar id={p.id} /><span class="sp nm">{p.name}</span></button>
    {/each}
  </Sheet>
{/if}
