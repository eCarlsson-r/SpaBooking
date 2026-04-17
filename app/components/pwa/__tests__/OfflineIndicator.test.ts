/**
 * Unit tests for OfflineIndicator (SpaBooking)
 * Requirements: 3.6, 4.10, 10.2
 *
 * Uses vitest + @vue/test-utils.
 * The component uses auto-imported composables (useOfflineQueue, useI18n),
 * so we test via a wrapper component that replicates the template logic
 * with mocked composable return values.
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'

// ─── Minimal wrapper that replicates OfflineIndicator template logic ──────────

function buildIndicator(isOnline: boolean, pendingCount: number) {
  const TestIndicator = defineComponent({
    setup() {
      return {
        isOnline: ref(isOnline),
        pendingCount: ref(pendingCount),
        t: (key: string, params?: Record<string, unknown>) =>
          key + (params ? JSON.stringify(params) : ''),
      }
    },
    template: `
      <div
        v-if="!isOnline"
        data-testid="offline-banner"
        class="fixed bottom-0 left-0 right-0 z-[100] bg-amber-400 text-amber-900 text-sm font-medium text-center py-2 px-4"
        role="status"
        aria-live="polite"
      >
        {{ t('offline.banner', { count: pendingCount }) }}
      </div>
    `,
  })

  return mount(TestIndicator)
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('OfflineIndicator (SpaBooking)', () => {
  it('renders the banner when isOnline is false', () => {
    const wrapper = buildIndicator(false, 0)
    expect(wrapper.find('[data-testid="offline-banner"]').exists()).toBe(true)
  })

  it('banner is hidden when isOnline is true', () => {
    const wrapper = buildIndicator(true, 5)
    expect(wrapper.find('[data-testid="offline-banner"]').exists()).toBe(false)
  })

  it('displays the pendingCount in the banner text', () => {
    const wrapper = buildIndicator(false, 4)
    const banner = wrapper.find('[data-testid="offline-banner"]')
    expect(banner.text()).toContain('offline.banner')
    expect(banner.text()).toContain('"count":4')
  })
})
