# CLAUDE_CONTEXT.md

This file provides context about recent changes and optimizations to the homework tracking PWA.

## Recent Changes (2025-11-04)

### 1. Task Category System Implementation

A comprehensive category system was added to classify homework assignments with different point multipliers.

#### Domain Models

- **File:** `src/core/models/task-category.ts`
- **Categories:** 8 types with Turkish names, icons, colors, and point multipliers
  - Genel Ödev (1.0x) - Blue
  - Yazılı (2.0x) - Red
  - Sözlü (1.5x) - Purple
  - Proje (2.5x) - Orange
  - Etkinlik (1.2x) - Green
  - Okuma (1.0x) - Teal
  - Araştırma (1.8x) - Indigo
  - Sunum (2.0x) - Pink

#### Data Migration

- **File:** `src/core/storage/storage-engine.ts`
- **Migration:** V1 → V2 schema upgrade
- **Change:** Added `taskCategory` field to all existing tasks
- **Default:** `'general_homework'` for migrated tasks
- **Automatic:** Runs on first load, saves migrated data

#### UI Components

- **File:** `src/features/tasks/components/TaskCategoryBadge.tsx`
- **Features:**
  - Dynamic icon loading from lucide-react
  - Category-specific colors with Tailwind classes
  - Optional point multiplier display
  - Responsive badge design

#### Updated Components

- `src/features/tasks/AddTaskModal.tsx` - Category dropdown with descriptions
- `src/features/tasks/EditTaskModal.tsx` - Category editing support
- `src/features/tasks/TaskItem.tsx` - Category badge display next to task subject
- `src/features/tasks/TasksPage.tsx` - Category parameter handling

#### Repository & Hook Updates

- `src/core/storage/taskRepository.ts` - Added `taskCategory` parameter
- `src/ui/hooks/useTasks.ts` - Updated signatures with TaskCategoryType
- `src/core/models/Task.ts` - Added `taskCategory: TaskCategoryType` field

### 2. Bundle Size Optimizations

#### Lucide-React Tree-Shaking

- **Before:** Wildcard import (`import * as Icons`)
- **After:** Named imports for 8 specific icons
- **Savings:** -856 KB raw, -159 KB gzipped (-47%)
- **Result:** 1.5 MB → 658 KB bundle

**Implementation:**

```typescript
// src/features/tasks/components/TaskCategoryBadge.tsx
import { BookOpen, FileText, Mic, Briefcase, Palette, Book, Search, Presentation } from 'lucide-react';

const ICON_MAP = { BookOpen, FileText, ... } as const;
```

#### Route-Based Code Splitting

- **Before:** All pages in main bundle
- **After:** React.lazy + Suspense for each route
- **Savings:** -375 KB main bundle, -90 KB gzipped (-50%)
- **Result:** 658 KB → 283 KB main bundle (initial load)

**Implementation:**

```typescript
// src/router.tsx
const TasksPage = lazy(() => import('./features/tasks/TasksPage'));
const SettingsPage = lazy(() => import('./features/settings/SettingsPage'));
const OnboardingPage = lazy(() => import('./features/onboarding/OnboardingPage'));
```

**Chunks Created:**

- Main bundle: 282.66 KB (90.86 KB gzip) - Initial load
- TasksPage: 18.92 KB (6.10 KB gzip)
- SettingsPage: 349.47 KB (83.73 KB gzip) - Includes Firebase SDK
- OnboardingPage: 1.29 KB (0.75 KB gzip)
- Shared chunks: Modal, Input (auto-split by Vite)

#### Total Optimization Impact

- **Initial Bundle:** 340 KB → 96 KB gzipped (-73%)
- **Lazy Loaded:** Settings page ~84 KB (includes Firebase)
- **Loading UX:** Spinner fallback during chunk download

### 3. Technology Stack Notes

#### Tailwind CSS 4

- **No config files needed:** Auto-optimization built-in
- **No postcss.config.js:** Built-in PostCSS integration
- **No tailwind.config.js:** Convention over configuration
- **Auto-purge:** Unused styles removed automatically

#### Firebase Integration

- **Lazy loaded:** Firebase SDK only loads with SettingsPage
- **No additional optimization needed:** Already optimized via code splitting
- **Cloud Functions:** Scheduled notifications at 18:00 Turkey time

## Architecture Patterns

### Layered Architecture (Strict)

```
UI Layer (React Components)
    ↓
Hook Layer (React Hooks)
    ↓
Storage Layer (Repositories)
    ↓
Core Layer (Domain Models & Business Logic)
```

