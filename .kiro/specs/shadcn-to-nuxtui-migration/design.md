# Design Document: shadcn-to-nuxtui-migration

## Overview

This migration replaces all shadcn/vue primitive components and their supporting infrastructure with NuxtUI equivalents across the `app/` layer of a Nuxt 3 SPA/SSR application. The project already has `@nuxt/ui` installed and an `app-nuxtui-layer/` that uses NuxtUI for navigation and footer. The goal is to complete the migration so the entire application uses a single, consistent component system.

### Scope Summary

**Components to replace:**
| shadcn/vue | NuxtUI equivalent |
|---|---|
| `<Button>` | `<UButton>` |
| `<Card>` + sub-components | `<UCard>` (slot-based) |
| `<Dialog>` + sub-components | `<UModal>` |
| `<Drawer>` + sub-components | `<USlideover>` |
| `<Input>` | `<UInput>` |
| `<Label>` | native `<label>` |
| `<Skeleton>` | `<USkeleton>` |
| `vue-sonner` `toast()` | `useToast().add()` |
| `<Toaster>` in layout | `<UNotifications>` |

**Files to delete after migration:**

- `app/components/ui/button/`
- `app/components/ui/card/`
- `app/components/ui/dialog/`
- `app/components/ui/drawer/`
- `app/components/ui/input/`
- `app/components/ui/label/`
- `app/components/ui/skeleton/`
- `app/lib/utils.ts` and `app/lib/`
- `components.json`

**Dependencies to remove from `package.json`:**
`shadcn-nuxt`, `class-variance-authority`, `vaul-vue`, `vue-sonner`, `clsx`, `tailwind-merge`, `radix-vue`, `tailwindcss-animate`, `reka-ui`

**Config to clean up:**

- Remove `shadcn-nuxt` from `modules` array in `nuxt.config.ts`
- Remove `shadcn: { ... }` block from `nuxt.config.ts`
- Remove shadcn CSS variables from `app/assets/css/tailwind.css`

**Constraint:** `app-nuxtui-layer/` must not be modified.

---

## Architecture

The application uses a multi-layer Nuxt setup:

```
nuxt.config.ts
├── extends: ['./app-nuxtui-layer']   ← DO NOT TOUCH
└── app/                              ← migration target
    ├── components/
    │   ├── ui/                       ← shadcn primitives (to be deleted)
    │   └── *.vue                     ← consumer components (to be updated)
    ├── pages/                        ← consumer pages (to be updated)
    ├── layouts/default.vue           ← Toaster → UNotifications
    ├── assets/css/tailwind.css       ← remove shadcn CSS vars
    └── lib/utils.ts                  ← delete after migration
```

NuxtUI components are auto-imported by the `@nuxt/ui` module — no explicit imports are needed in consumer files. The migration is purely a find-and-replace of component tags, import statements, prop mappings, and slot restructuring.

### Migration Execution Order

The migration must be done in dependency order to avoid broken intermediate states:

1. **Leaf primitives first** — Input, Label, Skeleton (used inside other components)
2. **Composite components** — Button, Card (used across many pages)
3. **Overlay components** — Dialog → UModal, Drawer → USlideover (complex slot restructuring)
4. **Toast system** — vue-sonner → useToast (affects layout + 3 consumer components)
5. **Cleanup** — delete `app/components/ui/`, `app/lib/`, update `nuxt.config.ts`, `tailwind.css`, `package.json`

---

## Components and Interfaces

### 1. Button → UButton

**Consumer files:** `app/pages/cart.vue`, `app/pages/contact-us.vue`, `app/pages/checkout.vue`

**Before:**

```vue
<script setup>
  import { Button } from '@/components/ui/button'
</script>
<template>
  <Button variant="link" @click="navigateTo('/')">Find Treatment</Button>
  <Button class="w-full h-14 bg-[#B6CE00] ..." @click="handleCheckout"
    >PAY NOW</Button
  >
</template>
```

**After:**

```vue
<template>
  <UButton variant="link" @click="navigateTo('/')">Find Treatment</UButton>
  <UButton class="w-full h-14 bg-[#B6CE00] ..." @click="handleCheckout"
    >PAY NOW</UButton
  >
</template>
```

**Prop mapping notes:**

- `variant="link"` → `variant="link"` (NuxtUI supports this)
- `variant="outline"` → `variant="outline"` (supported)
- `size="sm"` → `size="sm"` (supported)
- Custom `class` overrides pass through unchanged
- Remove all `import { Button }` statements — UButton is auto-imported

### 2. Card → UCard

**Consumer files:** `app/components/CategoryCard.vue` (already uses `UCard`), `app/components/VoucherCard.vue` (already uses `UCard`)

