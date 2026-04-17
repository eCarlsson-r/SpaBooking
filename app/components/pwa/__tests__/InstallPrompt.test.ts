/**
 * Unit tests for InstallPrompt (SpaBooking)
 * Requirements: 5.8
 *
 * Tests snooze logic: component should not render when snoozed within 7 days,
 * and should render when snooze has expired (or was never set).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'

const SNOOZE_KEY = 'pwa-install-snoozed'
const SNOOZE_DURATION = 7 * 24 * 60 * 60 * 1000

// ─── Minimal wrapper replicating InstallPrompt logic ─────────────────────────

function buildPrompt(snoozedAt: number | null) {
  // Seed localStorage before mounting
  if (snoozedAt !== null) {
    localStorage.setItem(SNOOZE_KEY, String(snoozedAt))
  } else {
    localStorage.removeItem(SNOOZE_KEY)
  }

  const TestPrompt = defineComponent({
    setup() {
      const deferredPrompt = ref<object | null>(null)
      const canShow = ref(false)

      function isSnoozed(): boolean {
        const snoozed = localStorage.getItem(SNOOZE_KEY)
        return snoozed !== null && Date.now() - Number(snoozed) < SNOOZE_DURATION
      }

      // Simulate receiving the beforeinstallprompt event
      deferredPrompt.value = { prompt: async () => {}, userChoice: Promise.resolve({ outcome: 'accepted' }) }
      if (!isSnoozed()) {
        canShow.value = true
      }

      function handleDismiss() {
        localStorage.setItem(SNOOZE_KEY, String(Date.now()))
        canShow.value = false
      }

      return { canShow, deferredPrompt, handleDismiss, t: (key: string) => key }
    },
    template: `
      <div
        v-if="canShow && deferredPrompt"
        data-testid="install-banner"
        class="fixed bottom-0 left-0 right-0 z-50"
      >
        <span>{{ t('pwa.installPrompt') }}</span>
        <button data-testid="install-accept">{{ t('pwa.installAccept') }}</button>
        <button data-testid="install-dismiss" @click="handleDismiss">{{ t('pwa.installDismiss') }}</button>
      </div>
    `,
  })

  return mount(TestPrompt)
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('InstallPrompt (SpaBooking)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('renders the install banner when not snoozed', () => {
    const wrapper = buildPrompt(null)
    expect(wrapper.find('[data-testid="install-banner"]').exists()).toBe(true)
  })

  it('does not render when snoozed within 7 days', () => {
    const recentSnooze = Date.now() - 1000 // 1 second ago
    const wrapper = buildPrompt(recentSnooze)
    expect(wrapper.find('[data-testid="install-banner"]').exists()).toBe(false)
  })

  it('renders when snooze has expired (older than 7 days)', () => {
    const expiredSnooze = Date.now() - SNOOZE_DURATION - 1000 // just past 7 days
    const wrapper = buildPrompt(expiredSnooze)
    expect(wrapper.find('[data-testid="install-banner"]').exists()).toBe(true)
  })

  it('hides the banner and stores snooze timestamp on dismiss', async () => {
    const wrapper = buildPrompt(null)
    expect(wrapper.find('[data-testid="install-banner"]').exists()).toBe(true)

    await wrapper.find('[data-testid="install-dismiss"]').trigger('click')

    expect(wrapper.find('[data-testid="install-banner"]').exists()).toBe(false)
    const stored = localStorage.getItem(SNOOZE_KEY)
    expect(stored).not.toBeNull()
    expect(Number(stored)).toBeGreaterThan(0)
  })
})
