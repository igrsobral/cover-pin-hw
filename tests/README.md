# Playwright E2E Tests

This directory contains end-to-end tests for the Mini Seller Console application using Playwright.

## Structure

```
tests/
├── e2e/                    # End-to-end test suites
│   ├── leads/             # Lead management tests
│   ├── opportunities/     # Opportunity tests
│   ├── persistence/       # localStorage tests
│   ├── responsive/        # Responsive design tests
│   └── performance/       # Performance tests
├── fixtures/              # Test data and utilities
│   ├── test-data.ts      # Mock lead and opportunity data
│   └── page-objects/     # Page object models
├── utils/                # Test utilities
│   ├── test-helpers.ts   # Common test functions
│   └── mock-api.ts       # API simulation helpers
└── setup.ts              # Test setup and configuration
```

## Running Tests

```bash
# Run all tests
pnpm test:e2e

# Run tests with UI
pnpm test:e2e:ui

# Run tests in headed mode
pnpm test:e2e:headed

# Debug tests
pnpm test:e2e:debug
```

## Configuration

Tests are configured in `playwright.config.ts` with:
- Multi-browser support (Chrome, Firefox, Safari)
- Multiple viewport configurations (Desktop, Mobile, Tablet)
- Automatic dev server startup
- Screenshot and video capture on failures
- HTML reporting

## Page Object Model

Tests use the Page Object Model pattern for maintainable test code:
- `BasePageObject`: Common functionality shared across page objects
- Feature-specific page objects for leads, opportunities, etc.
- Centralized selectors and interaction methods