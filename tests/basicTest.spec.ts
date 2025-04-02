import { expect, Page } from "@playwright/test";
import { test } from "../src/utils/fixtures";
import { focusOnPage } from "../src/utils/helpers";
import { DeBridgeHomePage } from "../src/pages/DeBridgeHomePage";
import { MetaMaskOnboardingPage } from "../src/pages/MetaMaskOnboardingPage";
import { MetaMaskNotificationPage } from "../src/pages/MetaMaskNotificationPage";
import { MetaMaskPopupPage } from "../src/pages/MetaMaskPopupPage";
import { basicTestValues } from "../test-data/walletConfig.values";

test("Verify that wallet address and token balance are correct", async ({
  context,
  extensionId,
}) => {

  //#region values and parameters
  const seed = process.env.SEED;
  const password = process.env.PASSWORD;
  let deBridgeHomePage: DeBridgeHomePage;
  let metaMaskOnboardingPage: MetaMaskOnboardingPage;
  let metaMaskNotificationPage: MetaMaskNotificationPage;
  let metamaskPage: Page;
  let deBridgePage: Page;
  let balanceOfTokenOnDeBridge = 0;
  let walletAddressOnDeBridge = "";
  let balanceOfTokenOnPopup = 0;
  let walletAddressOnPopup = "";
  //#endregion

  await test.step("Import wallet", async () => {
    metamaskPage = await focusOnPage(context, basicTestValues.extensionUrlPart);
    metaMaskOnboardingPage = new MetaMaskOnboardingPage(metamaskPage);
    await metaMaskOnboardingPage.importExistingWallet(
      seed!,
      password!,
      basicTestValues.networkTestId
    );
    await metaMaskOnboardingPage.lockPage();
  })

  await test.step("Conncet wallet", async () => {
    deBridgePage = await context.newPage();
    deBridgeHomePage = new DeBridgeHomePage(deBridgePage);
    await deBridgeHomePage.openDebridgeApp();
    await deBridgeHomePage.connectWallet(basicTestValues.payToken, basicTestValues.currency);
  })


  await test.step("Confirm connection of Account on pop up", async () => {
    metamaskPage = await focusOnPage(context, basicTestValues.extensionUrlPart);
    metaMaskNotificationPage = new MetaMaskNotificationPage(metamaskPage);
    await metaMaskNotificationPage.logIn(password!);
    await metaMaskNotificationPage.connectAccount();
  })

  await test.step("Get values of balance and account address on deBridge", async () => {
    await focusOnPage(context, basicTestValues.deBridgePageUrlPart, true);
    balanceOfTokenOnDeBridge = await deBridgeHomePage.getBalanceOfNativeToken();
    walletAddressOnDeBridge = await deBridgeHomePage.getWalletAddress();
  })


  await test.step("Get values of balance and account address on MetaMask popup", async () => {
    metamaskPage = await context.newPage();
    const metaMaskPopUpPage = new MetaMaskPopupPage(metamaskPage);
    await metaMaskPopUpPage.openPage(extensionId);
    balanceOfTokenOnPopup = await metaMaskPopUpPage.getCurrentTokenValue();
    walletAddressOnPopup = await metaMaskPopUpPage.getCurrentWalletAddress();
  })

  expect.soft(balanceOfTokenOnDeBridge).toBe(balanceOfTokenOnPopup);
  expect.soft(walletAddressOnDeBridge).toBe(walletAddressOnPopup);
});
