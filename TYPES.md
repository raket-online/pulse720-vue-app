# TypeScript Types Documentation

This document explains the type system used in the Pulse720 Vue app and how to maintain type safety.

## Type Structure

```
src/
├── types/
│   ├── database.generated.ts  # Auto-generated from Supabase (DO NOT EDIT)
│   └── utils.ts               # Utility types for the application
├── lib/
│   └── supabase.ts            # Database types and Supabase client
└── services/
    └── *.ts                   # Service result types
```

## Generating Database Types from Supabase

### Automatic Generation (Recommended)

Instead of manually maintaining database types, generate them automatically from your Supabase schema:

```bash
# Generate types from Supabase
./scripts/generate-types.sh YOUR_PROJECT_REF

# Find your project ref at:
# https://supabase.com/dashboard/project/<YOUR_PROJECT_REF>
```

This will create `src/types/database.generated.ts` with up-to-date types.

### Manual Update (Current Approach)

Currently, database types are manually defined in `src/lib/supabase.ts`. This works but requires manual updates when the schema changes.

**To migrate to auto-generated types:**

1. Run the generation script
2. Update `src/lib/supabase.ts` to import from `src/types/database.generated.ts`
3. Remove manual Database interface definition

## Utility Types

The `src/types/utils.ts` file provides helpful utility types:

### API Response Types

```typescript
import type { ApiResponse, PaginatedResponse } from '@/types/utils'

// Simple API response
const response: ApiResponse<User> = {
  success: true,
  data: user,
}

// Paginated response
const paginated: PaginatedResponse<Post> = {
  data: posts,
  total: 100,
  page: 1,
  pageSize: 20,
  hasMore: true,
}
```

### Form State

```typescript
import type { FormState } from '@/types/utils'

const loginForm: FormState<LoginData> = {
  data: { email: '', password: '' },
  errors: {},
  touched: {},
  isSubmitting: false,
  isValid: false,
}
```

### Async State

```typescript
import type { AsyncState } from '@/types/utils'

const userState: AsyncState<User> = {
  data: null,
  loading: true,
  error: null,
}
```

### Deep Partial

```typescript
import type { DeepPartial } from '@/types/utils'

// All properties optional, recursively
const updates: DeepPartial<User> = {
  profile: {
    name: 'John', // other profile fields are optional
  },
}
```

### Require/Partial Keys

```typescript
import type { RequireKeys, PartialKeys } from '@/types/utils'

// Make specific fields required
type UserWithEmail = RequireKeys<Partial<User>, 'email'>

// Make specific fields optional
type UserWithoutPassword = PartialKeys<User, 'password'>
```

## Type Safety Best Practices

### 1. Use Strict TypeScript

Already enabled in `tsconfig.app.json`:

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true
}
```

### 2. Type Service Results

All services return typed results:

```typescript
export interface ServiceResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

export async function fetchUser(id: string): Promise<ServiceResult<User>> {
  // Implementation
}
```

### 3. Type Vue Components

```typescript
// Define prop types
interface Props {
  user: User
  isLoading?: boolean
}

// Define emit types
interface Emits {
  (e: 'update', user: User): void
  (e: 'delete', id: string): void
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
})

const emit = defineEmits<Emits>()
```

### 4. Type Pinia Stores

```typescript
export const useUserStore = defineStore('user', () => {
  // State with explicit types
  const user = ref<User | null>(null)
  const loading = ref<boolean>(false)

  // Getters with inferred types
  const isAuthenticated = computed(() => !!user.value)

  // Actions with explicit return types
  async function fetchUser(id: string): Promise<void> {
    // Implementation
  }

  return { user, loading, isAuthenticated, fetchUser }
})
```

### 5. Avoid `any`

Use `unknown` instead of `any` when type is truly unknown:

```typescript
// ❌ Bad
function process(data: any) {
  return data.value
}

// ✅ Good
function process(data: unknown): string {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return String(data.value)
  }
  throw new Error('Invalid data')
}
```

### 6. Use Type Guards

```typescript
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value
  )
}

if (isUser(data)) {
  // data is typed as User here
  console.log(data.email)
}
```

### 7. Type Async Functions

```typescript
// Explicit return type
async function fetchData(): Promise<ApiResponse<Data[]>> {
  try {
    const response = await api.get('/data')
    return { success: true, data: response }
  } catch (error) {
    return { success: false, error: 'Failed to fetch' }
  }
}
```

## Common Type Patterns

### Pattern 1: Service Layer

```typescript
// Define input and output types
export interface CreatePillarInput {
  userId: string
  title: string
}

export type CreatePillarResult = ServiceResult<Pillar>

export async function createPillar(
  input: CreatePillarInput
): Promise<CreatePillarResult> {
  // Implementation
}
```

### Pattern 2: Component Props with Defaults

```typescript
interface Props {
  items: Item[]
  pageSize?: number
  sortDirection?: SortDirection
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 20,
  sortDirection: 'asc',
})
```

### Pattern 3: Discriminated Unions

```typescript
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

function handleState(state: AsyncState<User>) {
  switch (state.status) {
    case 'loading':
      // TypeScript knows data and error don't exist here
      return 'Loading...'
    case 'success':
      // TypeScript knows data exists here
      return state.data.name
    case 'error':
      // TypeScript knows error exists here
      return state.error
  }
}
```

## Troubleshooting

### Type Error: "Property does not exist"

**Problem**: TypeScript doesn't recognize a property on an object.

**Solution**: Ensure the type definition includes that property, or use type assertion:

```typescript
const data = response as User
```

### Type Error: "Type 'X' is not assignable to type 'Y'"

**Problem**: Trying to assign incompatible types.

**Solution**: Check that your data structure matches the expected type. Use type guards or transformations if needed.

### ESLint Warning: "Unexpected any"

**Problem**: Using `any` type.

**Solution**: Replace with specific type or `unknown`:

```typescript
// Before
function process(data: any) {}

// After
function process<T>(data: T) {}
// or
function process(data: unknown) {}
```

## Type Generation Workflow

1. **Update Database Schema** in Supabase
2. **Generate Types**: `./scripts/generate-types.sh PROJECT_REF`
3. **Review Changes**: Check `src/types/database.generated.ts`
4. **Update Code**: Fix any type errors in services/components
5. **Test**: Run `npm test` and `npm run build`
6. **Commit**: Commit both schema changes and generated types

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Vue 3 TypeScript Guide](https://vuejs.org/guide/typescript/overview.html)
- [Supabase Type Generation](https://supabase.com/docs/guides/api/generating-types)
- [Pinia TypeScript Guide](https://pinia.vuejs.org/core-concepts/#typescript)
