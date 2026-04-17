<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const SNOOZE_KEY = 'pwa-install-snoozed'
const SNOOZE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in ms

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const { t } = useI18n()

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
const canShow = ref(false)

function isSnoozed(): boolean {
  const snoozed = localStorage.getItem(SNOOZE_KEY)
  return snoozed !== null && Date.now() - Number(snoozed) < SNOOZE_DURATION
}

function handleBeforeInstallPrompt(e: Event) {
  e.preventDefault()
  deferredPrompt.value = e as BeforeInstallPromptEvent
  if (!isSnoozed()) {
    canShow.value = true
  }
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
})

async function handleInstall() {
  if (!deferredPrompt.value) return
  await deferredPrompt.value.prompt()
  canShow.value = false
  deferredPrompt.value = null
}

function handleDismiss() {
  localStorage.setItem(SNOOZE_KEY, String(Date.now()))
  canShow.value = false
}
</script>

<template>
  <div
    v-if="canShow && deferredPrompt"
    class="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between bg-blue-600 px-4 py-3 text-white shadow-md"
    role="banner"
  >
    <span class="text-sm font-medium">{{ t('pwa.installPrompt') }}</span>
    <div class="flex gap-2">
      <button
        class="rounded bg-white px-3 py-1 text-sm font-semibold text-blue-600 hover:bg-blue-50"
        @click="handleInstall"
      >
        {{ t('pwa.installAccept') }}
      </button>
      <button
        class="rounded border border-white px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700"
        @click="handleDismiss"
      >
        {{ t('pwa.installDismiss') }}
      </button>
    </div>
  </div>
</template>
