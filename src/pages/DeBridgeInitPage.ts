import { Page } from "@playwright/test";

export class DeBridgeHomePage {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  public async openDebridgeApp() {
    await this.page.goto("https://app.debridge.finance/");
    await this.page.waitForLoadState("networkidle");
  }

  public async connectWallet(payToken: string, currency: string) {
    await this.chooseToken(payToken, currency);
    const connectButton = this.page
      .getByRole("button", {
        name: "Connect wallet",
      })
      .first();
    await connectButton.click();
    await this.page.getByText("Metamask").click();
  }

  //TODO enums
  //Polygon, MATIC
  private async chooseToken(payToken: string, currency: string) {
    await this.page.locator("div").filter({ hasText: /^ETH$/ }).nth(1).click();
    await this.page.getByText(payToken).click();
    await this.page.getByText(currency).first().click();
  }

  public async getBalanceOfNativeToken(): Promise<number> {
    const balance = await this.page.locator(".__native-balance").innerText();
    return parseFloat(balance);
  }

  public async getWalletAddress(): Promise<string> {
    await this.page.locator(".wallet-account__address").hover();
    await this.page.locator('[class="copy-btn icomoon-copy"]').click();
    const walletAddress = await this.page.evaluate(() =>
      navigator.clipboard.readText()
    );
    return walletAddress;
  }
}
