# Kod Standartları

Bu dosya, Code Principles'ı destekler ve projeye özel isimlendirme örnekleri içerir.

## Dosya İsimlendirme

### React Component Dosyaları

- **Format**: PascalCase + `.tsx`
- **Örnek**:
  - ✅ `AddChildModal.tsx`
  - ✅ `TaskListItem.tsx`
  - ✅ `ChildProfileCard.tsx`
  - ❌ `add-child-modal.tsx` (kebab-case yanlış)
  - ❌ `addChildModal.tsx` (camelCase yanlış)
  - ❌ `AddChildModal.component.tsx` (suffix gereksiz)

### React Hook Dosyaları

- **Format**: camelCase + `.ts`
- **Örnek**:
  - ✅ `useChildren.ts`
  - ✅ `useTasks.ts`
  - ✅ `useLocalStorage.ts`
  - ❌ `use-children.ts` (kebab-case yanlış)
  - ❌ `UseChildren.ts` (PascalCase yanlış)
  - ❌ `useChildren.hook.ts` (suffix gereksiz)

### Type Definition Dosyaları

- **Format**: kebab-case + `.types.ts` veya PascalCase (model için)
- **Örnek**:
  - ✅ `child.types.ts` (type definitions)
  - ✅ `Child.ts` (domain model - Core layer'da)
  - ✅ `task-status.types.ts`
  - ❌ `childTypes.ts`
  - ❌ `child_types.ts`

### Utility Function Dosyaları

- **Format**: camelCase + `.ts`
- **Örnek**:
  - ✅ `formatChildName.ts`
  - ✅ `calculateTaskProgress.ts`
  - ✅ `generateUniqueId.ts`
  - ❌ `format-child-name.ts`
  - ❌ `utils.ts` (çok generic)

### Storage/Repository Dosyaları

- **Format**: camelCase + `.ts`
- **Örnek**:
  - ✅ `repository.ts`
  - ✅ `childRepository.ts`
  - ✅ `storageEvents.ts`
  - ❌ `Repository.ts`
  - ❌ `child-repository.ts`

---

## Değişken İsimlendirme

### Genel Kural: Domain-Specific Names

// Why: Generic names like "data" or "item" make code hard to understand

- **Her değişken domain context'ini taşımalı**
- **Asla generic names kullanma**: `data`, `arr`, `item`, `temp`, `result`

### ✅ İyi Örnekler

```typescript
const activeChildList = children.filter((child) => child.isActive);
const completedTaskCount = tasks.filter((task) => task.status === 'completed').length;
const primaryChildName = children.find((child) => child.isPrimary)?.childName;
const taskDueDateTimestamp = new Date(task.dueDate).getTime();
```

### ❌ Kötü Örnekler

```typescript
const list = children.filter(...);        // ❌ "list" of what?
const count = tasks.filter(...).length;   // ❌ count of what?
const name = children.find(...)?.name;    // ❌ whose name?
const timestamp = new Date(...).getTime(); // ❌ timestamp of what?
```

### Array/List Variables

- **Plural form kullan**: `childList`, `taskItems`, `rewardOptions`
- **Filtered/transformed arrays için açıklayıcı prefix**:
  - `activeChildList`
  - `completedTaskList`
  - `upcomingTaskItems`

```typescript
// ✅ Good
const childList = getAllChildren();
const activeChildList = childList.filter((child) => child.isActive);
const completedTaskList = tasks.filter((task) => task.status === 'completed');

// ❌ Bad
const children = getAllChildren();  // ❌ Confusing with "children" prop in React
const active = list.filter(...);    // ❌ active what?
const completed = tasks.filter(...); // ❌ completed what?
```

---

## Fonksiyon İsimlendirme

### Verb + Noun Pattern

// Why: Functions perform actions, names should reflect that action clearly

```typescript
// ✅ Good: Clear action + specific target
function calculateChildTaskProgress(childId: ChildId): number;
function formatTaskDueDate(dueDate: Date): string;
function validateChildAge(childAge: number): boolean;
function generateUniqueChildId(): ChildId;
function saveChildToStorage(child: Child): void;

// ❌ Bad: Vague or missing context
function calc(id: string): number; // ❌ calc what?
function format(date: Date): string; // ❌ format what?
function validate(age: number): boolean; // ❌ validate what?
function generate(): string; // ❌ generate what?
function save(data: any): void; // ❌ save what? where?
```

### Event Handler Functions

- **Prefix**: `handle` + Event + Context
- **Component-specific handlers**: use local scope

```typescript
// ✅ Good
function handleTaskCompletion(taskId: TaskId): void;
function handleChildDeletion(childId: ChildId): void;
function handleModalClose(): void;
function handleFormSubmit(event: FormEvent): void;

// ❌ Bad
function complete(id: string): void; // ❌ unclear
function onDelete(id: string): void; // ❌ "on" is for props, not handlers
function close(): void; // ❌ close what?
function submit(e: any): void; // ❌ submit what?
```

### Boolean-Returning Functions

- **Prefix**: `is`, `has`, `should`, `can`

```typescript
// ✅ Good
function isChildEligibleForReward(child: Child): boolean;
function hasTaskDeadlinePassed(task: Task): boolean;
function shouldDisplayCompletionBadge(taskCount: number): boolean;
function canChildCompleteTask(child: Child, task: Task): boolean;

// ❌ Bad
function eligible(child: Child): boolean; // ❌ what kind of eligibility?
function passed(task: Task): boolean; // ❌ passed what?
function display(count: number): boolean; // ❌ unclear
function complete(c: Child, t: Task): boolean; // ❌ complete or can complete?
```

---

## Boolean İsimlendirme

### Positive Form (Always)

// Why: Negative conditions are harder to reason about

```typescript
// ✅ Good: Positive conditions
const isTaskCompleted = task.status === 'completed';
const hasChildPermission = child.permissions.includes('edit');
const shouldRenderTaskList = taskList.length > 0;
const canChildEditTask = isTaskOwner && hasEditPermission;

// ❌ Bad: Negative conditions
const isNotCompleted = task.status !== 'completed'; // ❌ use isTaskPending instead
const lacksPermission = !permissions.includes('edit'); // ❌ use hasPermission
const shouldNotRender = list.length === 0; // ❌ use shouldRender
const cannotEdit = !isOwner || !hasPermission; // ❌ use canEdit
```

### Boolean Variable Patterns

| Pattern          | Use Case                     | Example                                     |
| ---------------- | ---------------------------- | ------------------------------------------- |
| `is[State]`      | Current state                | `isTaskActive`, `isChildSelected`           |
| `has[Property]`  | Possession/existence         | `hasTaskDeadline`, `hasChildAvatar`         |
| `should[Action]` | Conditional rendering/action | `shouldDisplayReward`, `shouldEnableButton` |
| `can[Action]`    | Permission/ability           | `canChildEdit`, `canDeleteTask`             |

```typescript
// ✅ Good examples
const isModalOpen = modalState === 'open';
const hasUnsavedChanges = formData !== originalData;
const shouldShowWarning = taskList.length > 10;
const canSubmitForm = isFormValid && !isSubmitting;

// ❌ Bad examples
const modalOpen = modalState === 'open'; // ❌ missing "is"
const unsavedChanges = formData !== originalData; // ❌ missing "has"
const showWarning = taskList.length > 10; // ❌ missing "should"
const submitForm = isValid && !submitting; // ❌ unclear, missing "can"
```

### Multiple Boolean Conditions

```typescript
// ✅ Good: Extract to named variables
const isTaskOverdue = taskDueDate < currentDate;
const isTaskHighPriority = task.priority === 'high';
const shouldHighlightTask = isTaskOverdue && isTaskHighPriority;

if (shouldHighlightTask) {
  renderHighlightedTask(task);
}

// ❌ Bad: Inline complex condition
if (task.dueDate < new Date() && task.priority === 'high') {
  renderHighlightedTask(task);
}
```

---

## Constants ve Magic Values

### Constants İçin SCREAMING_SNAKE_CASE

```typescript
// ✅ Good
const MAX_CHILDREN_PER_FAMILY = 10;
const DEFAULT_TASK_POINTS = 5;
const STORAGE_KEY_CHILDREN = 'app_children_v1';
const TASK_STATUS_COMPLETED = 'completed' as const;

// ❌ Bad
const maxChildren = 10; // ❌ not a constant style
const defaultPoints = 5; // ❌ not a constant style
const storageKey = 'app_children_v1'; // ❌ not a constant style
```

### Named Indexes

// Why: Array indexes are magic numbers without context

```typescript
// ✅ Good: Named constant for index
const FIRST_CHILD_INDEX = 0;
const LAST_TASK_INDEX = taskList.length - 1;
const primaryChild = childList[FIRST_CHILD_INDEX];

// ✅ Better: Named access pattern
const primaryChild = childList.find((child) => child.isPrimary);
const latestTask = taskList[taskList.length - 1]; // OK for last item

// ❌ Bad: Magic index
const child = childList[0]; // ❌ why 0? what does it mean?
const task = taskList[2]; // ❌ what is special about index 2?
```

---

## Type Naming

### Type Definitions

```typescript
// ✅ Good: Descriptive, domain-specific
type ChildId = string;
type TaskStatus = 'pending' | 'in-progress' | 'completed';
type TaskPriority = 'low' | 'medium' | 'high';

type Child = {
  childId: ChildId;
  childName: string;
  childAge: number;
};

// ❌ Bad: Generic, unclear
type Id = string; // ❌ ID of what?
type Status = string; // ❌ Status of what?
type Item = { id: string; name: string }; // ❌ What kind of item?
```

---

## Karşılaştırma Tablosu

| Kategori | ❌ Kötü            | ✅ İyi                       | Neden?                          |
| -------- | ------------------ | ---------------------------- | ------------------------------- |
| Variable | `const data`       | `const childList`            | Generic name vs domain-specific |
| Function | `function get()`   | `function getChildById()`    | Unclear vs explicit action      |
| Boolean  | `const flag`       | `const isTaskCompleted`      | Meaningless vs self-documenting |
| Array    | `const items`      | `const taskItems`            | Generic vs typed collection     |
| Handler  | `function click()` | `function handleTaskClick()` | Vague vs specific event         |
| Constant | `const max = 10`   | `const MAX_CHILDREN = 10`    | Magic number vs named constant  |

---

**Hatırlatma**: Bu conventions, Code Principles'daki kuralların somut örnekleridir. Emin değilsen Code Principles dosyasına dön.

```

```
