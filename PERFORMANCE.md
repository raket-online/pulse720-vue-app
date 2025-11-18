# Performance Optimization Guide

## Current Optimizations

### 1. Build Optimizations

**Vite Configuration** (vite.config.ts):
- Tree-shaking enabled by default
- Code splitting for routes (lazy loading)
- CSS code splitting
- Minification in production

**Route-based Code Splitting** (already implemented):
```typescript
// src/router/index.ts
{
  path: '/',
  component: () => import('@/views/Dashboard.vue'), // Lazy loaded
}
```

### 2. Bundle Size

Current production build:
- Main bundle: ~286 KB (gzipped: ~88 KB)
- CSS: ~27 KB (gzipped: ~6 KB)
- Dashboard component: ~106 KB (gzipped: ~25 KB)

### 3. Recommended Performance Improvements

#### A. Component-level Code Splitting

For large components, use dynamic imports:

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const HeavyComponent = defineAsyncComponent(() =>
  import('./HeavyComponent.vue')
)
</script>
```

#### B. Virtual Scrolling for Long Lists

For lists with 100+ items:

```bash
npm install vue-virtual-scroller
```

```vue
<template>
  <RecycleScroller
    :items="items"
    :item-size="80"
    key-field="id"
  >
    <template #default="{ item }">
      <ItemCard :item="item" />
    </template>
  </RecycleScroller>
</template>
```

#### C. Image Optimization

Use modern image formats and lazy loading:

```vue
<img
  :src="imageUrl"
  loading="lazy"
  decoding="async"
  alt="Description"
/>
```

#### D. Debounce User Input

```typescript
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const searchQuery = ref('')
const debouncedSearch = useDebounceFn(async (query: string) => {
  // Perform search
}, 300)

watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery)
})
```

## Performance Monitoring

### Built-in Browser Tools

```javascript
// Measure component render time
performance.mark('component-start')
// ... component logic
performance.mark('component-end')
performance.measure('component-render', 'component-start', 'component-end')
```

### Vue Devtools

Install [Vue Devtools](https://devtools.vuejs.org/) for:
- Component performance profiling
- State inspection
- Event tracking

### Lighthouse

Run Lighthouse audits:
```bash
npm run build
npm run preview
# Open Chrome DevTools > Lighthouse
```

## Best Practices

### 1. Computed vs Methods

✅ Use `computed` for derived state:
```typescript
const filteredItems = computed(() => items.value.filter(predicate))
```

❌ Don't recalculate in template:
```vue
<!-- Bad -->
<div v-for="item in items.filter(predicate)"></div>

<!-- Good -->
<div v-for="item in filteredItems"></div>
```

### 2. v-show vs v-if

- `v-if`: Conditional rendering (removed from DOM)
- `v-show`: CSS display toggle (stays in DOM)

Use `v-show` for frequently toggled elements.
Use `v-if` for rarely shown content.

### 3. Key Attribute

Always use `:key` with `v-for`:
```vue
<div v-for="item in items" :key="item.id">
  {{ item.name }}
</div>
```

### 4. Avoid Nested Watchers

❌ Bad:
```typescript
watch(foo, () => {
  watch(bar, () => {
    // Nested watcher
  })
})
```

✅ Good:
```typescript
watch([foo, bar], ([newFoo, newBar]) => {
  // Handle both
})
```

### 5. Async Components with Loading States

```typescript
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./Component.vue'),
  loadingComponent: LoadingSpinner,
  delay: 200,
  errorComponent: ErrorDisplay,
  timeout: 3000,
})
```

## Bundle Analysis

Analyze bundle size:

```bash
npm run build

# View bundle composition
npx vite-bundle-visualizer
```

## Caching Strategy

### Service Worker (Future Enhancement)

```bash
npm install -D vite-plugin-pwa
```

### HTTP Caching

Configure in deployment:
- Static assets: `Cache-Control: public, max-age=31536000, immutable`
- HTML: `Cache-Control: no-cache`
- API responses: Appropriate cache headers

## Performance Checklist

- [ ] Enable gzip/brotli compression
- [ ] Use CDN for static assets
- [ ] Implement code splitting
- [ ] Lazy load images
- [ ] Optimize fonts (preload, subset)
- [ ] Remove unused dependencies
- [ ] Tree-shake lodash/moment (use modern alternatives)
- [ ] Use production builds only in production
- [ ] Enable HTTP/2
- [ ] Implement service worker for offline support

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Vue Performance Guide](https://vuejs.org/guide/best-practices/performance.html)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