Both card consumer components already use `UCard` directly — no migration needed for these. The `app/components/ui/card/` directory can be deleted immediately.

### 3. Dialog → UModal

**Consumer files:** `app/components/LoginModal.vue`

**Before:**

```vue
<script setup>
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
  } from '@/components/ui/dialog'
  import { Label } from '@/components/ui/label'
  import { Input } from '@/components/ui/input'
  import { Button } from '@/components/ui/button'
</script>
<template>
  <Dialog :open="ui.isLoginModalOpen" @update:open="ui.closeLogin">
    <DialogContent
      class="sm:max-w-[400px] rounded-3xl p-8 bg-slate-50 dark:bg-slate-950"
    >
      <DialogHeader>
        <DialogTitle class="text-2xl font-black ...">Sign In</DialogTitle>
        <DialogDescription>...</DialogDescription>
      </DialogHeader>
      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <Label>Email</Label>
          <Input
            v-model="credentials.username"
            type="email"
            placeholder="..."
          />
        </div>
        ...
      </div>
      <DialogFooter class="flex flex-col gap-3">
        <Button class="w-full ..." @click="handleLogin">Sign In</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
```

**After:**

```vue
<template>
  <UModal v-model="ui.isLoginModalOpen" :ui="{ container: 'items-center' }">
    <UCard
      class="sm:max-w-[400px] rounded-3xl p-8 bg-slate-50 dark:bg-slate-950"
    >
      <template #header>
        <h2 class="text-2xl font-black text-slate-800 dark:text-slate-50">
          Sign In
        </h2>
        <p class="text-sm text-gray-500">
          Please enter your email and password to sign in.
        </p>
      </template>
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Email</label>
          <UInput
            v-model="credentials.username"
            type="email"
            placeholder="nama@email.com"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Password</label>
          <UInput v-model="credentials.password" type="password" />
        </div>
      </div>
      <template #footer>
        <div class="flex flex-col gap-3">
          <UButton class="w-full h-12" color="primary" @click="handleLogin"
            >Sign In</UButton
          >
          <p class="text-sm text-center">
            Don't have an account?
            <NuxtLink
              to="/register"
              class="text-blue-600 font-bold"
              @click="ui.closeLogin"
              >Register Now</NuxtLink
            >
          </p>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
```

**Key changes:**

- `<Dialog :open="..." @update:open="...">` → `<UModal v-model="ui.isLoginModalOpen">`
- `ui.closeLogin` must set `ui.isLoginModalOpen = false` (the store already has this)
- `DialogContent` wrapper replaced by `UCard` inside `UModal`
- `DialogHeader/Footer` replaced by `#header` / `#footer` slots on `UCard`
- `DialogTitle/Description` replaced by plain HTML inside `#header`
- `Label` → native `<label>`
- `Input` → `UInput`
- `Button` → `UButton`

### 4. Drawer → USlideover

**Consumer files:** `app/components/BookingDrawer.vue`

**Before:**

```vue
<script setup>
  import { Drawer, DrawerContent, DrawerClose } from '@/components/ui/drawer'
</script>
<template>
  <ClientOnly>
    <Drawer v-model:open="bookingStore.isOpen">
      <DrawerContent class="bg-slate-50 dark:bg-slate-950">
        <div class="mx-auto w-full px-4">
          <div class="flex justify-between items-center py-4 border-b mb-4">
            ...
            <DrawerClose>
              <UIcon
                name="i-material-symbols-close"
                class="w-5 h-5 text-slate-300"
              />
            </DrawerClose>
          </div>
          ...
        </div>
      </DrawerContent>
    </Drawer>
  </ClientOnly>
</template>
```

**After:**

```vue
<template>
  <ClientOnly>
    <USlideover
      v-model="bookingStore.isOpen"
      side="bottom"
      :ui="{ width: 'w-full max-w-full' }"
    >
      <div class="bg-slate-50 dark:bg-slate-950 h-full mx-auto w-full px-4">
        <div class="flex justify-between items-center py-4 border-b mb-4">
          ...
          <button @click="bookingStore.isOpen = false">
            <UIcon
              name="i-material-symbols-close"
              class="w-5 h-5 text-slate-300"
            />
          </button>
        </div>
        ...
      </div>
    </USlideover>
  </ClientOnly>
</template>
```

**Key changes:**

- `<Drawer v-model:open="...">` → `<USlideover v-model="...">`
- `<DrawerContent>` removed — content goes directly in `USlideover` default slot
- `<DrawerClose>` replaced by a plain `<button>` that sets `bookingStore.isOpen = false`
- Remove all drawer imports from script

### 5. Input → UInput

**Consumer files:** `app/components/LoginModal.vue` (handled in Dialog section above)

No other consumer files use the shadcn `<Input>` component directly — the `ParticularsSection.vue` and `register.vue` already use native `<input>` elements.

