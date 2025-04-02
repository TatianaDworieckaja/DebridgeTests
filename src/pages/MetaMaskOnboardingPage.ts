import { expect, Page } from "@playwright/test";

//onboarding
export class MetaMaskOnboardingPage {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  public async importExistingWallet(
    seed: string,
    password: string,
    netWorkTestId: string
  ) {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.getByRole("checkbox").click();
    await this.page
      .getByRole("button", { name: "Import an existing wallet" })
      .click();
    await this.page.locator("#metametrics-opt-in").click();
    await this.page.getByRole("button", { name: "I agree" }).click();
    await this.fillSeedPhrase(seed);
    await this.page
      .getByRole("button", { name: "Confirm Secret Recovery Phrase" })
      .click();
    await this.providePassword(password);
    await this.finishOnboarding();
    await this.chooseNetwork(netWorkTestId);
  }

  private async providePassword(password: string) {
    await this.page.getByTestId("create-password-new").fill(password);
    await this.page.getByTestId("create-password-confirm").fill(password);
    await this.page.getByTestId("create-password-terms").click();
    await this.page.getByTestId("create-password-import").click();
    await expect(this.page.getByText("Your wallet is ready")).toBeVisible();
  }

  private async finishOnboarding() {
    await this.page.getByTestId("onboarding-complete-done").click();
    await this.page.getByText("Next").click();
    await this.page.getByRole("button", { name: "Done" }).click();
  }

  private async chooseNetwork(testId: string) {
    await this.page.getByTestId("network-display").click();
    await this.page.getByTestId(testId).getByText("Add").click();
    await this.page.getByText("Approve").click();
  }

  public async lockPage() {
    await this.page.getByTestId("account-options-menu-button").click();
    await this.page.getByTestId("global-menu-lock").click();
    await expect(this.page.getByTestId("unlock-password")).toBeVisible();
    await this.page.close();
  }

  private async fillSeedPhrase(seed: string) {
    const seedArr = seed.split(" ");
    for (let i = 0; i < 12; i++) {
      const locator = this.page.getByTestId(`import-srp__srp-word-${i}`);
      await locator.fill(seedArr[i]);
    }
  }
}
