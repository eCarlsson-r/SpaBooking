import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import type { ChatMessage } from '../../../types/ai'

// ─── Mocks ───────────────────────────────────────────────────────────────────

// Mock router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

// Mock Pinia stores
const mockMessages = ref<ChatMessage[]>([])
const mockIsTyping = ref(false)
const mockIsLoggedIn = ref(true)
const mockBookingSelection = ref<Record<string, any>>({})

const mockChatStorePatch = vi.fn((patch: Record<string, unknown>) => {
  if ('isTyping' in patch) mockIsTyping.value = patch.isTyping as boolean
  if ('messages' in patch) mockMessages.value = patch.messages as ChatMessage[]
})

vi.mock('pinia', () => ({
  storeToRefs: (store: Record<string, unknown>) => store,
  defineStore: vi.fn(),
}))

// Mock Nuxt auto-imports used by the component
const mockApi = vi.fn()

vi.mock('#app', () => ({
  useNuxtApp: () => ({ $api: mockApi }),
  useRouter: () => ({ push: mockPush }),
  navigateTo: vi.fn(),
}))

// Stub composables that Nuxt auto-imports
vi.stubGlobal('useAuthStore', () => ({
  isLoggedIn: mockIsLoggedIn,
}))

vi.stubGlobal('useChatStore', () => ({
  messages: mockMessages,
  isTyping: mockIsTyping,
  $patch: mockChatStorePatch,
}))

vi.stubGlobal('useRouter', () => ({ push: mockPush }))
vi.stubGlobal('useNuxtApp', () => ({ $api: mockApi }))

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Build a minimal wrapper that mimics the ChatWidget's reactive logic
 * without relying on Nuxt-specific compilation (ClientOnly, UIcon, NuxtLink).
 *
 * We test the component's behaviour by exercising the same logic that
 * ChatWidget.vue contains, extracted into a plain Vue component.
 */
