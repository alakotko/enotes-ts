# enotes-ts

enotes-ts is a TypeScript-based project for testing an e-commerce application called OK-Notes. It uses Playwright for end-to-end and API testing.

## Prerequisites

- [Bun](https://bun.sh) v1.1.3 or later
- Node.js and npm (for running Playwright tests)

## Installation

To install the project dependencies, run:
```bash
bun install
```

## Testing

This project uses Playwright for testing. There are several test commands available:

```bash
# Run all tests
bun test

# Run end-to-end tests
bun test:e2e

# Run API tests
bun test:api
```

## Project Structure

- `src/`: Contains the main source code (not visible in the provided snippets)
- `tests/`: Contains test files
  - `e2e/`: End-to-end tests
  - `api/`: API tests
  - `fixtures.ts`: Custom test fixtures
- `lib/`: Contains utility functions and Page Object Models
  - `api/`: API-related utilities
  - `pom/`: Page Object Models for UI testing
- `playwright.config.ts`: Playwright configuration file

## Key Features

1. **API Testing**: The project includes API tests for various scenarios, such as adding products to the cart and verifying cart contents.

2. **End-to-End Testing**: UI tests are implemented using Playwright and Page Object Models.

3. **Custom Fixtures**: The project uses custom fixtures to set up test environments, including login, cart clearing, and CSRF token handling.

4. **Page Object Model**: The `CatalogPage` class encapsulates the functionality of the catalog page, making it easier to write and maintain tests.

5. **TypeScript**: The project is written in TypeScript, providing type safety and better developer experience.

## Configuration

The project uses the following configuration files:

- `tsconfig.json`: TypeScript configuration
- `playwright.config.ts`: Playwright test runner configuration

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Submit a pull request

Please ensure that your code follows the existing style and that all tests pass before submitting a pull request.

## License