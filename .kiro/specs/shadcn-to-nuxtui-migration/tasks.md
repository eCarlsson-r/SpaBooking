# Tasks: shadcn-to-nuxtui-migration

## Task List

- [x] 1. Migrate Button component
  - [x] 1.1 Remove `import { Button }` from `app/pages/cart.vue` and replace `<Button>` with `<UButton>`
  - [x] 1.2 Remove `import { Button }` from `app/pages/contact-us.vue` and replace `<Button>` with `<UButton>`
  - [x] 1.3 Remove `import { Button }` from `app/pages/checkout.vue` and replace `<Button>` with `<UButton>`
  - [x] 1.4 Delete `app/components/ui/button/` directory

- [x] 2. Delete unused Card directory
  - [x] 2.1 Confirm `CategoryCard.vue` and `VoucherCard.vue` already use `UCard` (no imports from `@/components/ui/card`)
  - [x] 2.2 Delete `app/components/ui/card/` directory

- [x] 3. Migrate Dialog to UModal (LoginModal)
  - [x] 3.1 Rewrite `app/components/LoginModal.vue` to use `<UModal v-model="ui.isLoginModalOpen">` with `UCard` slots for header/footer
  - [x] 3.2 Replace `<Label>` with native `<label>` inside LoginModal
  - [x] 3.3 Replace `<Input>` with `<UInput>` inside LoginModal
  - [x] 3.4 Replace `<Button>` with `<UButton>` inside LoginModal
  - [x] 3.5 Remove all shadcn dialog/label/input/button imports from LoginModal script
  - [x] 3.6 Delete `app/components/ui/dialog/` directory
  - [x] 3.7 Delete `app/components/ui/label/` directory
  - [x] 3.8 Delete `app/components/ui/input/` directory

- [x] 4. Migrate Drawer to USlideover (BookingDrawer)
  - [x] 4.1 Rewrite `app/components/BookingDrawer.vue` to use `<USlideover v-model="bookingStore.isOpen" side="bottom">`
  - [x] 4.2 Replace `<DrawerContent>` with direct content in USlideover default slot
  - [x] 4.3 Replace `<DrawerClose>` with a plain `<button @click="bookingStore.isOpen = false">`
  - [x] 4.4 Remove all drawer imports from BookingDrawer script
  - [x] 4.5 Delete `app/components/ui/drawer/` directory

- [x] 5. Delete unused Skeleton directory
  - [x] 5.1 Confirm no consumer file imports `<Skeleton>` from `@/components/ui/skeleton`
  - [x] 5.2 Delete `app/components/ui/skeleton/` directory

- [x] 6. Migrate toast notifications from vue-sonner to useToast
  - [x] 6.1 Update `app/components/CartRecords.vue`: remove `import { toast } from 'vue-sonner'`, replace `toast({...})` calls with `useToast().add({...})` using `color: 'red'` for destructive
  - [x] 6.2 Update `app/components/ParticularsSection.vue`: remove vue-sonner import, replace all `toast({...})` calls with `useToast().add({...})` with correct color mappings
  - [x] 6.3 Update `app/components/StaffStep.vue`: remove vue-sonner import, replace `toast({...})` calls with `useToast().add({...})` with correct color mappings
  - [x] 6.4 Update `app/layouts/default.vue`: remove `import { Toaster } from 'vue-sonner'`, remove `<Toaster .../>`, add `<UNotifications />`

- [x] 7. Remove shadcn configuration from nuxt.config.ts
  - [x] 7.1 Remove `'shadcn-nuxt'` from the `modules` array in `nuxt.config.ts`
  - [x] 7.2 Remove the `shadcn: { ... }` configuration block from `nuxt.config.ts`

- [x] 8. Clean up CSS variables and global styles
  - [x] 8.1 Remove all shadcn CSS variable declarations (`:root { --background ... }` and `.dark { ... }` blocks) from `app/assets/css/tailwind.css`
  - [x] 8.2 Verify no remaining component references shadcn-specific CSS variable names (`bg-card`, `text-card-foreground`, `border-input`, `bg-muted`, etc.)

- [x] 9. Remove app/lib/utils.ts and app/lib/ directory
  - [x] 9.1 Verify no remaining file imports from `@/lib/utils` or `~/lib/utils`
  - [x] 9.2 Delete `app/lib/utils.ts` and the `app/lib/` directory

- [x] 10. Remove shadcn and related dependencies from package.json
  - [x] 10.1 Remove `shadcn-nuxt` from `devDependencies`
  - [x] 10.2 Remove `class-variance-authority` from `dependencies`
  - [x] 10.3 Remove `vaul-vue` from `dependencies`
  - [x] 10.4 Remove `vue-sonner` from `dependencies`
  - [x] 10.5 Remove `clsx` from `dependencies`
  - [x] 10.6 Remove `tailwind-merge` from `dependencies`
  - [x] 10.7 Remove `radix-vue` from `dependencies`
  - [x] 10.8 Remove `reka-ui` from `dependencies` (verify no remaining usage first)
  - [x] 10.9 Remove `tailwindcss-animate` from `devDependencies` (verify no remaining usage first)
  - [x] 10.10 Delete `components.json` from project root
  - [x] 10.11 Run `npm install` to update `package-lock.json`

- [x] 11. Verify build and runtime correctness
  - [x] 11.1 Run `nuxt build` and confirm it completes with no errors
  - [x] 11.2 Confirm no TypeScript errors (`nuxt typecheck` or check diagnostics)
  - [x] 11.3 Confirm no `.vue` file contains an import from `@/components/ui/`
  - [x] 11.4 Confirm no file contains an import from `vue-sonner`
  - [x] 11.5 Confirm `app/components/ui/` directory no longer exists
