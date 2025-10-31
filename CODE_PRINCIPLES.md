# Code Principles

This document outlines the coding standards and principles for this project.

## Core Principles

### 1. Write for Maintainability
- Code should be easy to understand, modify, and extend
- Prioritize code that other developers can quickly comprehend
- Think about the developer who will maintain this code in 6 months

### 2. Clarity Over Brevity
- Clear, explicit code is better than clever, concise code
- Avoid abbreviations unless they are universally understood
- Write code that reads like prose when possible

### 3. Explicit, Domain-Specific, Self-Explanatory Names
- **Never use single-letter or generic identifiers**
- Use domain-specific names that explain the purpose and context
- Examples:
  - ✅ `childName`, `childGrade` instead of ❌ `name`, `grade`
  - ✅ `taskSubject`, `taskDescription` instead of ❌ `subject`, `description`
  - ✅ `taskDueDate` instead of ❌ `dueDate`
- Variable names should be self-documenting

### 4. Guard Clauses and Early Returns (No Else)
- Use guard clauses to handle edge cases first
- Return early to reduce nesting
- Avoid `else` statements when possible
- Example:
  ```typescript
  // ✅ Good
  if (!isValid) {
    return null;
  }

  processData();

  // ❌ Bad
  if (isValid) {
    processData();
  } else {
    return null;
  }
  ```

### 5. Positive Conditions
- Prefer positive boolean conditions over negative ones
- Use `isValid`, `hasPermission`, `shouldRender` instead of `isInvalid`, `lacksPermission`, `shouldNotRender`
- Makes code easier to reason about

### 6. No Magic Indexes or Numbers
- Never use array indexes directly without explanation
- Extract magic numbers to named constants
- Example:
  ```typescript
  // ✅ Good
  const FIRST_CHILD_INDEX = 0;
  const firstChild = children[FIRST_CHILD_INDEX];

  // ❌ Bad
  const firstChild = children[0];
  ```

### 7. Comments Explain "Why", Not "What"
- Code should be self-explanatory for "what" it does
- Comments should explain business logic, trade-offs, or non-obvious decisions
- Use `// Why:` prefix for rationale comments
- Example:
  ```typescript
  // Why: Try-catch because localStorage.getItem can throw in incognito/restricted modes
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    return createEmptyAppData();
  }
  ```

### 8. Separation of Structure and Behavior
- Keep data models separate from business logic
- Keep business logic separate from UI components
- Use clear layer boundaries (Core → Storage → Hooks → UI)

### 9. Flat Control Flow
- Minimize nesting depth
- Use early returns and guard clauses
- Extract complex conditions into named variables or functions
- Keep indentation levels shallow (max 2-3 levels when possible)

### 10. Always Use Semicolons
- **All statements must end with semicolons (`;`)**
- Ensures consistent code style across the project
- Prevents potential ASI (Automatic Semicolon Insertion) issues
- Use Prettier with `"semi": true` for automatic formatting
- Example:
  ```typescript
  // ✅ Good
  const childName = 'Ahmet';
  const childGrade = 3;
  return newChild;

  // ❌ Bad
  const childName = 'Ahmet'
  const childGrade = 3
  return newChild
  ```

## Architecture Layers

### Core Layer
- Domain models (Child, Task, Settings)
- Pure TypeScript, zero dependencies
- Business logic and validation
- Completely UI-agnostic

### Storage Layer
- localStorage abstraction
- Data persistence
- CRUD operations
- Storage event handling

### Hook Layer
- React hooks for state management
- Bridge between Storage and UI
- Reactive data access
- Multi-tab synchronization

### UI Layer
- React components
- Presentation logic only
- No direct storage access
- Consumes hooks for data

## Code Formatting

- Use Prettier for consistent formatting
- Configuration:
  - `semi: true` (semicolons required)
  - `singleQuote: true` (prefer single quotes)
  - `trailingComma: none` (no trailing commas)
  - `tabWidth: 2` (2 spaces for indentation)
  - `printWidth: 100` (max 100 characters per line)

## TypeScript

- Use strict mode
- Explicit return types for functions
- Prefer `type` over `interface` for simple shapes
- Use `interface` for objects that may be extended

## File Naming

- Use kebab-case for file names: `add-child-modal.tsx`
- Use PascalCase for component files: `AddChildModal.tsx`
- Use camelCase for non-component files: `useChildren.ts`, `repository.ts`

---

**Remember:** These principles exist to make our codebase more maintainable, readable, and consistent. When in doubt, choose clarity over cleverness.
