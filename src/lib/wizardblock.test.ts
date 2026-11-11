import { it, expect } from "vitest";
import { readWizardBlockFiles, wbName } from "./wizardblock";

it("erkennt umbenannte Wizard-Block-Dateien", () => {
  expect(wbName("wizardGame.json")).toBe("wizardgame");
  expect(wbName("wizardPlayerGame (1).json")).toBe("wizardplayergame");
  expect(wbName("WizardPlayer-2.json")).toBe("wizardplayer");
});

it("liest alle drei Dateien, auch mit Android-Kopiennamen", async () => {
  const f = (n: string, d: unknown) => new File([JSON.stringify(d)], n);
  const x = await readWizardBlockFiles([f("wizardGame (1).json", [{ a: 1 }]), f("wizardPlayer.json", [{ b: 2 }]), f("wizardPlayerGame (1).json", [{ c: 3 }])]);
  expect(x.games).toEqual([{ a: 1 }]);
  expect(x.rows).toEqual([{ c: 3 }]);
  await expect(readWizardBlockFiles([f("wizardGame.json", [])])).rejects.toThrow();
});