**Never skip layers:** UI must use hooks, hooks use repositories, repositories use models.

### Code Principles

- **Generic names forbidden:** Use domain-specific names (taskCategory, childName)
- **Guard clauses only:** No else statements
- **No magic numbers:** Use named constants
- **Positive conditions:** Prefer isValid over isInvalid
- **Why comments:** Explain reasoning, not what code does
- **Semicolons required:** All statements end with `;`

### File Naming

- React components: PascalCase (`TaskCategoryBadge.tsx`)
- Hooks: camelCase (`useChildren.ts`)
- Other files: camelCase or kebab-case (`task-category.ts`)

## Important Imports

### Task Model

```typescript
import type { Task } from '../../core/models/task'; // NOT Task.ts
import type { TaskCategoryType } from '../../core/models/task-category';
```

**Note:** File is `Task.ts` (capital T) but import uses lowercase `task`.

### Category System

```typescript
import { TASK_CATEGORIES, type TaskCategoryType } from '../../core/models/task-category';
```

## Storage Schema

### Current Version: V2

```typescript
interface AppData {
  children: Child[];
  tasks: Task[]; // Now includes taskCategory field
  settings: Settings;
  version: 2; // Incremented from 1
}
```

### Task Interface

```typescript
interface Task {
  id: string;
  childId: string;
  subject: string;
  description: string;
  dueDate: string; // YYYY-MM-DD format
  completed: boolean;
  createdAt: number;
  taskCategory: TaskCategoryType; // NEW in V2
}
```

## Performance Metrics

### Build Output

```
Main bundle (index.js):     282.66 KB (90.86 KB gzip)
TasksPage chunk:             18.92 KB  (6.10 KB gzip)
SettingsPage chunk:         349.47 KB (83.73 KB gzip)
OnboardingPage chunk:         1.29 KB  (0.75 KB gzip)
Shared chunks:               ~6 KB total
CSS bundle:                  22.16 KB  (5.25 KB gzip)
```

### Initial Page Load

- **Total:** ~96 KB gzipped (JS + CSS)
- **Fast Initial Load:** Only main bundle + TasksPage for home route
- **Progressive Loading:** Other routes load on-demand

## Dependencies

### Key Libraries

- React 18 + React Router
- Firebase SDK (Messaging, Firestore)
- lucide-react (8 icons only, tree-shaked)
- Tailwind CSS 4 (auto-optimized)

### Bundle Analysis

- React + React Router: ~150 KB
- Firebase SDK: ~300 KB (lazy loaded with Settings)
- Tailwind utilities: ~100 KB (purged)
- App code: ~100 KB (split across chunks)
- lucide-react: ~8 KB (8 icons only)

## Code Organization

### Feature Folders

```
src/features/
├── tasks/
│   ├── components/
│   │   └── TaskCategoryBadge.tsx  [NEW]
│   ├── TasksPage.tsx
│   ├── TaskItem.tsx
│   ├── TaskList.tsx
│   ├── AddTaskModal.tsx
│   └── EditTaskModal.tsx
├── settings/
│   └── SettingsPage.tsx
└── onboarding/
    └── OnboardingPage.tsx
```

### Core Modules

```
src/core/
├── models/
│   ├── task.ts               [UPDATED: +taskCategory field]
│   ├── task-category.ts      [NEW]
│   ├── child.ts
│   └── storage-schema.ts     [UPDATED: version 2]
├── storage/
│   ├── storage-engine.ts     [UPDATED: +migrateToV2]
│   └── taskRepository.ts     [UPDATED: +taskCategory param]
└── services/
    └── notificationScheduler.ts
```

## Common Issues & Solutions

### Issue: Import case sensitivity

**Problem:** TypeScript error "Cannot find module './Task'"
**Solution:** File is `Task.ts` but import as `'./task'` (lowercase)

### Issue: Bundle too large

**Solution:** Already optimized with tree-shaking and code splitting

### Issue: Migration not running

**Solution:** Check localStorage version, clear if needed: `localStorage.removeItem('homework-tracker-data')`

### Issue: Icons not showing

**Solution:** Verify icon names in TASK_CATEGORIES match ICON_MAP keys exactly

## Next Steps (Future Enhancements)

Potential optimizations (not currently needed):

1. Brotli compression (server-side)
2. Image optimization (WebP conversion)
3. Service Worker caching strategy refinement
4. CDN deployment for static assets
5. Additional route prefetching on hover
6. Point system implementation (using category multipliers)

---

**Last Updated:** 2025-11-04
**Schema Version:** V2
**Main Bundle Size:** 96 KB gzipped (initial load)
