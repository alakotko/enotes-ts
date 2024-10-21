import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
	testDir: "./tests",
	timeout: 60000,
	expect: {
		timeout: 5 * 1000,
	},
	use: {
		baseURL: "https://enotes.pointschool.ru",
		headless: true,
		viewport: { width: 1280, height: 720 },
		ignoreHTTPSErrors: true,
		screenshot: "only-on-failure",
		video: "retain-on-failure",
	},
	projects: [
		{
			name: "Chromium",
			use: { browserName: "chromium" },
		},
	],
};

export default config;
