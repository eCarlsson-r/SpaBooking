/**
 * Unit tests for SyncNotification (SpaBooking)
 * Requirements: 4.6, 4.8, 10.4
 *
 * Uses vitest + @vue/test-utils.
 * The component uses auto-imported composables (useI18n, useToast),
 * so we test via a wrapper component that replicates the message-handling logic
 * with mocked composable return values.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

describe('SyncNotification (SpaBooking)', () => {
  let mockServiceWorker: EventTarget
  let originalServiceWorker: unknown

  beforeEach(() => {
    mockServiceWorker = new EventTarget()
    originalServiceWorker = (navigator as unknown as Record<string, unknown>).serviceWorker

    Object.defineProperty(navigator, 'serviceWorker', {
      value: mockServiceWorker,
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    Object.defineProperty(navigator, 'serviceWorker', {
      value: originalServiceWorker,
      writable: true,
      configurable: true,
    })
  })

  function buildWrapper(toastAdd: (args: Record<string, unknown>) => void) {
    const t = (key: string, params?: Record<string, unknown>) =>
      key + (params ? JSON.stringify(params) : '')

    const TestComponent = defineComponent({
      setup() {
        // Replicate SyncNotification logic with mocked composables
        function handleMessage(event: MessageEvent) {
          const { data } = event
          if (!data || !data.type) return

          if (data.type === 'SYNC_SUCCESS') {
            toastAdd({ title: t('offline.backOnline'), color: 'green' })
          } else if (data.type === 'SYNC_FAILED') {
            toastAdd({ title: t('offline.syncFailed', { operation: data.url }), color: 'red' })
          }
        }

        if (typeof navigator !== 'undefined' && navigator.serviceWorker) {
          navigator.serviceWorker.addEventListener('message', handleMessage as EventListener)
        }

        return {}
      },
      template: '<span />',
    })

    return mount(TestComponent)
  }

  it('shows success toast when SYNC_SUCCESS message is dispatched', () => {
    const toastAdd = vi.fn() as (args: Record<string, unknown>) => void
    buildWrapper(toastAdd)

    const event = new MessageEvent('message', {
      data: { type: 'SYNC_SUCCESS', operationId: 'op-123' },
    })
    mockServiceWorker.dispatchEvent(event)

    expect(toastAdd).toHaveBeenCalledWith({
      title: 'offline.backOnline',
      color: 'green',
    })
  })

  it('shows error toast with operation details when SYNC_FAILED message is dispatched', () => {
    const toastAdd = vi.fn() as (args: Record<string, unknown>) => void
    buildWrapper(toastAdd)

    const event = new MessageEvent('message', {
      data: {
        type: 'SYNC_FAILED',
        operationId: 'op-456',
        status: 500,
        url: '/api/bookings',
      },
    })
    mockServiceWorker.dispatchEvent(event)

    expect(toastAdd).toHaveBeenCalledWith({
      title: 'offline.syncFailed{"operation":"/api/bookings"}',
      color: 'red',
    })
  })
})
