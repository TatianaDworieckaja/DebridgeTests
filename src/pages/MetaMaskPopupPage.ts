import { expect, Page } from "@playwright/test";

export class MetaMaskPopupPage {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  public async openPage(extensionId: string) {
    await this.page.goto(`chrome-extension://${extensionId}/popup.html#`);
    await expect(
      this.page.getByRole("button", { name: "Tokens" })
    ).toBeVisible();
  }

  public async getCurrentTokenValue(): Promise<number> {
    const tokenValue = await this.page
      .getByTestId("multichain-token-list-item-value")
      .first()
      .innerText();
    return parseFloat(tokenValue);
  }

  public async getCurrentWalletAddress(): Promise<string> {
    await this.page.getByTestId("app-header-copy-button").click();
    const walletAddress = await this.page.evaluate(async () => {
      return await navigator.clipboard.readText();
    });
    return walletAddress;
  }
}
