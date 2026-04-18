<script setup lang="ts">
/**
 * UpdatePrompt.vue
 *
 * Non-blocking toast notification shown when a new service worker
 * is waiting. User can click "Refresh to update" to activate the
 * new SW and reload the page.
 *
 * Requirement: 1.4
 */
const { $pwa } = useNuxtApp()
const { t } = useI18n()

const show = computed(() => {
  return !!$pwa?.needRefresh
})

function applyUpdate() {
  $pwa?.updateServiceWorker()
}

function dismiss() {
  // Simply hide — the prompt will reappear on next navigation
  if ($pwa) {
    $pwa.needRefresh = false
  }
}
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="show"
      class="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50
             bg-sky-600 text-white rounded-xl shadow-xl px-4 py-3
             flex items-center justify-between gap-3"
    >
      <span class="text-sm font-medium">{{ t('pwa.updateAvailable') }}</span>
      <div class="flex gap-2 shrink-0">
        <button
          class="text-xs underline opacity-80 hover:opacity-100"
          @click="dismiss"
        >
          ✕
        </button>
        <button
          class="bg-white text-sky-700 text-xs font-bold px-3 py-1 rounded-lg
                 hover:bg-sky-50 transition-colors"
          @click="applyUpdate"
        >
          {{ t('pwa.updateRefresh') }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
