import { test, expect } from "../fixtures";
import {
	getBasketGet,
	addProductToCart,
	getProducts,
	getAllProducts,
} from "../../lib/api";

test.describe("API", () => {
	test("Scenario 1: Add 9 discounted items to cart", async ({
		login,
		setCsfrToken,
		clearCart,
		context,
	}) => {
		const productsData = await getProducts(context);
		const discountedProduct = productsData.products.find((p) => p.discount > 0);

		if (!discountedProduct || discountedProduct.count <= 0) {
			throw new Error("No valid discounted product found.");
		}

		await addProductToCart(context, discountedProduct, 9);

		const cartData = await getBasketGet(context);

		expect(cartData.basketCount).toBe(9);
		expect(cartData.basket).toHaveLength(1);
		expect(cartData.basket[0].count).toBe(9);
		expect(cartData.basketPrice).toBeGreaterThan(0);
	});

	test("Scenario 2: Add 8 different items to cart with 1 promotional item", async ({
		login,
		setCsfrToken,
		clearCart,
		context,
	}) => {
		const productsData = await getAllProducts(context);
		const discountedProduct = productsData.find((p) => p.discount > 0);
		if (!discountedProduct || discountedProduct.count <= 0) {
			throw new Error("No valid discounted product found.");
		}
		await addProductToCart(context, discountedProduct, 1);

		const addedProducts = new Set<number>();
		for (const product of productsData) {
			if (addedProducts.size >= 8) break;
			if (
				product.id !== discountedProduct.id &&
				!addedProducts.has(product.id)
			) {
				await addProductToCart(context, product, 1);
				addedProducts.add(product.id);
			}
		}

		expect(addedProducts.size).toBe(8);

		const cartData = await getBasketGet(context);

		expect(cartData.basketCount).toBe(9);
		expect(cartData.basket).toHaveLength(9);
		expect(cartData.basketPrice).toBeGreaterThan(0);
	});

	test("Scenario 3: Add 1 discounted item to cart and verify via API", async ({
		login,
		setCsfrToken,
		clearCart,
		context,
	}) => {
		const productsData = await getProducts(context);
		const discountedProduct = productsData.products.find((p) => p.discount > 0);

		if (!discountedProduct || discountedProduct.count <= 0) {
			throw new Error("No valid discounted product found.");
		}

		await addProductToCart(context, discountedProduct, 1);

		const cartData = await getBasketGet(context);

		expect(cartData.basketCount).toBe(1);
		expect(cartData.basket).toHaveLength(1);
		expect(cartData.basket[0].count).toBe(1);
		expect(cartData.basket[0].id).toBe(discountedProduct.id);
		expect(cartData.basket[0].name).toBe(discountedProduct.name);
		const price = discountedProduct.price - discountedProduct.discount;
		expect(cartData.basket[0].price).toBe(price);
		expect(cartData.basket[0].discount).toBe(discountedProduct.discount);
		expect(cartData.basketPrice).toBeGreaterThan(0);
	});

	test("Scenario 4: Add 1 non-discounted item to cart and verify via API", async ({
		login,
		setCsfrToken,
		clearCart,
		context,
	}) => {
		const productsData = await getProducts(context);
		const nonDiscountedProduct = productsData.products.find(
			(p) => p.discount === 0,
		);

		if (!nonDiscountedProduct || nonDiscountedProduct.count <= 0) {
			throw new Error("No valid non-discounted product found.");
		}

		await addProductToCart(context, nonDiscountedProduct, 1);

		const cartData = await getBasketGet(context);

		expect(cartData.basketCount).toBe(1);
		expect(cartData.basket).toHaveLength(1);
		expect(cartData.basket[0].count).toBe(1);
		expect(cartData.basket[0].id).toBe(nonDiscountedProduct.id);
		expect(cartData.basket[0].name).toBe(nonDiscountedProduct.name);
		expect(cartData.basket[0].price).toBe(nonDiscountedProduct.price);
		expect(cartData.basket[0].discount).toBe(0);
		expect(cartData.basketPrice).toBeGreaterThan(0);
	});
});
