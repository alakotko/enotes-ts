import { expect } from "@playwright/test";

import type { Page, Locator } from "@playwright/test";

export class CatalogPage {
	readonly page: Page;
	readonly productItems: Locator;
	readonly cartIcon: Locator;
	readonly cartItemCount: Locator;
	readonly cartDropdown: Locator;
	readonly cartDropdownItems: Locator;
	readonly cartDropdownTotalPrice: Locator;
	readonly goToCartButton: Locator;
	readonly discountedProductLocator: Locator;

	constructor(page: Page) {
		this.page = page;

		this.productItems = page.locator(".note-item");
		this.discountedProductLocator = page.locator(".note-item.hasDiscount");
		this.cartIcon = page.locator("#dropdownBasket");
		this.cartItemCount = page.locator(".basket-count-items");
		this.cartDropdown = page.locator("#basketContainer .dropdown-menu");
		this.cartDropdownItems = this.cartDropdown.locator(".basket-item");
		this.cartDropdownTotalPrice = page.locator(".basket_price");
		this.goToCartButton = page.locator("text=Перейти в корзину");
	}

	async addProductToCart(productName: string, quantity = 1) {
		const product = this.productItems.filter({ hasText: productName }).first();
		await this.addToCart(product, quantity);
	}

	async addDiscountedProductToCart(quantity = 1) {
		const product = this.discountedProductLocator.first();
		await this.addToCart(product, quantity);
	}

	async addNonDiscountedProductToCart(quantity = 1) {
		const products = this.productItems.filter({
			hasNot: this.discountedProductLocator,
		});

		const productsCount = await products.count();
		if (productsCount === 0) {
			throw new Error("No non-discounted products found");
		}

		for (let i = 0; i < quantity; i++) {
			const randomIndex = Math.floor(Math.random() * productsCount);
			const product = products.nth(randomIndex);
			await this.addToCart(product, 1);
		}
	}

	async addMultipleProductsToCart(productNames: string[]) {
		for (const productName of productNames) {
			await this.addProductToCart(productName);
		}
	}

	async expectCartItemCount(expectedCount: number) {
		await expect(this.cartItemCount).toHaveText(expectedCount.toString());
	}

	async openCartDropdown() {
		await this.cartIcon.click();
	}

	async expectCartDropdownIsVisible() {
		await expect(this.cartDropdown).toBeVisible();
	}

	async expectCartDropdownItemsCount(expectedCount: number) {
		await expect(this.cartDropdownItems).toHaveCount(expectedCount);
	}

	async expectCartTotalPriceIsNotZero() {
		await expect(this.cartDropdownTotalPrice).not.toHaveText("0");
	}

	async getCartDropdownItemsCount(): Promise<number> {
		return await this.cartDropdownItems.count();
	}

	async getCartTotalPrice(): Promise<string> {
		return await this.cartDropdownTotalPrice.innerText();
	}

	async goToCartPage() {
		await this.goToCartButton.click();
		await expect(this.page).toHaveURL(/.*cart/);
	}

	private async addToCart(product: Locator, quantity: number) {
		const addToCartButton = product.locator(".actionBuyProduct");
		const quantityInput = product.locator('[name="product-enter-count"]');

		await quantityInput.fill(quantity.toString());
		await addToCartButton.click();
	}
}
