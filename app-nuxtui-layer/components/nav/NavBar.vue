<script setup lang="ts">
  const {isMobileMenuOpen} = useMobileMenu();
  const { t } = useI18n()

  // 1. Import your auth store
  const auth = useAuthStore();

  // 2. (Optional but recommended) If you need to keep properties reactive 
  // when destructuring, use storeToRefs
  const { isLoggedIn } = storeToRefs(auth)

  const ui = useUIStore();
</script>
<template>
  <nav class="container mx-auto px-4">
    <div class="flex h-full items-center justify-between py-4">
      <div class="flex items-center space-x-4">
        <NavHamburger class="sm:hidden" @click="isMobileMenuOpen = true" />
        <TheLogo />
      </div>

      <div class="hidden sm:flex flex-1 justify-center mx-8">
        <NavPrimary />
      </div>

      <div class="flex items-center space-x-2 sm:space-x-4">
        <LayoutLanguageSwitcher class="hidden sm:flex" />
        <div v-if="isLoggedIn" class="flex space-x-1 items-center">
          <ProfileActions class="hidden sm:flex" />
          <NavSecondary />
        </div>
        <UButton v-else class="font-bold my-4 sm:my-2" @click="ui.openLogin">{{ t('nav.signIn') }}</UButton>
      </div>
    </div>
    
    <USlideover
      v-model="isMobileMenuOpen"
      class="w-80 sm:hidden"
      side="left"
    >
      <div class="p-4 flex flex-col h-full bg-white dark:bg-neutral-900">
        <div class="flex justify-between items-center mb-8">
          <TheLogo />
          <LayoutLanguageSwitcher />
          <UButton
            color="gray"
            variant="ghost"
            icon="i-material-symbols-close"
            @click="isMobileMenuOpen = false"
          />
        </div>
        <NavPrimary />
      </div>
    </USlideover>
  </nav>
</template>
<style scoped>
</style>
