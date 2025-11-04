# Architecture

## Layered Architecture

Bu proje **katmanlı mimari** (Layered Architecture) kullanır. Her katmanın sorumluluğu ve bağımlılık yönü açıkça bellidir.

```
┌─────────────────────────────────────┐
│         UI Layer (React)            │  ← User sees this
│      components/modals/lists        │
└──────────────┬──────────────────────┘
               │ uses
               ↓
┌─────────────────────────────────────┐
│       Hook Layer (React Hooks)      │  ← Bridge between UI and Data
│     useChildren/useTasks/etc.       │
└──────────────┬──────────────────────┘
               │ uses
               ↓
┌─────────────────────────────────────┐
│     Storage Layer (localStorage)    │  ← Data persistence
│       repository/events             │
└──────────────┬──────────────────────┘
               │ uses
               ↓
┌─────────────────────────────────────┐
│       Core Layer (Pure TS)          │  ← Business logic & models
│      models/validators/utils        │
└─────────────────────────────────────┘
```

**Bağımlılık Yönü**: UI → Hooks → Storage → Core

- Core hiçbir katmana bağımlı değil
- Storage sadece Core'a bağımlı
- Hooks Storage ve Core'a bağımlı
- UI sadece Hooks'a bağımlı

## Multi-Tab Synchronization

// Why: Multiple browser tabs open aynı data'yı sync tutmalı

```typescript
// storage/events.ts
window.addEventListener('storage', (event) => {
  if (event.key === CHILDREN_STORAGE_KEY) {
    // Trigger hook updates in other tabs
  }
});
```

## State Management Strategy

**localStorage (Current)**

- Pros: Simple, no dependencies, works offline
- Cons: Max 5-10MB, synchronous, string-only
- Use for: User's family data, settings, tasks

**Future Migration (if needed)**

- Consider IndexedDB for larger datasets
- Consider cloud sync with API backend
- Current architecture makes this migration easy (just swap Storage layer)

## Testing Strategy

### Core Layer Tests

- Unit tests for pure functions
- Validation logic
- Business rules
- **Coverage target: 90%+**

### Storage Layer Tests

- Mock localStorage
- Test CRUD operations
- Test error handling (quota exceeded, etc.)

### Hook Layer Tests

- React Testing Library
- Test state updates
- Test multi-tab sync
- **Mock storage layer**

### UI Layer Tests

- Component rendering
- User interactions
- Integration tests
- **Mock hooks**

## Performance Considerations

### localStorage Read/Write

- Reads are synchronous and fast (<1ms typically)
- Writes can be slower (2-5ms)
- Avoid frequent writes (debounce if needed)

### React Re-renders

- Hooks use `useState` and trigger re-renders on data change
- Components should be memoized if they don't depend on frequently changing data
- Use React DevTools Profiler to identify unnecessary re-renders

### Data Size Limits

- localStorage limit: ~5MB (varies by browser)
- Current approach: Warn user at 4MB, block at 4.8MB
- If limits hit: Consider data pruning (archive old tasks)

## Error Handling

### localStorage Errors

```typescript
// Why: localStorage can fail (incognito, quota, browser restrictions)
try {
  localStorage.setItem(key, value);
} catch (storageError) {
  // Fallback: Use in-memory storage
  // Show user: "Data won't persist across sessions"
}
```

### Validation Errors

- Core layer throws descriptive errors
- Hooks catch and convert to user-friendly messages
- UI displays error state

## Security Considerations

// Why: localStorage accessible via XSS, never store sensitive data

- **Never store**: Passwords, API tokens, PII
- **OK to store**: App state, user preferences, family data (non-sensitive)
- **Future**: If adding auth, use httpOnly cookies for tokens

## Scalability Roadmap

### Phase 1 (Current): localStorage

- Single user, single device
- Offline-first
- Simple architecture

### Phase 2 (Future): Cloud Sync

- Replace Storage layer with API calls
- Add sync logic in hooks
- localStorage becomes cache

### Phase 3 (Future): Multi-user

- Add authentication
- Family sharing features
- Real-time updates (WebSocket)

---

**Key Principle**: Architecture katmanları değiştirmek kolay olmalı. Core layer hiçbir şeye bağımlı olmadığı için, Storage veya Hooks layer'ı değiştirmek Core'u etkilemez.
