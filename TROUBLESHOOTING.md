# Troubleshooting

Bu dosya, sık karşılaşılan hataları ve çözümlerini içerir.

## localStorage Hataları

### QuotaExceededError

**Hata**: `DOMException: QuotaExceededError`
**Sebep**: localStorage 5MB limitini aştı
**Çözüm**:

```typescript
try {
  localStorage.setItem(key, value);
} catch (error) {
  if (error instanceof DOMException && error.name === 'QuotaExceededError') {
    // Clean old data or warn user
    alert('Storage full. Please archive old tasks.');
  }
}
```

### localStorage null in Incognito

**Hata**: `Cannot read property 'getItem' of null`
**Sebep**: Bazı browser'lar incognito'da localStorage'ı disable eder
**Çözüm**:

```typescript
// Why: Check availability before use
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
```

## React Hooks Hataları

### Hook çağrısı conditional

**Hata**: `React Hook "useState" is called conditionally`
**Sebep**: Hook conditional veya loop içinde çağrıldı
**Çözüm**:

```typescript
// ❌ Bad
if (shouldUseHook) {
  const [state, setState] = useState();
}

// ✅ Good
const [state, setState] = useState();
if (shouldUseHook) {
  // Use state here
}
```

### Infinite re-render loop

**Hata**: "Too many re-renders. React limits the number of renders..."
**Sebep**: setState her render'da çağrılıyor
**Çözüm**:

```typescript
// ❌ Bad: setState immediately in component body
function Component() {
  const [count, setCount] = useState(0);
  setCount(count + 1); // Infinite loop!
}

// ✅ Good: setState in useEffect or event handler
function Component() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count + 1);
  }, []); // Run once
}
```

## TypeScript Hataları

### Property does not exist on type

**Hata**: `Property 'childName' does not exist on type 'Child'`
**Sebep**: Type definition eksik veya yanlış
**Çözüm**: Core layer'da type'ı kontrol et

```typescript
// src/core/models/child.ts
export type Child = {
  childId: string;
  childName: string; // ← Missing this?
  childGrade: number;
};
```

### Type 'string' is not assignable to type 'ChildId'

**Hata**: Type mismatch
**Sebep**: Branded type kullanılıyor ama plain string veriliyor
**Çözüm**:

```typescript
// ❌ Bad
const childId: ChildId = 'some-id';

// ✅ Good
const childId: ChildId = 'some-id' as ChildId;

// ✅ Better: Use factory function
function createChildId(): ChildId {
  return crypto.randomUUID() as ChildId;
}
```

## Build Hataları

### Module not found

**Hata**: `Cannot find module './component'`
**Sebep**: Import path yanlış veya dosya yok
**Çözüm**:

1. Dosya adı doğru mu? (case-sensitive)
2. Extension var mı? (.tsx ekle)
3. Relative path doğru mu? (../ sayısı)

### Unexpected token '<'

**Hata**: Syntax error
**Sebep**: JSX syntax TypeScript dosyasında (.ts instead of .tsx)
**Çözüm**: Dosya uzantısını .tsx yap

## Runtime Hataları

### Cannot read property of undefined

**Hata**: `Cannot read property 'childName' of undefined`
**Sebep**: Data henüz yüklenmedi veya undefined
**Çözüm**: Guard clause ekle

```typescript
// ❌ Bad
return <div>{child.childName}</div>;

// ✅ Good
if (!child) {
  return <div>Loading...</div>;
}
return <div>{child.childName}</div>;
```

### JSON.parse error

**Hata**: `Unexpected token in JSON at position 0`
**Sebep**: localStorage'da geçersiz JSON
**Çözüm**:

```typescript
function parseStoredData<T>(key: string, fallback: T): T {
  try {
    const storedItem = localStorage.getItem(key);
    if (!storedItem) {
      return fallback;
    }
    return JSON.parse(storedItem);
  } catch {
    // Why: Invalid JSON, return fallback and clear bad data
    localStorage.removeItem(key);
    return fallback;
  }
}
```

## Debugging Checklist

Bir hata aldığında sırayla kontrol et:

1. ✅ **Console'da tam hata mesajı ne?**
2. ✅ **Hangi dosya ve satırda oluştu?**
3. ✅ **Type definition doğru mu?** (Core layer'a bak)
4. ✅ **Katman kurallarına uyuyor mu?** (UI → Hooks → Storage → Core)
5. ✅ **Guard clause var mı?** (undefined check)
6. ✅ **localStorage available mı?** (incognito check)
7. ✅ **Semi-colon eksik mi?** (Prettier çalıştır)

---

**Hala çözemediysen**: Code Principles ve Codebase Guide'ı tekrar oku. Sorun genelde katman kurallarına uymamaktan kaynaklanır.
