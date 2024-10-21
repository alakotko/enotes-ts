export type BasketItem = {
	id: number;
	name: string;
	price: number;
	count: number;
	poster: string;
	discount: number;
};

export type BasketResponse = {
	response: boolean;
	basket: BasketItem[];
	basketCount: number;
	basketPrice: number;
};

export type Product = {
	id: number;
	name: string;
	type: string;
	price: number;
	discount: number;
	count: number;
	poster: string;
};

export type ProductsResponse = {
	response: boolean;
	error: string;
	products: Product[];
	page: number;
	pages: number;
};
