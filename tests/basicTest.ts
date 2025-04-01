import { expect } from "@playwright/test";
import { test } from "../src/utils/fixtures";
import { focusOnPage } from "../src/utils/helpers";
import { DeBridgeHomePage } from "../src/pages/DeBridgeInitPage";
import { MetaMaskOnboardingPage } from "../src/pages/MetaMaskOnboardingPage";
import { MetaMaskNotificationPage } from "../src/pages/MetaMaskNotificationPage";
import { MetaMaskPopupPage } from "../src/pages/MetaMaskPopupPage";

//TODO e.g. pass as env variable/test data
const seed =
  "topic awkward boat express embody brain leader quick anger target clean fever";
const password = "28032025debridge";
const extensionUrlPart = "chrome-extension://";
const deBridgePageUrlPart = "https://app.debridge.finance/";
const payToken = "Polygon";
const currency = "MATIC";

test("Verify that wallet address and token balance are correct", async ({
  context,
  extensionId,
}) => {
  let metamaskPage = await focusOnPage(context, extensionUrlPart);
  const metaMaskOnboardingPage = new MetaMaskOnboardingPage(metamaskPage);
  await metaMaskOnboardingPage.importExistingWallet(seed, password);
  await metaMaskOnboardingPage.lockPage();
  await metamaskPage.close();

  let deBridgePage = await context.newPage();
  const deBridgeHomePage = new DeBridgeHomePage(deBridgePage);
  await deBridgeHomePage.openDebridgeApp();
  await deBridgeHomePage.connectWallet(payToken, currency);

  metamaskPage = await focusOnPage(context, extensionUrlPart);
  const metaMaskNotificationPage = new MetaMaskNotificationPage(metamaskPage);
  await metaMaskNotificationPage.logIn(password);
  await metaMaskNotificationPage.connectAccount();

  await focusOnPage(context, deBridgePageUrlPart, true);
  const balanceOfTokenOnDeBridge =
    await deBridgeHomePage.getBalanceOfNativeToken();
  const walletAddressOnDeBridge = await deBridgeHomePage.getWalletAddress();

  metamaskPage = await context.newPage();
  const metaMaskPopUpPage = new MetaMaskPopupPage(metamaskPage);
  await metaMaskPopUpPage.openPage(extensionId);

  const balanceOfTokenOnPopup = await metaMaskPopUpPage.getCurrentTokenValue();
  const walletAddressOnPopup =
    await metaMaskPopUpPage.getCurrentWalletAddress();
  expect.soft(balanceOfTokenOnDeBridge).toBe(balanceOfTokenOnPopup);
  expect.soft(walletAddressOnDeBridge).toBe(walletAddressOnPopup);
});
