// app/composables/useReschedulingNotifications.ts
// Requirements: 7.1, 7.2, 7.5, 7.6
import type { ConflictRecord } from '~~/types/ai'

const POLLING_INTERVAL_MS = 30_000

/**
 * Subscribes to rescheduling suggestion events for the authenticated customer.
 *
 * - On mount, fetches persisted suggestions via GET /api/conflicts/pending (Req 7.6)
 * - Subscribes to `private-customer.{customerId}` for `ReschedulingSuggestion` events (Req 7.1)
 * - Appends incoming events to the notifications list, deduplicated by id (Req 7.2)
 * - Falls back to 30-second polling when WebSocket disconnects (Req 7.5)
 *
 * Requirements: 7.1, 7.2, 7.5, 7.6
 */
export const useReschedulingNotifications = () => {
  const { $api, $echo } = useNuxtApp()
  const authStore = useAuthStore()

  const notifications = ref<ConflictRecord[]>([])
  const isLoading = ref(false)

  // Derive customer ID from auth store
  const customerId = computed<number | null>(() => {
    const user = authStore.user as { customer?: { id: number } } | null
    return user?.customer?.id ?? null
  })

  // ── Helpers ────────────────────────────────────────────────────────────────

  /** Append a suggestion only if it is not already in the list (deduplicate by id). */
  const appendNotification = (suggestion: ConflictRecord) => {
    const exists = notifications.value.some((n) => n.id === suggestion.id)
    if (!exists) {
      notifications.value.push(suggestion)
    }
  }

  /** Fetch persisted (offline) suggestions from the backend. */
  const fetchPending = async () => {
    if (!customerId.value) return

    isLoading.value = true
    try {
      const data = await $api<ConflictRecord[]>('/conflicts/pending')
      const pending = data ?? []
      pending.forEach(appendNotification)
    } catch {
      // Fail silently — polling will retry
    } finally {
      isLoading.value = false
    }
  }

  // ── WebSocket subscription ─────────────────────────────────────────────────

  let pollingTimer: ReturnType<typeof setInterval> | null = null
  let echoChannel: ReturnType<typeof $echo.private> | null = null

  const stopPolling = () => {
    if (pollingTimer !== null) {
      clearInterval(pollingTimer)
      pollingTimer = null
    }
  }

  const startPolling = () => {
    if (pollingTimer !== null) return // already running
    pollingTimer = setInterval(fetchPending, POLLING_INTERVAL_MS)
  }

  const subscribeToChannel = () => {
    if (!customerId.value || !$echo) return

    const channelName = `private-customer.${customerId.value}`

    echoChannel = $echo.private(channelName)

    echoChannel
      .listen('ReschedulingSuggestion', (event: ConflictRecord) => {
        appendNotification(event)
      })
      .error(() => {
        // WebSocket error — fall back to polling (Req 7.5)
        startPolling()
      })

    // Monitor connection state for disconnect fallback
    if ($echo.connector?.pusher) {
      $echo.connector.pusher.connection.bind('disconnected', startPolling)
      $echo.connector.pusher.connection.bind('connected', stopPolling)
    }
  }

  const unsubscribeFromChannel = () => {
    if (!customerId.value || !$echo) return

    const channelName = `private-customer.${customerId.value}`
    $echo.leaveChannel(channelName)
    echoChannel = null

    if ($echo.connector?.pusher) {
      $echo.connector.pusher.connection.unbind('disconnected', startPolling)
      $echo.connector.pusher.connection.unbind('connected', stopPolling)
    }
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  onMounted(async () => {
    // Fetch persisted suggestions first (Req 7.6)
    await fetchPending()
    // Then subscribe for live events (Req 7.1)
    subscribeToChannel()
  })

  onUnmounted(() => {
    unsubscribeFromChannel()
    stopPolling()
  })

  // Re-subscribe if the customer ID changes (e.g., after login)
  watch(customerId, async (newId, oldId) => {
    if (oldId) {
      unsubscribeFromChannel()
      stopPolling()
    }
    if (newId) {
      await fetchPending()
      subscribeToChannel()
    }
  })

  return { notifications, isLoading }
}
