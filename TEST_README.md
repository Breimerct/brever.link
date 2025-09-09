# Testing Documentation - brever.link

This project uses **Vitest** as the main testing framework, following best practices for testing Astro applications with React.

## 📊 General Status

**Current status:** ✅ 261 tests passing across 15 test files

The project maintains complete test coverage including React components, business services, schema validation, middleware, URL validation, and utility functions.

## 🚀 Testing Environment Configuration

### Main Framework

- **[Vitest](https://vitest.dev/)** - Modern and fast testing framework
- **[Testing Library](https://testing-library.com/)** - Utilities for testing React components
- **[jsdom](https://github.com/jsdom/jsdom)** - Simulated DOM environment for testing

### Additional Tools

- **[@vitest/ui](https://vitest.dev/guide/ui.html)** - Interactive web interface for running tests
- **[@vitest/coverage-v8](https://vitest.dev/guide/coverage.html)** - Coverage report generation
- **[@testing-library/user-event](https://testing-library.com/docs/user-event/intro/)** - Advanced simulation of user interactions

### Mock Configuration

The project includes automated mocks for the main Astro dependencies:

- **astro:db** - Complete mock of database operations
- **astro:actions** - Mock of ActionError and action context
- **astro:transitions/client** - Mock of client-side navigation
- **External libraries** - QR Code generation, Sonner toasts, etc.

## 📁 Testing Structure

### File Organization

The project uses a flat structure in the `/test` directory to facilitate navigation:

```
test/
├── components/          # React component tests
├── services/           # Business logic tests
├── schemas/            # Zod validation tests
├── helpers/            # Utility function tests
│   ├── utils.test.ts       # General utilities (CSS, dates, domains)
│   └── validate-url.test.ts # URL validation with security checks
├── middleware.test.ts  # Route middleware tests
├── setup.ts           # Global configuration
├── utils.tsx          # Testing utilities
└── __mocks__/         # Astro dependency mocks
```

### Testing Categories

#### 🧩 [React Components](./test/components/)

Complete coverage of the user interface including:

- **Form Components**: ShortLinkForm (22 tests), FilterLinks (27 tests), Input (24 tests)
- **Display Components**: LinkCard (25 tests), LinkList (20 tests), Button (9 tests), Toaster (5 tests)
- **Rendering and props**: Basic rendering, custom props, conditional rendering
- **User interactions**: Form submission, input handling, button clicks, copy functionality
- **Form validation**: Real-time validation, error display, field validation
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Edge cases and error handling**: Boundary conditions, error states

#### 🔧 [Business Services](./test/services/)

Testing of the main application logic:

- **Link Service** (20 tests): CRUD operations, pagination, validation, error handling
- **Shorten Service** (7 tests): URL shortening logic, duplicate checking, QR generation
- Database interaction mocking and error scenarios
- Pagination and filtering functionality
- Edge cases and data validation

#### 📊 [Schema Validation](./test/schemas/)

Complete testing of Zod validation schemas:

- **Short Link Action Schema** (13 tests): Server action validation
- **Short Link Form Schema** (9 tests): Client form validation with enhanced slug validation
- **Filter Links Schema** (7 tests): Search and filter validation
- Valid and invalid input cases
- Type safety and error messages
- Edge cases and boundary conditions

#### ⚙️ [Utility Functions](./test/helpers/)

Testing of helpers and support functions:

- **Utils Functions** (18 tests): CSS classes, domain extraction, date formatting
- **URL Validation** (29 tests): Comprehensive URL validation with security checks
  - HTTPS protocol enforcement
  - Private IP and localhost blocking
  - Port validation and security
  - International domain support
  - Malformed URL handling
- Input sanitization and edge cases

#### 🔗 [Middleware](./test/middleware.test.ts)

Testing of routing middleware (26 tests):

- URL slug extraction and parsing
- Link redirection and click counting
- Error handling for missing links
- URL encoding and special characters
- HTTP method handling (GET, POST, HEAD)
- Malformed URL graceful handling

## 📝 Available Commands

### Running Tests

```bash
# Run tests in watch mode (development)
pnpm test

# Run all tests once
pnpm test:run

# Run tests with coverage report
pnpm test:coverage

# Open Vitest web interface
pnpm test:ui

# Run tests in explicit watch mode
pnpm test:watch
```

### Useful Commands for Development

```bash
# Run specific test
pnpm test file-name

# Run with more debug information
pnpm test --reporter=verbose

# Run without coverage (faster in development)
pnpm test --no-coverage
```

## 🎯 Coverage Configuration

### Established Thresholds

The project maintains coverage thresholds of **80%** in:

- Lines of code (lines)
- Functions (functions)
- Branches (branches)
- Statements (statements)

### Excluded Files

The configuration automatically excludes:

- Configuration and build files
- Test files (`.test.ts`, `.test.tsx`)
- Type definitions (`.d.ts`)
- Database seed files
- `coverage/` directory

### Generated Reports

Coverage reports are generated in:

- **Terminal:** Immediate visual summary
- **HTML:** Detailed report in `./coverage/index.html`
- **LCOV:** For integration with CI/CD tools

## 🛠 Technical Configuration

### Main Configuration File

- **[vitest.config.ts](./vitest.config.ts)** - Main configuration using Astro's `getViteConfig()`

### Testing Configuration

- **[test/setup.ts](./test/setup.ts)** - Global setup for Jest-DOM and mocks
- **[test/utils.tsx](./test/utils.tsx)** - Custom testing utilities
- **[test/vitest-setup.d.ts](./test/vitest-setup.d.ts)** - Type definitions

### Astro Mocks

- **[test/**mocks**/astro-db.mock.ts](./test/**mocks**/astro-db.mock.ts)** - Mock of database operations
- **[test/**mocks**/astro-actions.mock.ts](./test/**mocks**/astro-actions.mock.ts)** - Mock of server actions

## 📋 Patterns and Best Practices

### Recommended Test Structure

Each test file follows a consistent structure:

1. **Rendering** - Basic rendering tests
2. **User Interactions** - User interaction tests
3. **Business Logic** - Specific logic tests
4. **Accessibility** - Accessibility tests
5. **Edge Cases** - Boundary case tests
6. **Error Handling** - Error handling tests

### Nomenclature

- Test files: `ComponentName.test.tsx` or `serviceName.test.ts`
- Describe blocks: Descriptive names of the component or functionality
- Test cases: Clear descriptions of what is being tested

### Cleanup and Setup

- Consistent use of `beforeEach()` to clear mocks
- Setup of user events with `userEvent.setup()`
- Proper handling of asynchronous operations with `waitFor()`

## � URL Validation Testing

### Security-First Approach

The URL validation system (`src/helpers/validate-url.ts`) implements comprehensive security checks tested through 29 dedicated tests:

#### Valid URL Requirements

- **HTTPS Only**: Only HTTPS protocol is accepted for security
- **Real Domains**: Public, accessible domain names only
- **Standard Ports**: Port 443 or default (no custom ports allowed)
- **International Support**: Punycode and international domains supported

#### Security Restrictions

- **No Local URLs**: Blocks localhost, 127.0.0.1, \*.local domains
- **No Private IPs**: Prevents private network access (10.x.x.x, 192.168.x.x, etc.)
- **No Example Domains**: Rejects example.com, test.com, and similar
- **Input Sanitization**: Validates input types and handles edge cases

#### Test Coverage

```typescript
✓ Valid URLs (5 tests)          - HTTPS, paths, query params, normalization
✓ Invalid Protocol (3 tests)    - HTTP, FTP, other protocols rejected
✓ Invalid Hostnames (5 tests)   - Local, private, example domains blocked
✓ Invalid Ports (3 tests)       - Custom ports rejected, 443 allowed
✓ Private IP Addresses (1 test) - All private IP ranges blocked
✓ Invalid Input (5 tests)       - Type validation, empty strings
✓ Malformed URLs (3 tests)      - Structure validation
✓ Edge Cases (4 tests)          - International domains, long URLs, fragments
```

This validation ensures that only legitimate, public HTTPS URLs can be shortened, preventing potential security vulnerabilities and abuse.

### Recommended VS Code Extensions

- **[Vitest](https://marketplace.visualstudio.com/items?itemName=ZixuanChen.vitest-explorer)** - Run tests from the editor
- **[Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)** - Display errors inline
- **[Jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest)** - Syntax highlighting for tests

### Development Workflow

1. **Watch Mode:** Run `pnpm test` during development for immediate feedback
2. **UI Mode:** Use `pnpm test:ui` for visual test debugging
3. **Coverage:** Run `pnpm test:coverage` before important commits
4. **CI/CD:** Automatic tests in pipeline with `pnpm test:run`

## 🔍 Debugging and Troubleshooting

### Common Issues

#### Slow Tests

- Use `--no-coverage` during active development
- Run specific tests instead of the entire suite
- Verify there are no tests with excessive timeouts

#### Import Errors

- Astro mocks (`astro:db`, `astro:actions`) are configured automatically
- Verify that mocks are declared before imports
- Check path aliases in Vitest configuration

#### Mocks Not Working

- Ensure `vi.clearAllMocks()` is called in `beforeEach()`
- Verify that mocks are defined before importing modules
- Use `vi.mocked()` for correct typing of mocks

### Debug Commands

```bash
# View detailed information for a specific test
pnpm test --reporter=verbose test-name

# Run in debug mode
pnpm test --inspect-brk

# View only failing tests
pnpm test --reporter=verbose --run
```

## 📚 Resources and References

### Main Documentation

- **[Vitest Documentation](https://vitest.dev/)** - Testing framework
- **[Testing Library](https://testing-library.com/)** - Testing philosophy and APIs
- **[Astro Testing Guide](https://docs.astro.build/en/guides/testing/)** - Astro-specific testing

### Additional Resources

- **[Jest DOM Matchers](https://github.com/testing-library/jest-dom)** - Additional DOM matchers
- **[User Event API](https://testing-library.com/docs/user-event/intro/)** - User event simulation
- **[MSW (Mock Service Worker)](https://mswjs.io/)** - For API mocking (future)

## 📈 Metrics and Statistics

### Current Test Distribution

- **React Components:** 39% (128 tests) - UI components and user interactions
- **URL Validation:** 11% (29 tests) - Security-focused URL validation
- **Middleware:** 10% (26 tests) - Routing and redirection logic
- **Schemas:** 11% (29 tests) - Data validation and type safety
- **Services:** 11% (27 tests) - Business logic and database operations
- **Utilities:** 7% (18 tests) - Helper functions and tools

### Test Coverage by Category

- **Security**: URL validation with HTTPS enforcement, private IP blocking
- **User Experience**: Complete form workflows, accessibility, error handling
- **Business Logic**: Link creation, validation, pagination, click tracking
- **Data Integrity**: Schema validation, type safety, edge case handling
- **Performance**: Component optimization, debouncing, efficient rendering

### Detailed Coverage Metrics (Latest Report)

| File                           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| ------------------------------ | ------- | -------- | ------- | ------- | ----------------- |
| All files                      | 100     | 100      | 100     | 100     |                   |
| src                            | 100     | 100      | 100     | 100     |                   |
| middleware.ts                  | 100     | 100      | 100     | 100     |                   |
| src/components/button          | 100     | 100      | 100     | 100     |                   |
| Button.tsx                     | 100     | 100      | 100     | 100     |                   |
| src/components/filter-links    | 100     | 100      | 100     | 100     |                   |
| FilterLinks.tsx                | 100     | 100      | 100     | 100     |                   |
| src/components/input           | 100     | 100      | 100     | 100     |                   |
| Input.tsx                      | 100     | 100      | 100     | 100     |                   |
| src/components/link-card       | 100     | 100      | 100     | 100     |                   |
| LinkCard.tsx                   | 100     | 100      | 100     | 100     |                   |
| src/components/link-list       | 100     | 100      | 100     | 100     |                   |
| LinkList.tsx                   | 100     | 100      | 100     | 100     |                   |
| src/components/short-link-form | 100     | 100      | 100     | 100     |                   |
| ShortLinkForm.tsx              | 100     | 100      | 100     | 100     |                   |
| src/components/toaster         | 100     | 100      | 100     | 100     |                   |
| Toaster.tsx                    | 100     | 100      | 100     | 100     |                   |
| src/helpers                    | 100     | 100      | 100     | 100     |                   |
| utils.ts                       | 100     | 100      | 100     | 100     |                   |
| validate-url.ts                | 100     | 100      | 100     | 100     |                   |
| src/schemas                    | 100     | 100      | 100     | 100     |                   |
| filter-links.schema.ts         | 100     | 100      | 100     | 100     |                   |
| short-link-action.schema.ts    | 100     | 100      | 100     | 100     |                   |
| short-link-form.schema.ts      | 100     | 100      | 100     | 100     |                   |
| src/services                   | 100     | 100      | 100     | 100     |                   |
| link.service.ts                | 100     | 100      | 100     | 100     |                   |
| shorten.service.ts             | 100     | 100      | 100     | 100     |                   |

**Perfect Coverage:** The project has achieved 100% coverage across all metrics - statements, branches, functions, and lines. This represents an exceptional level of test quality and code reliability.

### Quality Objectives

- ✅ **Coverage:** Perfect 100% target achieved - **100% statements, 100% branches, 100% functions, 100% lines**
- ✅ **Performance:** Tests running in <20 seconds (16.93s test runtime)
- ✅ **Stability:** 100% passing tests in main branch (261/261 tests)
- ✅ **Maintainability:** Clear and documented structure
- ✅ **Security:** Comprehensive URL validation and input sanitization

---

**Last updated:** September 8, 2025  
**Maintained by:** BRé [breimerct@gmail.com](mailto:breimerct@gmail.com)

### Recent Updates

- ✅ **September 8, 2025**: All tests passing successfully - 261 tests across 15 test files
- ✅ **Perfect Coverage**: Achieved 100% coverage in all metrics - statements, branches, functions, and lines
- ✅ **Performance Optimized**: Test execution in 16.93s with comprehensive coverage reporting
- ✅ **Enhanced Coverage**: Updated middleware tests to 26 tests covering additional edge cases
- ✅ **Service Layer**: Updated shorten service to 7 tests with improved error handling
- ✅ **Enhanced LinkCard**: Added 5 new QR download functionality tests (25 total)
- ✅ **CI/CD Ready**: HTML test reports generated automatically for better visibility
- ✅ **Zero Regressions**: All 261 tests passing with no breaking changes

---

## 📈 Executive Summary

The **brever.link** project maintains **exceptional test quality** with:

- **261 tests** passing across **15 test files**
- **100% code coverage** (statements) - perfect industry standard
- **100% branch coverage** - perfect conditional logic testing
- **100% function coverage** - all functions tested
- **Sub-20 second** test execution time - optimal for development workflow

### Key Strengths

1. **Security-First Testing**: 29 dedicated URL validation tests preventing malicious input
2. **Comprehensive UI Coverage**: 128 React component tests covering all user interactions
3. **Business Logic Validation**: Complete service layer testing with error scenarios
4. **Accessibility Compliance**: Dedicated tests ensuring WCAG compliance
5. **Performance Monitoring**: Tests designed to catch performance regressions

This testing strategy ensures a **robust, secure, and maintainable** codebase with confidence in every deployment.
