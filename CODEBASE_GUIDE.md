# Codebase Guide

Bu dosya, projenin genel yapısını ve kod yazarken hangi katmanda ne yapılacağını açıklar.

## Proje Yapısı

```
src/
├── core/              # Domain models, business logic
│   ├── models/        # Child, Task, Settings types
│   ├── validators/    # Business validation functions
│   └── utils/         # Pure utility functions
├── storage/           # localStorage abstraction
│   ├── repository.ts  # CRUD operations
│   └── events.ts      # Storage event handling
├── hooks/             # React hooks (Storage ↔ UI bridge)
│   ├── useChildren.ts
│   ├── useTasks.ts
│   └── useSettings.ts
└── components/        # UI components (presentation only)
    ├── modals/
    ├── lists/
    └── forms/
```

## Yeni Özellik Ekleme Akışı

### 1. Domain Model Oluştur (Core Layer)

**Dosya**: `src/core/models/[feature].ts`

```typescript
// Why: Core layer has zero dependencies, pure TypeScript
export type ParentReward = {
  rewardId: string;
  rewardTitle: string;
  rewardPointCost: number;
  rewardDescription: string;
  isRewardActive: boolean;
};
```

### 2. Storage CRUD Ekle (Storage Layer)

**Dosya**: `src/storage/repository.ts` veya `src/storage/[feature]Repository.ts`

```typescript
// Why: All localStorage access must go through storage layer
export function saveParentReward(reward: ParentReward): void {
  const existingRewards = getAllParentRewards();
  const updatedRewards = [...existingRewards, reward];
  localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(updatedRewards));
}
```

### 3. React Hook Oluştur (Hook Layer)

**Dosya**: `src/hooks/use[Feature].ts`

```typescript
// Why: Hooks bridge storage and UI, provide reactive data access
export function useParentRewards() {
  const [rewardList, setRewardList] = useState<ParentReward[]>([]);

  useEffect(() => {
    const loadedRewards = getAllParentRewards();
    setRewardList(loadedRewards);
  }, []);

  const addReward = useCallback((newReward: ParentReward) => {
    saveParentReward(newReward);
    setRewardList((previousRewards) => [...previousRewards, newReward]);
  }, []);

  return { rewardList, addReward };
}
```

### 4. UI Component Yaz (UI Layer)

**Dosya**: `src/components/[feature]/[ComponentName].tsx`

```typescript
// Why: UI components only handle presentation, consume hooks for data
export function RewardListDisplay() {
  const { rewardList, addReward } = useParentRewards();

  if (rewardList.length === 0) {
    return <EmptyRewardState />;
  }

  return (
    <div>
      {rewardList.map((reward) => (
        <RewardCard key={reward.rewardId} reward={reward} />
      ))}
    </div>
  );
}
```

## Katman Kuralları

### ✅ Core Layer İçin İzinler

- Pure TypeScript types ve functions
- Business logic ve validation
- Zero dependencies (React'e bile bağımlı değil)
- Export edilen her şey başka katmanlarda kullanılabilir

### ❌ Core Layer İçin Yasaklar

- React hooks kullanma
- DOM'a erişme
- localStorage'a direkt erişme
- External library import etme (date-fns gibi pure utils hariç)

### ✅ Storage Layer İçin İzinler

- localStorage okuma/yazma
- Core models kullanma
- CRUD operations
- Storage events dinleme

### ❌ Storage Layer İçin Yasaklar

- React hooks kullanma
- UI component render etme
- Business logic yazmak (Core'da olmalı)

### ✅ Hook Layer İçin İzinler

- React hooks (useState, useEffect, useCallback, useMemo)
- Storage layer functions çağırma
- Core models ve validators kullanma
- Multi-tab synchronization için storage events

### ❌ Hook Layer İçin Yasaklar

- Direkt localStorage erişimi (storage layer kullan)
- JSX/TSX return etme (component değil, hook)
- Complex business logic (Core'a taşı)

### ✅ UI Layer İçin İzinler

- JSX/TSX render
- Hooks consume etme
- Presentation logic
- User interaction handling

### ❌ UI Layer İçin Yasaklar

- Direkt localStorage erişimi
- Storage layer functions çağırma (hook kullan)
- Complex business logic (Core'a taşı)

## Sık Yapılan Hatalar ve Çözümleri

### ❌ Hata: Component içinde localStorage.getItem()

```typescript
// Bad: UI component direkt storage'a erişiyor
function ChildList() {
  const children = JSON.parse(localStorage.getItem('children') || '[]');
  return <div>{children.map(...)}</div>;
}
```

✅ **Çözüm**: Hook kullan

```typescript
function ChildList() {
  const { childList } = useChildren();
  return <div>{childList.map(...)}</div>;
}
```

### ❌ Hata: Hook içinde business logic

```typescript
// Bad: Hook içinde validation logic
function useChildren() {
  const addChild = (child: Child) => {
    if (child.childName.length < 2) {
      throw new Error('Name too short');
    }
    saveChild(child);
  };
}
```

✅ **Çözüm**: Validation'ı Core'a taşı

```typescript
// src/core/validators/childValidator.ts
export function validateChildName(childName: string): boolean {
  return childName.length >= 2;
}

// src/hooks/useChildren.ts
function useChildren() {
  const addChild = (child: Child) => {
    if (!validateChildName(child.childName)) {
      throw new Error('Invalid child name');
    }
    saveChild(child);
  };
}
```

### ❌ Hata: Magic indexes kullanımı

```typescript
// Bad: Array index'e direkt erişim
const firstChild = children[0];
const taskStatus = task.status[2];
```

✅ **Çözüm**: Named access veya named constant

```typescript
// Good: Named property access
const firstChild = children.find((child) => child.isPrimaryChild);

// Good: Named constant for index
const COMPLETED_STATUS_INDEX = 2;
const taskStatus = task.status[COMPLETED_STATUS_INDEX];

// Best: Avoid arrays for named data
type TaskStatus = 'pending' | 'in-progress' | 'completed';
const taskStatus: TaskStatus = task.status;
```

## Data Flow

```
User Action (UI)
      ↓
React Hook (Hooks Layer)
      ↓
Storage Function (Storage Layer)
      ↓
localStorage
      ↓
Storage Event (multi-tab sync)
      ↓
Hook updates state
      ↓
UI re-renders
```

## Dosya Ekleme/Değiştirme Kontrol Listesi

Yeni kod yazarken şunu sor:

1. ✅ Bu kod hangi katmanda olmalı?
2. ✅ Değişken/function isimleri domain-specific mi?
3. ✅ Guard clause kullandım mı, else'den kaçındım mı?
4. ✅ Boolean değişkenler positive form'da mı? (is/has/should)
5. ✅ Magic index/number kullanmadım mı?
6. ✅ Comment "why" açıklıyor mu, "what" değil mi?
7. ✅ Semicolon her satırda var mı?
8. ✅ Katman kurallarına uyuyor mu?

---

**Not**: Bu guide'a uymayan kod review'da reddedilir. Emin değilsen Code Principles dosyasına tekrar bak.
