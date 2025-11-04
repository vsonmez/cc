# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a homework tracking Progressive Web App (PWA) built with React, TypeScript, Vite, and Firebase. It helps parents manage their children's homework assignments with support for push notifications. The app follows a strict layered architecture with domain-driven design principles.

## Development Commands

### Build & Development
```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript build + Vite production build
npm run preview      # Preview production build locally
npm run lint         # Run ESLint on all files
```

### Firebase Cloud Functions
```bash
cd functions
npm install          # Install function dependencies
npm run build        # Build TypeScript functions
cd ..
firebase deploy --only functions        # Deploy functions to Firebase
firebase deploy --only firestore:rules  # Deploy Firestore security rules
firebase functions:log                  # View function logs
```

### Testing Functions Locally
```bash
cd functions
npm run serve        # Start Firebase emulators for testing
```

## Architecture

### Layered Architecture (Strict Separation)

The codebase follows a **strict 4-layer architecture** where each layer only communicates with the layer directly below it:

```
UI Layer (React Components)
    ↓
Hook Layer (React Hooks)
    ↓
Storage Layer (Repositories)
    ↓
Core Layer (Domain Models & Business Logic)
```

**Layer Responsibilities:**

1. **Core Layer** (`src/core/models/`, `src/core/services/`)
   - Domain models: `Child`, `Task`, `Settings`, `AppData`
   - Pure TypeScript, zero dependencies (no React, no localStorage)
   - Business logic and validation functions
   - Completely UI-agnostic

2. **Storage Layer** (`src/core/storage/`)
   - localStorage abstraction via `storage-engine.ts`
   - Repository pattern: `childRepository.ts`, `taskRepository.ts`, `settingsRepository.ts`
   - CRUD operations for each domain model
   - Storage event handling for multi-tab synchronization

3. **Hook Layer** (`src/ui/hooks/`)
   - React hooks: `useChildren`, `useTasks`, `useSettings`, `useAppData`
   - Bridge between Storage and UI
   - Reactive data access with automatic re-rendering
   - Manages multi-tab synchronization via storage events

4. **UI Layer** (`src/features/`, `src/ui/components/`)
   - React components organized by feature
   - Presentation logic only
   - NO direct storage access (must use hooks)
   - Consumes hooks for all data operations

### Feature Organization

Features are organized in `src/features/`:
- `onboarding/` - Initial setup flow for adding first child
- `settings/` - Child management, notification settings, confirm dialogs
- `tasks/` - Task creation, editing, listing, completion, confirm dialogs

Shared UI components live in `src/ui/components/`:
- Form components: `Button`, `Input`, `Textarea`, `Select`, `Checkbox`
- Layout components: `Modal`, `ConfirmDialog`
- Feature components: `InstallPrompt`

### Data Flow Example

```typescript
// ❌ NEVER do this in a component:
import { addChild } from '../../core/storage/childRepository';

// ✅ ALWAYS use hooks:
import { useChildren } from '../../ui/hooks/useChildren';
const { children, addChild } = useChildren();
```

### Storage Schema

All app data is stored in a single localStorage key (`homework-tracker-data`) with this structure:

```typescript
interface AppData {
  children: Child[];    // All children
  tasks: Task[];        // All tasks for all children
  settings: Settings;   // Global app settings
  version: number;      // Schema version for migrations
}
```

Defined in `src/core/models/storage-schema.ts`.

## Firebase Integration

### Push Notifications Architecture

1. **Client-side** (`src/ui/hooks/useNotifications.ts`):
   - Requests notification permission
   - Obtains FCM token from Firebase Cloud Messaging
   - Saves token to Firestore `fcmTokens` collection
   - Handles foreground messages

2. **Server-side** (`functions/src/index.ts`):
   - `sendDailyReminders` - Scheduled Cloud Function (runs daily at 18:00 Turkey time)
   - `testNotification` - HTTP endpoint for testing notifications
   - Sends push notifications to all registered FCM tokens
   - Automatically cleans up invalid/expired tokens

3. **Service Worker** (`public/firebase-messaging-sw.js`):
   - Handles background notifications when app is closed
   - Required for Web Push API

### Firebase Configuration

Firebase config is loaded from environment variables in `.env`:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

**Important:** If Firebase config fails to load, restart the dev server (`npm run dev`) to reload environment variables.

## Code Style Principles (from CODE_PRINCIPLES.md)

### Critical Principles

1. **Domain-Specific Naming** - NEVER use generic names
   - ✅ `childName`, `childGrade`, `taskSubject`, `taskDueDate`
   - ❌ `name`, `grade`, `subject`, `dueDate`

2. **Guard Clauses, No Else** - Use early returns
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

3. **No Magic Numbers/Indexes**
   ```typescript
   // ✅ Good
   const FIRST_CHILD_INDEX = 0;
   const firstChild = children[FIRST_CHILD_INDEX];

   // ❌ Bad
   const firstChild = children[0];
   ```

4. **Always Use Semicolons** - All statements must end with `;`

5. **Comments Explain "Why"** - Use `// Why:` prefix
   ```typescript
   // Why: Try-catch because localStorage.getItem can throw in incognito/restricted modes
   try {
     const storedData = localStorage.getItem(STORAGE_KEY);
   } catch (error) {
     return createEmptyAppData();
   }
   ```

6. **Positive Conditions** - Prefer `isValid` over `isInvalid`

