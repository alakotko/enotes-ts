import { test as baseTest, expect } from "@playwright/test";
import { CatalogPage } from "../lib/pom/CatalogPage";
import { loginPost, clearCart, addCsfrHeaders } from "../lib/api";

import type { MyFixtures } from "./types";

export const test = baseTest.extend<MyFixtures>({
	login: async ({ context }, use) => {
		await loginPost(context.request, "test", "test");
		await use(context);
	},
	setCsfrToken: async ({ context }, use) => {
		context = await addCsfrHeaders(context);
		await use(context);
	},
	catalogPage: async ({ page }, use) => {
		await page.goto("/");
		await expect(page.locator('text="OK-Notes"')).toBeVisible();

		const catalogPage = new CatalogPage(page);
		await use(catalogPage);
	},
	clearCart: async ({ context }, use) => {
		await clearCart(context);
		await use(context);
	},
});

export { expect } from "@playwright/test";