### 6. Label → native `<label>`

**Consumer files:** `app/components/LoginModal.vue` (handled in Dialog section above)

Replace `<Label>` with `<label class="text-sm font-medium leading-none">` to preserve the same visual styling.

### 7. Skeleton → USkeleton

**Consumer files:** Search reveals no consumer files currently import `<Skeleton>` from `@/components/ui/skeleton`. The directory can be deleted directly.

### 8. Toast: vue-sonner → useToast

**Consumer files with `toast()` calls:**

- `app/components/CartRecords.vue` — 2 calls (voucher quantity validation errors)
- `app/components/ParticularsSection.vue` — 3 calls (profile save success/error, referral copy)
- `app/components/StaffStep.vue` — 2 calls (cart save success/error)
- `app/layouts/default.vue` — `<Toaster>` component

**Variant mapping:**
| vue-sonner | NuxtUI useToast |
|---|---|
| `variant: 'destructive'` | `color: 'red'` |
| `variant: 'success'` | `color: 'green'` |
| `variant: 'default'` (or omitted) | `color: 'primary'` (or omit) |

**Before (CartRecords.vue):**

```vue
<script setup>
  import { toast } from 'vue-sonner'
  ...
  toast({ title: "Error", description: "Maximum purchase is 5 sets of voucher.", variant: "destructive" })
</script>
```

**After:**

```vue
<script setup>
  const toast = useToast()
  ...
  toast.add({ title: "Error", description: "Maximum purchase is 5 sets of voucher.", color: 'red' })
</script>
```

**Layout change (`app/layouts/default.vue`):**