7. **Flat Control Flow** - Minimize nesting (max 2-3 levels)

### Code Formatting (Prettier)

Configuration in `.prettierrc.json`:
- `semi: true` - Semicolons required
- `singleQuote: true` - Single quotes
- `trailingComma: none` - No trailing commas
- `tabWidth: 2` - 2 spaces
- `printWidth: 100` - Max 100 chars per line

### File Naming

- React components: PascalCase (`AddChildModal.tsx`)
- Hooks: camelCase (`useChildren.ts`)
- Other files: camelCase or kebab-case (`storage-engine.ts`)

## Progressive Web App (PWA)

The app is installable as a PWA:
- Manifest: `public/manifest.json` (Turkish language, education category)
- Install prompt: `src/ui/hooks/useInstallPrompt.ts`
- Service worker for notifications: `public/firebase-messaging-sw.js`

## Deployment

### Vercel (Frontend)
- Configured in `vercel.json` for SPA routing (all routes → `/index.html`)
- Build command: `npm run build`
- Output directory: `dist`

### Firebase (Cloud Functions)
See `FIREBASE_DEPLOYMENT.md` for detailed deployment guide.

## TypeScript Configuration

- Strict mode enabled
- Multiple tsconfig files:
  - `tsconfig.json` - Root config (references app + node)
  - `tsconfig.app.json` - App code
  - `tsconfig.node.json` - Vite config

## Domain Models

### Child
```typescript
interface Child {
  id: string;          // UUID
  name: string;        // 1-50 chars
  grade: number;       // 1-12
  createdAt: number;   // Unix timestamp
}
```

### Task
```typescript
interface Task {
  id: string;          // UUID
  childId: string;     // Foreign key to Child
  subject: string;     // 1-30 chars (e.g., "Matematik")
  description: string; // Max 200 chars
  dueDate: string;     // ISO format: YYYY-MM-DD
  completed: boolean;
  createdAt: number;   // Unix timestamp
}
```

### Settings
```typescript
interface Settings {
  reminderEnabled: boolean;
  reminderTime: string;        // HH:MM format (24-hour)
  lastSelectedChildId: string | null;
}
```

## Multi-Tab Synchronization

The app automatically syncs data across multiple tabs using storage events:
- `storage-engine.ts` handles storage event listening
- Hooks re-render when data changes in other tabs
- No additional setup needed in components

## Common Patterns

### Adding a New Repository

1. Create model in `src/core/models/`
2. Create repository in `src/core/storage/` with CRUD operations
3. Update `AppData` in `storage-schema.ts`
4. Create hook in `src/ui/hooks/` that wraps the repository
5. Use hook in components

### Creating a New Feature

1. Create folder in `src/features/[feature-name]/`
2. Import hooks (never import repositories directly)
3. Follow layered architecture
4. Use domain-specific naming
5. Apply code principles (guard clauses, no magic numbers, etc.)

### CRUD Operations Pattern

All repositories follow consistent CRUD patterns:

**Task Repository** (`src/core/storage/taskRepository.ts`):
- `addTask()` - Create new task
- `updateTask()` - Update existing task (subject, description, dueDate)
- `deleteTask()` - Delete task by ID
- `toggleTaskCompletion()` - Toggle completed status
- `getTasksByChild()` - Get all tasks for a child (sorted)
- `getTasksByDate()` - Get tasks by due date
- `getAllTasks()` - Get all tasks

**Child Repository** (`src/core/storage/childRepository.ts`):
- `addChild()` - Create new child
- `deleteChild()` - Delete child (cascades to delete all tasks)
- `getAllChildren()` - Get all children

### Destructive Actions Require Confirmation

**IMPORTANT:** All destructive actions (delete operations) MUST use `ConfirmDialog` component:

```typescript
// ❌ NEVER use window.confirm
const confirmed = window.confirm('Are you sure?');

// ✅ ALWAYS use ConfirmDialog component
const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

const handleDelete = (item: Item) => {
  setItemToDelete(item);
  setIsDeleteConfirmOpen(true);
};

const handleConfirmDelete = () => {
  if (!itemToDelete) return;
  deleteItem(itemToDelete.id);
  setItemToDelete(null);
};

// In JSX:
<ConfirmDialog
  isOpen={isDeleteConfirmOpen}
  onClose={() => { setIsDeleteConfirmOpen(false); setItemToDelete(null); }}
  onConfirm={handleConfirmDelete}
  title="Delete Item"
  message="Are you sure? This cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  variant="danger"
/>
```

**ConfirmDialog Props:**
- `isOpen` - Controls visibility
- `onClose` - Handler for cancel/close
- `onConfirm` - Handler for confirm action
- `title` - Dialog title
- `message` - Warning message (supports `\n` for line breaks)
- `confirmText` - Confirm button text (default: "Onayla")
- `cancelText` - Cancel button text (default: "İptal")
- `variant` - `'danger'` (red) or `'warning'` (yellow)

### Modal Pattern

For add/edit operations, use Modal-based components:

**Example: EditTaskModal**
```typescript
<EditTaskModal
  isOpen={isEditModalOpen}
  onClose={handleCloseEditModal}
  onUpdate={handleUpdateTask}
  task={taskToEdit}  // Pass the item to edit
/>
```

**Key points:**
- Use `useEffect` to populate form fields when `task` prop changes
- Reset form state in `onClose` handler
- Validate before submission using domain model validators
- Guard clause if item is null
