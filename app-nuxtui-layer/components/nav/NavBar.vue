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
  <nav class="container mx-auto">
    <div class="flex h-full items-center justify-between py-4">
      <div style="grid-area: logo" class="flex justify-center">
        <TheLogo />
      </div>
      <div
        data-pg-name="Hamburger"
        style="grid-area: hamburger"
        class="sm:hidden"
      >
        <NavHamburger @click="isMobileMenuOpen = true" />
      </div>
      <div
        data-pg-name="NavBarPrimary"
        style="grid-area: primary-nav"
        class="hidden sm:flex"
      >
        <NavPrimary class="sm:w-full" />
      </div>
      <div v-if="isLoggedIn" data-pg-name="Profile" class="flex space-x-1">
        <ProfileActions class="hidden sm:flex" />
        <NavSecondary />
      </div>
      <UButton v-else class="font-bold my-4 sm:my-2" @click="ui.openLogin">{{ t('nav.signIn') }}</UButton>
    </div>
    <USlideover
      v-model="isMobileMenuOpen"
      data-pg-name="NavBarSecondary"
      style="grid-area: primary-nav"
      class="w-80 sm:hidden"
      side="left"
    >
      <NavPrimary class="m-4" />
    </USlideover>
  </nav>
</template>
<style scoped>
  .navbar-grid {
    display: grid;
    grid-template-columns: auto auto auto;
    grid-template-rows: auto auto;
    grid-template-areas: 'hamburger logo profile' 'search search search';
    gap: 20px;
  }
  @media (min-width: 640px) {
    .navbar-grid {
      display: grid;
      grid-template-columns: auto auto auto;
      grid-template-rows: auto auto;
      grid-template-areas: 'logo search profile' 'primary-nav primary-nav primary-nav';
      gap: 20px;
    }
  }
  @media (min-width: 1280px) {
    .navbar-grid {
      display: grid;
      grid-template-columns: auto auto auto auto;
      grid-template-rows: auto;
      grid-template-areas: 'logo primary-nav search profile';
    }
  }
</style>