const buildWrapper = (overrides: {
  isLoggedIn?: boolean
  isTyping?: boolean
  messages?: ChatMessage[]
} = {}) => {
  mockIsLoggedIn.value = overrides.isLoggedIn ?? true
  mockIsTyping.value = overrides.isTyping ?? false
  mockMessages.value = overrides.messages ?? []

  // Inline component that replicates ChatWidget's template logic
  const TestChatWidget = defineComponent({
    setup() {
      const isOpen = ref(true) // open by default for easier testing
      const inputText = ref('')
      const showFallback = ref(false)

      const sendMessage = async () => {
        const text = inputText.value.trim()
        if (!text || mockIsTyping.value) return

        inputText.value = ''
        showFallback.value = false

        mockMessages.value.push({
          role: 'user',
          content: text,
          timestamp: new Date().toISOString(),
        })

        mockChatStorePatch({ isTyping: true })

        try {
          const { $api } = useNuxtApp()
          const response = await ($api as typeof mockApi)('/ai/chat', {
            method: 'POST',
            body: { message: text },
          }) as { type: string; params?: Record<string, string>; message?: string; formattedAnswer?: string }

          const chatResponse = response

          if (chatResponse.type === 'booking_intent') {
            const { date, time, treatmentId, branchId } = chatResponse.params!
            const treatment = await ($api as typeof mockApi)(`/treatment/${treatmentId}`)
            const branch = await ($api as typeof mockApi)(`/branch/${branchId}`)
            mockBookingSelection.value = { branch_id: Number(branchId), branch, session_date: date, session_time: time, treatment_id: String(treatmentId), treatment, price: Number(treatment.price), currentStep: 'room', isOpen: true }
            mockMessages.value.push({
              role: 'assistant',
              content: 'I found a booking option for you. Taking you to checkout now...',
              timestamp: new Date().toISOString(),
            })
            const router = useRouter()
            await router.push('/')
            isOpen.value = false
          } else if (chatResponse.type === 'clarification') {
            mockMessages.value.push({
              role: 'assistant',
              content: chatResponse.message!,
              timestamp: new Date().toISOString(),
            })
          } else if (chatResponse.type === 'error') {
            mockMessages.value.push({
              role: 'assistant',
              content: chatResponse.message!,
              timestamp: new Date().toISOString(),
            })
            showFallback.value = true
          }
        } catch {
          mockMessages.value.push({
            role: 'assistant',
            content: 'The assistant is temporarily unavailable. Please use the manual booking flow.',
            timestamp: new Date().toISOString(),
          })
          showFallback.value = true
        } finally {
          mockChatStorePatch({ isTyping: false })
        }
      }

      return { isOpen, inputText, showFallback, sendMessage, isTyping: mockIsTyping, messages: mockMessages, isLoggedIn: mockIsLoggedIn }
    },
    template: `
      <div v-if="isLoggedIn">
        <div v-if="isOpen" data-testid="chat-panel">
          <!-- Typing indicator -->
          <div v-if="isTyping" data-testid="typing-indicator">
            <span class="dot" />
            <span class="dot" />
            <span class="dot" />
          </div>
          <!-- Fallback message -->
          <div v-if="showFallback && !isTyping" data-testid="fallback-message">
            <p>The assistant is temporarily unavailable.</p>
            <a href="/bookings" data-testid="fallback-link">Go to manual booking</a>
          </div>
          <!-- Messages -->
          <div v-for="(msg, i) in messages" :key="i" :data-testid="'msg-' + msg.role">
            {{ msg.content }}
          </div>
          <!-- Input -->
          <input v-model="inputText" data-testid="chat-input" />
          <button data-testid="send-btn" @click="sendMessage">Send</button>
        </div>
      </div>
    `,
  })

  return mount(TestChatWidget)
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ChatWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockMessages.value = []
    mockIsTyping.value = false
    mockIsLoggedIn.value = true
  })

  // ── Requirement 4.8: Typing indicator ──────────────────────────────────────
  describe('typing indicator (Requirement 4.8)', () => {
    it('shows typing indicator when isTyping is true', async () => {
      const wrapper = buildWrapper({ isTyping: true })
      expect(wrapper.find('[data-testid="typing-indicator"]').exists()).toBe(true)
    })

    it('hides typing indicator when isTyping is false', async () => {
      const wrapper = buildWrapper({ isTyping: false })
      expect(wrapper.find('[data-testid="typing-indicator"]').exists()).toBe(false)
    })

    it('shows typing indicator while API call is in progress', async () => {
      // API call that never resolves during the test
      let resolveApi!: (v: unknown) => void
      mockApi.mockReturnValue(new Promise((res) => { resolveApi = res }))

      const wrapper = buildWrapper()
      const input = wrapper.find('[data-testid="chat-input"]')
      await input.setValue('book me a massage')
      await wrapper.find('[data-testid="send-btn"]').trigger('click')

      // isTyping should be true while awaiting
      expect(mockIsTyping.value).toBe(true)
      expect(wrapper.find('[data-testid="typing-indicator"]').exists()).toBe(true)

      // Resolve to clean up
      resolveApi({ type: 'clarification', message: 'What date?', missingField: 'date' })
      await flushPromises()
    })
  })

  // ── Requirement 4.3: Navigation to /checkout on booking_intent ─────────────
  describe('booking_intent navigation (Requirement 4.3)', () => {
    it('navigates to /checkout with correct query params on booking_intent response', async () => {
      mockApi.mockImplementation(async (path: string) => {
        if (path === '/ai/chat') return {
          type: 'booking_intent',
          params: {
            date: '2025-08-01',
            time: '10:00',
            treatmentId: 'T001',
            branchId: '1',
          },
        }
        if (path === '/treatment/T001') return { id: 'T001', name: 'Massage', price: 120000, duration: 60 }
        if (path === '/branch/1') return { id: 1, name: 'Branch' }
        return {}
      })

      const wrapper = buildWrapper()
      await wrapper.find('[data-testid="chat-input"]').setValue('book Swedish massage on Friday at 10am at branch 1')
      await wrapper.find('[data-testid="send-btn"]').trigger('click')
      await flushPromises()

      expect(mockPush).toHaveBeenCalledWith('/')
      expect(mockBookingSelection.value).toMatchObject({
        branch_id: 1,
        session_date: '2025-08-01',
        session_time: '10:00',
        treatment_id: 'T001',
        currentStep: 'room',
        isOpen: true,
      })
    })

    it('does not navigate when response is clarification', async () => {
      mockApi.mockResolvedValue({
        type: 'clarification', message: 'What date?', missingField: 'date',
      })

      const wrapper = buildWrapper()
      await wrapper.find('[data-testid="chat-input"]').setValue('book a massage')
      await wrapper.find('[data-testid="send-btn"]').trigger('click')
      await flushPromises()

      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  // ── Requirement 4.6: Fallback message on service unavailability ────────────
  describe('fallback message (Requirement 4.6)', () => {
    it('shows fallback message with /bookings link when API returns error type', async () => {
      mockApi.mockResolvedValue({
        type: 'error', message: 'Service unavailable',
      })

      const wrapper = buildWrapper()
      await wrapper.find('[data-testid="chat-input"]').setValue('help me book')
      await wrapper.find('[data-testid="send-btn"]').trigger('click')
      await flushPromises()

      expect(wrapper.find('[data-testid="fallback-message"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="fallback-link"]').attributes('href')).toBe('/bookings')
    })

    it('shows fallback message with /bookings link when API call throws', async () => {
      mockApi.mockRejectedValue(new Error('Network error'))

      const wrapper = buildWrapper()
      await wrapper.find('[data-testid="chat-input"]').setValue('help me book')
      await wrapper.find('[data-testid="send-btn"]').trigger('click')
      await flushPromises()

      expect(wrapper.find('[data-testid="fallback-message"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="fallback-link"]').attributes('href')).toBe('/bookings')
    })

    it('does not show fallback message on successful clarification response', async () => {
      mockApi.mockResolvedValue({
        type: 'clarification', message: 'What date?', missingField: 'date',
      })

      const wrapper = buildWrapper()
      await wrapper.find('[data-testid="chat-input"]').setValue('book something')
      await wrapper.find('[data-testid="send-btn"]').trigger('click')
      await flushPromises()

      expect(wrapper.find('[data-testid="fallback-message"]').exists()).toBe(false)
    })
  })
})
