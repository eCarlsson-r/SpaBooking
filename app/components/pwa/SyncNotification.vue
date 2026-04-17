<script setup lang="ts">
const { t } = useI18n()
const toast = useToast()

interface SyncSuccessMessage {
  type: 'SYNC_SUCCESS'
  operationId: string
}

interface SyncFailedMessage {
  type: 'SYNC_FAILED'
  operationId: string
  status: number
  url: string
}

type SyncMessage = SyncSuccessMessage | SyncFailedMessage

function handleMessage(event: MessageEvent<SyncMessage>) {
  const { data } = event
  if (!data || !data.type) return

  if (data.type === 'SYNC_SUCCESS') {
    toast.add({
      title: t('offline.backOnline'),
      color: 'green',
    })
  } else if (data.type === 'SYNC_FAILED') {
    toast.add({
      title: t('offline.syncFailed', { operation: data.url }),
      color: 'red',
    })
  }
}

onMounted(() => {
  if (typeof navigator === 'undefined' || !navigator.serviceWorker) return
  navigator.serviceWorker.addEventListener('message', handleMessage)
})

onUnmounted(() => {
  if (typeof navigator === 'undefined' || !navigator.serviceWorker) return
  navigator.serviceWorker.removeEventListener('message', handleMessage)
})
</script>

<template>
  <span />
</template>
