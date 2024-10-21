import type { BrowserContext } from "@playwright/test";
import type { CatalogPage } from "../lib/pom/CatalogPage";

export interface UserCredentials {
	username: string;
	password: string;
}

export interface AuthResponse {
	token: string;
}

export type MyFixtures = {
	catalogPage: CatalogPage;
	login: BrowserContext;
	clearCart: BrowserContext;
	setCsfrToken: BrowserContext;
};
