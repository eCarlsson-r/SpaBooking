<script setup lang="ts">
const { isOnline, pendingCount } = useOfflineQueue()
const { t } = useI18n()
</script>

<template>
  <div
    v-if="!isOnline"
    class="fixed bottom-0 left-0 right-0 z-[100] bg-amber-400 text-amber-900 text-sm font-medium text-center py-2 px-4"
    role="status"
    aria-live="polite"
  >
    {{ t('offline.banner', { count: pendingCount }) }}
  </div>
</template>
