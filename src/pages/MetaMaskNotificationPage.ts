import { Page } from "@playwright/test";

export class MetaMaskNotificationPage {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  public async connectAccount() {
    await this.page.getByRole("button", { name: "Connect" }).click();
  }

  public async logIn(password: string) {
    await this.page.getByTestId("unlock-password").fill(password);
    await this.page.getByTestId("unlock-submit").click();
  }
}
