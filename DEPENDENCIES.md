# Bağımlılık Kullanım Rehberi

## Ne Zaman Hangi Tool

### State Management

- **React Query**: Server data (GET, POST, PUT, DELETE)
- **Zustand/Redux Tookit**: Global UI state (theme, sidebar, modal)
- **Context**: Theme, auth status gibi nadiren değişen data
- **useState**: Sadece bir component'a özel state

### Form Handling

- **React Hook Form**: Performans kritik, kompleks validasyon
- **Controlled input**: Basit formlar, birkaç input

### Styling

- **Tailwind**: Layout, spacing, colors
- **CSS Modules**: Component-specific kompleks stil
- **inline style**: Asla kullanma (dynamic değerler hariç)

## Yeni Bağımlılık Ekleme Kriteri

1. Problem native/mevcut tool'larla çözülemiyor mu?
2. Bundle size etkisi kabul edilebilir mi? (<50kb gzipped)
3. Aktif maintainer var mı? (son 3 ay içinde commit)
4. Type safety desteği var mı?