- Remove `import { Toaster } from 'vue-sonner'`
- Remove `<Toaster position="top-center" rich-colors close-button />`
- Add `<UNotifications />` in its place (NuxtUI's global toast container)

---

## Data Models

### UIStore (`app/stores/ui.ts`)

The `isLoginModalOpen` boolean is already used as the modal open state. `UModal v-model` binds directly to this reactive property. The `openLogin()` / `closeLogin()` methods remain unchanged.

### BookingStore (`app/stores/booking.ts`)

The `isOpen` boolean is already used as the drawer open state. `USlideover v-model` binds directly to `bookingStore.isOpen`. No store changes required.

### Toast payload mapping

```typescript
// Before (vue-sonner shape)
interface SonnerToast {
  title: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
}

// After (NuxtUI useToast shape)
interface NuxtUIToast {
  title: string
  description?: string
  color?: 'red' | 'green' | 'primary' | 'gray' | ...
  timeout?: number
}
```

### CSS Variable Cleanup

The following shadcn CSS custom properties in `app/assets/css/tailwind.css` will be removed entirely:

```css
/* REMOVE: :root { --background, --foreground, --card, --card-foreground,
   --popover, --popover-foreground, --primary, --primary-foreground,
   --secondary, --secondary-foreground, --muted, --muted-foreground,
   --accent, --accent-foreground, --destructive, --destructive-foreground,
   --border, --input, --ring, --chart-1..5, --radius } */
/* REMOVE: .dark { ... } (same variables) */
```

The heading styles (`h1`–`h6`) and `input, optgroup, select, textarea` base styles are **kept** as they are not shadcn-specific.

---

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Modal open state binding

_For any_ boolean value of `ui.isLoginModalOpen`, the `UModal`'s rendered visibility should equal that boolean value — i.e., the `v-model` binding correctly reflects the store state in both directions.

**Validates: Requirements 3.4, 13.3**

### Property 2: Slideover open state binding

_For any_ boolean value of `bookingStore.isOpen`, the `USlideover`'s rendered visibility should equal that boolean value — i.e., the `v-model` binding correctly reflects the store state in both directions.

**Validates: Requirements 4.4, 13.2**

### Property 3: Toast variant-to-color mapping

_For any_ toast call that previously used `variant: 'destructive'`, the migrated `useToast().add()` call SHALL use `color: 'red'`. _For any_ toast call that previously used `variant: 'success'`, the migrated call SHALL use `color: 'green'`.

**Validates: Requirements 8.2**

### Property 4: Booking step navigation invariant

_For any_ current step index `i` and any target step index `j` in the booking flow steps array, `canNavigateTo(j)` SHALL return `true` if and only if `j < i` (backward navigation is always allowed; forward navigation beyond the current step is not).

**Validates: Requirements 13.2**

### Property 5: Voucher quantity bounds invariant

_For any_ voucher cart item with `voucher_normal_quantity` N, after any sequence of add/subtract operations, the item's `quantity` SHALL remain within the range `[N, N * 5]`.

**Validates: Requirements 13.4**

---

## Error Handling

### Component Resolution Errors

If a shadcn component import is left in place after its `app/components/ui/` directory is deleted, Nuxt will throw a module resolution error at build time. The migration must be completed atomically per component — update all consumers before deleting the source directory.

### UModal v-model vs :open

`UModal` uses `v-model` (a boolean ref), not `:open` + `@update:open`. The `ui.isLoginModalOpen` ref in the UIStore must be directly mutable. If `closeLogin()` sets it to `false`, the `v-model` binding will close the modal correctly.

### USlideover side prop

The original `vaul-vue` Drawer opened from the bottom. `USlideover` defaults to opening from the right. To preserve the bottom-sheet UX for the booking drawer, set `side="bottom"` on `USlideover` and adjust height/width styles accordingly.

### CSS Variable Conflicts

After removing shadcn CSS variables, any component that referenced `bg-card`, `text-card-foreground`, `border-input`, etc. via Tailwind's `theme()` or direct CSS var usage will lose those values. NuxtUI provides its own design tokens — verify that no remaining component uses shadcn-specific CSS variable names after cleanup.

### tailwindcss-animate

The `tailwindcss-animate` package is used by shadcn components for enter/leave animations. After removing all shadcn components, check whether any remaining component references `animate-in`, `fade-in`, `slide-in-from-*` classes. If none remain, remove the package and its `require('tailwindcss-animate')` plugin entry from `tailwind.config.ts`.

### reka-ui

`reka-ui` is a direct dependency used by the shadcn Label, Button, and Dialog components. After migration it should have no remaining consumers in `app/`. Verify before removing from `package.json`.

---

## Testing Strategy

This migration is a refactoring task — the primary testing approach is functional verification rather than property-based testing. PBT applies to a small subset of the logic (state bindings, navigation invariants, quantity bounds).

### Unit / Component Tests

For each migrated component, verify:

1. **LoginModal** — renders `UModal`, opens when `ui.isLoginModalOpen` is `true`, closes when set to `false`, form fields bind correctly
2. **BookingDrawer** — renders `USlideover`, opens/closes with `bookingStore.isOpen`, step navigation `canNavigateTo` logic is correct
3. **CartRecords** — `handleAdd`/`handleSubtract` enforce quantity bounds, `useToast().add()` is called with correct `color` on violations
4. **StaffStep** — `useToast().add()` called with `color: 'green'` on success, `color: 'red'` on error
5. **ParticularsSection** — `useToast().add()` called with correct colors for success/error/clipboard scenarios

### Property-Based Tests

Using [fast-check](https://github.com/dubzzz/fast-check) (TypeScript-compatible PBT library):

**Property 1 & 2 — Modal/Slideover v-model binding:**
Generate random boolean values; mount the component with that value; assert the overlay's visibility matches.
Minimum 100 iterations. Tag: `Feature: shadcn-to-nuxtui-migration, Property 1/2: open state binding`

**Property 3 — Toast variant mapping:**
Generate random toast payloads with arbitrary `variant` values; run the mapping function; assert `color` is `'red'` for `'destructive'` and `'green'` for `'success'`.
Minimum 100 iterations. Tag: `Feature: shadcn-to-nuxtui-migration, Property 3: toast variant-to-color mapping`

**Property 4 — Step navigation invariant:**
Generate random pairs of `(currentStepIndex, targetStepIndex)` from `[0, steps.length-1]`; assert `canNavigateTo` returns `true` iff `targetIndex < currentIndex`.
Minimum 100 iterations. Tag: `Feature: shadcn-to-nuxtui-migration, Property 4: booking step navigation invariant`

**Property 5 — Voucher quantity bounds:**
Generate random voucher items with random `voucher_normal_quantity` N and random sequences of add/subtract operations; assert quantity stays in `[N, N*5]` after each operation.
Minimum 100 iterations. Tag: `Feature: shadcn-to-nuxtui-migration, Property 5: voucher quantity bounds invariant`

### Smoke / Build Tests

- `nuxt build` completes with no errors after migration
- No TypeScript errors (`nuxt typecheck`)
- No remaining imports from `@/components/ui/` in any `.vue` file
- No remaining imports from `vue-sonner` in any file
- `app/components/ui/` directory does not exist
- `app/lib/utils.ts` does not exist
- `components.json` does not exist
- `shadcn-nuxt`, `class-variance-authority`, `vaul-vue`, `vue-sonner`, `clsx`, `tailwind-merge`, `radix-vue` not present in `package.json`

### Integration / Manual Verification

- Login modal opens and closes correctly
- Booking drawer opens from bottom, steps navigate correctly, closes on X
- Toast notifications appear for cart quantity violations, profile save, staff selection
- Dark mode toggle still works
- NavBar and Footer from `app-nuxtui-layer/` render without errors
- All pages load without console errors
