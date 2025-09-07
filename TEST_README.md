# Testing Documentation - brever.link

This project uses **Vitest** as the main testing framework, following best practices for testing Astro applications with React.

## 📊 General Status

**Current status:** ✅ 213 tests passing across 14 test files

The project maintains complete test coverage including React components, business services, schema validation, middleware, and utility functions.

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
├── middleware.test.ts  # Route middleware tests
├── setup.ts           # Global configuration
├── utils.tsx          # Testing utilities
└── __mocks__/         # Astro dependency mocks
```

### Testing Categories

#### 🧩 [React Components](./test/components/)

Complete coverage of the user interface including:

- Rendering and props
- User interactions
- Form validation
- Accessibility (ARIA, keyboard navigation)
- Edge cases and error handling

#### 🔧 [Business Services](./test/services/)

Testing of the main application logic:

- CRUD operations for links
- URL shortening logic
- Pagination and filtering
- Error handling and edge cases

#### 📊 [Schema Validation](./test/schemas/)

Complete testing of Zod validation:

- Form validation
- Server action validation
- Filtering schemas
- Valid and invalid cases

#### ⚙️ [Utility Functions](./test/helpers/)

Testing of helpers and support functions:

- CSS class manipulation
- Domain extraction
- Date formatting
- Auxiliary functions

#### 🔗 [Middleware](./test/middleware.test.ts)

Testing of routing middleware:

- URL slug extraction
- Link redirection
- Click counter increment
- Handling of malformed URLs

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

## 🔧 Integration with Development

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

- **React Components:** 48% (102 tests)
- **Middleware:** 11% (24 tests)
- **Schemas:** 13% (27 tests)
- **Services:** 11% (24 tests)
- **Utilities:** 8% (18 tests)
- **Infrastructure:** 9% (18 tests)

### Quality Objectives

- ✅ **Coverage:** Maintain >80% in all metrics
- ✅ **Performance:** Tests running in <20 seconds
- ✅ **Stability:** 100% passing tests in main branch
- ✅ **Maintainability:** Clear and documented structure

---

**Last updated:** September 2025  
**Maintained by:** BRé [breimerct@gmail.com](mailto:breimerct@gmail.com)
