<script setup lang="ts">
  const { navsPrimary } = useNavMenu()
  const { isMobileMenuOpen } = useMobileMenu()
  const localePath = useLocalePath()
</script>
<template>
  <div
    class="flex flex-col justify-center sm:space-y-0 space-y-4 sm:flex sm:flex-row sm:items-center sm:space-x-4"
  >
    <ULink
      v-for="(nav, index) in navsPrimary"
      :key="index"
      :label="nav.title"
      :to="localePath(nav.to)"
      variant="link"
      class="hover:text-primary underline-offset-8"
      color="gray"
      active-class="text-primary underline"
      exact
      @click="isMobileMenuOpen = false"
      >{{ nav.title }}</ULink
    >
  </div>
</template>
<style scoped></style>
