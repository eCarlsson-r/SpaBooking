<script setup lang="ts">
  import { storeToRefs } from 'pinia'

  const route = useRoute()

  const pageMeta = computed(() => {
    return {
      title: route.meta.title,
      description: route.meta.description,
      ogImage: route.meta.ogImage,
      canonicalUrl: route.meta.canonicalUrl || route.fullPath,
      generator: route.meta.generator,
      tags: route.meta.tags,
    }
  })
  
  useHeadAndMeta(pageMeta)
  useOgImage()
</script>

<template>
  <div>
    <!-- <div class="container mx-auto"> -->
    <div
      class="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50"
    >
      <NavBar class="z-50" />
      <main class="flex-grow">
        <slot />
        <UNotifications />
        <BookingDrawer />
      </main>
      <LoginModal />
      <AiChatWidget />
      <TheFooter class="w-full z-50 sm:fixed sm:bottom-0" />
      <PwaOfflineIndicator />
      <PwaSyncNotification />
    </div>
    <!-- </div> -->
  </div>
</template>
<style></style>
