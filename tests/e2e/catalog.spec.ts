import { test, expect } from "../fixtures";

test.describe("Catalog Page Tests", () => {
	test("Scenario 1: Add 9 discounted items to cart", async ({
		login,
		clearCart,
		catalogPage,
	}) => {
		await catalogPage.addDiscountedProductToCart(10);

		await catalogPage.expectCartItemCount(10);

		await catalogPage.openCartDropdown();

		await catalogPage.expectCartDropdownIsVisible();
		await catalogPage.expectCartDropdownItemsCount(1);
		await catalogPage.expectCartTotalPriceIsNotZero();

		await catalogPage.goToCartPage();
	});

	test("Scenario 2: Add 8 different items to cart with 1 promotional item", async ({
		login,
		clearCart,
		catalogPage,
	}) => {
		await catalogPage.addDiscountedProductToCart(1);
		await catalogPage.addNonDiscountedProductToCart(9);

		await catalogPage.expectCartItemCount(10);

		await catalogPage.openCartDropdown();

		await catalogPage.expectCartDropdownItemsCount(9);
		await catalogPage.expectCartTotalPriceIsNotZero();

		await catalogPage.goToCartPage();
	});

	test("Scenario 3: Add 1 discounted item to cart", async ({
		login,
		clearCart,
		catalogPage,
	}) => {
		await catalogPage.addDiscountedProductToCart(1);

		await catalogPage.expectCartItemCount(1);

		await catalogPage.openCartDropdown();

		await catalogPage.expectCartDropdownIsVisible();
		await catalogPage.expectCartDropdownItemsCount(1);
		await catalogPage.expectCartTotalPriceIsNotZero();

		await catalogPage.goToCartPage();
	});

	test("Scenario 4: Add 1 non-discounted item to cart", async ({
		login,
		clearCart,
		catalogPage,
	}) => {
		await catalogPage.addNonDiscountedProductToCart(1);

		await catalogPage.expectCartItemCount(1);

		await catalogPage.openCartDropdown();

		await catalogPage.expectCartDropdownIsVisible();
		await catalogPage.expectCartDropdownItemsCount(1);
		await catalogPage.expectCartTotalPriceIsNotZero();

		await catalogPage.goToCartPage();
	});
});
