<script setup lang="ts">
  import { Toaster } from 'vue-sonner'
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

  // 1. Import your auth store
  const auth = useAuthStore();

  // 2. (Optional but recommended) If you need to keep properties reactive 
  // when destructuring, use storeToRefs
  const { user } = storeToRefs(auth)
  
  useHeadAndMeta(pageMeta)
  useOgImage()
</script>

<template>
  <div>
    <!-- <div class="container mx-auto"> -->
    <div
      class="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50"
    >
      <NavBar :user="user" />
      <main>
        <slot />
        <Toaster position="top-center" rich-colors close-button />
        <BookingDrawer />
      </main>
      <LoginModal />
      <TheFooter />
    </div>
    <!-- </div> -->
  </div>
</template>
<style></style>
