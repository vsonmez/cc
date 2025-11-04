# Performans Optimizasyon Rehberi

## Bundle Optimization

- Route-based code splitting (React.lazy)
- Heavy library'ler için dynamic import
- Tree-shaking uyumlu import (named import kullan)

## Runtime Optimization

- List rendering: key prop olarak index kullanma
- Expensive computation: useMemo
- Callback function: useCallback (dependency array dikkatli)
- Image: lazy loading + WebP format

## Measurement

- Lighthouse audit her sprint sonunda
- React DevTools Profiler ile bottleneck tespiti
- Bundle analyzer ile gereksiz dependency tespiti
