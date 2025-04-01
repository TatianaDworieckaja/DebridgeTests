import { BrowserContext, Page } from "@playwright/test";

export async function focusOnPage(
  context: BrowserContext,
  urlPart: string,
  alreadyOpened?: boolean | false
): Promise<Page> {
  if (!alreadyOpened) {
    await context.waitForEvent("page");
  }
  const pages = context.pages();
  const pageToFocusOn = pages.find((page) => page.url().includes(urlPart));

  if (pageToFocusOn) {
    await pageToFocusOn.bringToFront();
    return pageToFocusOn;
  }
  throw new Error(`Page with url including ${urlPart} is not displayed`);
}
