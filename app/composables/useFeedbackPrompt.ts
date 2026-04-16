// app/composables/useFeedbackPrompt.ts
// Requirements: 9.1, 9.2

/**
 * Subscribes to feedback prompt events for the authenticated customer.
 *
 * - Subscribes to `private-customer.{customerId}` for `FeedbackPrompt` events (Req 9.1)
 * - On event receipt, sets `showFeedbackForm` to true and stores the `sessionId` (Req 9.2)
 * - Exposes `hideFeedbackForm` to dismiss the modal
 *
 * Requirements: 9.1, 9.2
 */
export const useFeedbackPrompt = () => {
  const { $echo } = useNuxtApp()
  const authStore = useAuthStore()

  const showFeedbackForm = ref(false)
  const sessionId = ref<number | null>(null)

  // Derive customer ID from auth store
  const customerId = computed<number | null>(() => {
    const user = authStore.user as { customer?: { id: number } } | null
    return user?.customer?.id ?? null
  })

  // ── Helpers ────────────────────────────────────────────────────────────────

  const hideFeedbackForm = () => {
    showFeedbackForm.value = false
    sessionId.value = null
  }

  // ── WebSocket subscription ─────────────────────────────────────────────────

  let echoChannel: ReturnType<typeof $echo.private> | null = null

  const subscribeToChannel = () => {
    if (!customerId.value || !$echo) return

    const channelName = `private-customer.${customerId.value}`

    echoChannel = $echo.private(channelName)

    echoChannel.listen('FeedbackPrompt', (event: { session_id: number }) => {
      sessionId.value = event.session_id
      showFeedbackForm.value = true
    })
  }

  const unsubscribeFromChannel = () => {
    if (!customerId.value || !$echo) return

    const channelName = `private-customer.${customerId.value}`
    $echo.leaveChannel(channelName)
    echoChannel = null
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  onMounted(() => {
    subscribeToChannel()
  })

  onUnmounted(() => {
    unsubscribeFromChannel()
  })

  // Re-subscribe if the customer ID changes (e.g., after login)
  watch(customerId, (newId, oldId) => {
    if (oldId) {
      unsubscribeFromChannel()
    }
    if (newId) {
      subscribeToChannel()
    }
  })

  return { showFeedbackForm, sessionId, hideFeedbackForm }
}
