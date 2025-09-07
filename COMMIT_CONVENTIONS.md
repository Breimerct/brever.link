# Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to maintain a clean and consistent commit history.

## Commit Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Allowed Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Formatting changes (spaces, semicolons, etc.)
- **refactor**: Code refactoring without changing functionality
- **perf**: Performance improvements
- **test**: Adding or fixing tests
- **chore**: Changes to build tools or dependencies
- **ci**: Changes to CI/CD configuration
- **build**: Changes to the build system or external dependencies
- **revert**: Revert previous commits

## Valid Examples

```bash
feat: add user authentication
fix: resolve login issue with special characters
docs: update installation guide
style: format code with prettier
refactor: extract utility functions
test: add unit tests for user service
chore: update dependencies
ci: add automated testing workflow
```

## Examples with Scope

```bash
feat(auth): add login functionality
fix(ui): resolve button alignment issue
docs(api): update endpoint documentation
```

## Validation Rules

- The type must be lowercase
- The subject should not end with a period
- The header should not exceed 72 characters
- The body and footer should not exceed 100 characters per line
- There must be a blank line between the header and the body
- There must be a blank line between the body and the footer

## Configured Hooks

### Pre-commit

- Checks code formatting with Prettier
- Runs linting with ESLint
- Runs all tests

### Commit-msg

- Validates that the commit message follows the conventions

## Useful Commands

```bash
# Check formatting before commit
pnpm lint:check

# Fix formatting automatically
pnpm lint

# Run linting
pnpm lint:eslint

# Run tests
pnpm test:run
```
