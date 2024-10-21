import type { BasketResponse, ProductsResponse, Product } from "./types";
import type {
	APIRequestContext,
	APIResponse,
	BrowserContext,
} from "@playwright/test";

export async function addCsfrHeaders(
	context: BrowserContext,
): Promise<BrowserContext> {
	const formCsrf = await getCsrfTokenFromMainPage(context.request);

	context.setExtraHTTPHeaders({
		"x-csrf-token": formCsrf,
		"X-Requested-With": "XMLHttpRequest",
	});

	return context;
}

export async function loginPost(
	request: APIRequestContext,
	username: string,
	password: string,
): Promise<APIRequestContext> {
	const formCsrf = await getCsrfTokenFromLogin(request);
	const response = await request.post("/login", {
		form: {
			_csrf: formCsrf,
			"LoginForm[username]": username,
			"LoginForm[password]": password,
			"LoginForm[rememberMe]": "1",
			"login-button": "",
		},
	});

	if (!response.ok() && response.status() !== 302) {
		throw new Error(`Login failed with status ${response.status()}`);
	}

	return request;
}

export async function loginGet(
	request: APIRequestContext,
): Promise<APIResponse> {
	const response = await request.get("/login");

	if (!response.ok()) {
		throw new Error(`Failed to get login page: ${response.status()}`);
	}

	return response;
}

export async function clearCart(
	context: BrowserContext,
): Promise<APIResponse | undefined> {
	const { basketCount } = await getBasketGet(context);
	if (basketCount === 0) {
		return;
	}

	const response = await context.request.post("/basket/clear");

	if (!response.ok()) {
		const body = await response.body();
		throw new Error(`Failed to clear cart: ${response.status()}\n\n${body}`);
	}

	const { basketCount: basketCountAfterClear } = await getBasketGet(context);
	if (basketCountAfterClear !== 0) {
		throw new Error("Cart was not emptied successfully");
	}

	return response;
}

export async function getBasketGet(
	context: BrowserContext,
): Promise<BasketResponse> {
	const response = await context.request.get("/basket/get");

	const body = await response.body();
	if (!response.ok()) {
		throw new Error(`Failed to get basket: ${response.status()}\n${body}`);
	}

	const cartData = await response.json();
	return cartData;
}

export async function getCsrfTokenFromLogin(
	request: APIRequestContext,
): Promise<string> {
	const loginResponse = await loginGet(request);
	const formCsrf = await getCsrfToken(loginResponse);

	return formCsrf;
}

export async function getCsrfTokenFromMainPage(
	request: APIRequestContext,
): Promise<string> {
	const mainPageResponse = await mainPageGet(request);
	const formCsrf = await getCsrfToken(mainPageResponse);

	return formCsrf;
}

async function mainPageGet(request: APIRequestContext): Promise<APIResponse> {
	const response = await request.get("/");

	return response;
}

export async function getProducts(
	context: BrowserContext,
	page = 1,
): Promise<ProductsResponse> {
	const response = await context.request.post("/product/get", {
		form: {
			filters: "search=&price-from=&price-to=",
			action: "",
			page,
		},
	});

	if (!response.ok()) {
		throw new Error(`Failed to get products: ${response.status()}`);
	}

	return (await response.json()) as ProductsResponse;
}

export async function getAllProducts(
	context: BrowserContext,
): Promise<Product[]> {
	const page1Response = await getProducts(context, 1);
	const page2Response = await getProducts(context, 2);

	const combinedProducts = [
		...page1Response.products,
		...page2Response.products,
	];

	return combinedProducts;
}

export async function addProductToCart(
	context: BrowserContext,
	product: Product,
	quantity = 1,
): Promise<APIResponse> {
	if (quantity > product.count) {
		throw new Error(
			`Requested quantity (${quantity}) exceeds available stock (${product.count}) for product ${product.name}`,
		);
	}

	const response = await context.request.post("/basket/create", {
		form: {
			product: product.id.toString(),
			count: quantity.toString(),
		},
	});

	if (!response.ok()) {
		const body = await response.text();
		let errorMessage = `Failed to add product "${product.name}" to cart: ${response.status()}`;

		try {
			const errorJson = JSON.parse(body);
			errorMessage += `\nError: ${errorJson.name}\nMessage: ${errorJson.message}`;
		} catch (e) {
			errorMessage += `\nResponse body: ${body}`;
		}

		console.error(errorMessage);
		throw new Error(errorMessage);
	}

	return response;
}

async function getCsrfToken(response: APIResponse): Promise<string> {
	const html = await response.text();

	const csrfMatch = html.match(/<meta name="csrf-token" content="([^"]+)">/);
	if (!csrfMatch) {
		throw new Error("CSRF token not found in the login page HTML");
	}

	return csrfMatch[1];
}
