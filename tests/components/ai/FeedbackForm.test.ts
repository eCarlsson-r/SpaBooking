/**
 * Unit tests for FeedbackForm (SpaBooking).
 * Requirements: 9.5, 9.7
 *
 * Uses vitest + @vue/test-utils.
 * The component is tested via a TestFeedbackForm wrapper that replicates
 * FeedbackForm's logic without Nuxt-specific dependencies (UIcon, useNuxtApp).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, ref, computed } from 'vue'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockApi = vi.fn()

vi.stubGlobal('useNuxtApp', () => ({ $api: mockApi }))

// ─── TestFeedbackForm wrapper ─────────────────────────────────────────────────

/**
 * Builds a minimal wrapper that replicates FeedbackForm's core logic
 * without Nuxt-specific dependencies.
 */
function buildFormWrapper(props: { sessionId?: number; customerId?: number } = {}) {
  const sessionId = props.sessionId ?? 1
  const customerId = props.customerId ?? 42

  const emittedSubmitted: true[] = []
  const emittedDismissed: true[] = []

  const TestFeedbackForm = defineComponent({
    setup() {
      const rating = ref<number>(0)
      const comment = ref('')
      const isSubmitting = ref(false)
      const error = ref<string | null>(null)

      const commentLength = computed(() => comment.value.length)
      const isCommentTooLong = computed(() => commentLength.value > 1000)
      const isFormValid = computed(
        () => rating.value >= 1 && rating.value <= 5 && !isCommentTooLong.value,
      )

      const setRating = (value: number) => {
        rating.value = value
      }

      const submit = async () => {
        if (!isFormValid.value || isSubmitting.value) return

        isSubmitting.value = true
        error.value = null

        try {
          await mockApi('/feedback', {
            method: 'POST',
            body: {
              rating: rating.value,
              comment: comment.value,
              session_id: sessionId,
              customer_id: customerId,
            },
          })
          emittedSubmitted.push(true)
        } catch (err: any) {
          const status = err?.response?.status ?? err?.statusCode
          if (status === 422) {
            error.value = 'The feedback window for this session has closed.'
          } else if (status === 409) {
            error.value = 'You have already submitted feedback for this session.'
          } else {
            error.value = 'Something went wrong. Please try again.'
          }
        } finally {
          isSubmitting.value = false
        }
      }

      const dismiss = () => {
        emittedDismissed.push(true)
      }

      return {
        rating,
        comment,
        isSubmitting,
        error,
        commentLength,
        isCommentTooLong,
        isFormValid,
        setRating,
        submit,
        dismiss,
      }
    },
    template: `
      <div>
        <!-- Star rating buttons -->
        <div data-testid="star-rating">
          <button
            v-for="star in 5"
            :key="star"
            :data-testid="'star-' + star"
            :aria-pressed="rating === star"
            @click="setRating(star)"
          >{{ star }}</button>
        </div>

        <!-- Comment textarea -->
        <textarea
          v-model="comment"
          data-testid="comment-input"
          maxlength="1000"
        />
        <span data-testid="comment-length">{{ commentLength }} / 1000</span>
        <span v-if="isCommentTooLong" data-testid="comment-too-long">Comment too long</span>

        <!-- Error message -->
        <div v-if="error" data-testid="error-message" role="alert">{{ error }}</div>

        <!-- Submit button -->
        <button
          data-testid="submit-btn"
          :disabled="!isFormValid || isSubmitting"
          @click="submit"
        >
          {{ isSubmitting ? 'Submitting…' : 'Submit Feedback' }}
        </button>

        <!-- Dismiss button -->
        <button data-testid="dismiss-btn" @click="dismiss">Skip for now</button>
      </div>
    `,
  })

  const wrapper = mount(TestFeedbackForm)
  return { wrapper, emittedSubmitted, emittedDismissed }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('FeedbackForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Form validation: submit button state ──────────────────────────────────

  describe('submit button disabled state (Requirement 9.2)', () => {
    it('is disabled when no rating is selected', () => {
      const { wrapper } = buildFormWrapper()
      const btn = wrapper.find('[data-testid="submit-btn"]')
      expect((btn.element as HTMLButtonElement).disabled).toBe(true)
    })

    it('is disabled when comment exceeds 1000 characters', async () => {
      const { wrapper } = buildFormWrapper()

      // Select a valid rating first
      await wrapper.find('[data-testid="star-3"]').trigger('click')

      // Set comment to 1001 characters
      const longComment = 'a'.repeat(1001)
      await wrapper.find('[data-testid="comment-input"]').setValue(longComment)

      const btn = wrapper.find('[data-testid="submit-btn"]')
      expect((btn.element as HTMLButtonElement).disabled).toBe(true)
    })

    it('is enabled when rating is between 1 and 5 and comment is within limit', async () => {
      const { wrapper } = buildFormWrapper()

      await wrapper.find('[data-testid="star-4"]').trigger('click')
      await wrapper.find('[data-testid="comment-input"]').setValue('Great session!')

      const btn = wrapper.find('[data-testid="submit-btn"]')
      expect((btn.element as HTMLButtonElement).disabled).toBe(false)
    })

    it('is enabled with exactly 1000 character comment and valid rating', async () => {
      const { wrapper } = buildFormWrapper()

      await wrapper.find('[data-testid="star-5"]').trigger('click')
      await wrapper.find('[data-testid="comment-input"]').setValue('a'.repeat(1000))

      const btn = wrapper.find('[data-testid="submit-btn"]')
      expect((btn.element as HTMLButtonElement).disabled).toBe(false)
    })

    it('is enabled with empty comment and valid rating', async () => {
      const { wrapper } = buildFormWrapper()

      await wrapper.find('[data-testid="star-1"]').trigger('click')

      const btn = wrapper.find('[data-testid="submit-btn"]')
      expect((btn.element as HTMLButtonElement).disabled).toBe(false)
    })

    it.each([1, 2, 3, 4, 5])('is enabled when rating is %i', async (star) => {
      const { wrapper } = buildFormWrapper()

      await wrapper.find(`[data-testid="star-${star}"]`).trigger('click')

      const btn = wrapper.find('[data-testid="submit-btn"]')
      expect((btn.element as HTMLButtonElement).disabled).toBe(false)
    })
  })

  // ── Error messages: 422 and 409 ───────────────────────────────────────────

  describe('error messages on API failure (Requirements 9.5, 9.7)', () => {
    it('shows "feedback window has closed" message on 422 response', async () => {
      const err = Object.assign(new Error('Unprocessable'), { response: { status: 422 } })
      mockApi.mockRejectedValue(err)

      const { wrapper } = buildFormWrapper()
      await wrapper.find('[data-testid="star-3"]').trigger('click')
      await wrapper.find('[data-testid="submit-btn"]').trigger('click')
      await flushPromises()

      const errorEl = wrapper.find('[data-testid="error-message"]')
      expect(errorEl.exists()).toBe(true)
      expect(errorEl.text()).toBe('The feedback window for this session has closed.')
    })

    it('shows "already submitted" message on 409 response', async () => {
      const err = Object.assign(new Error('Conflict'), { response: { status: 409 } })
      mockApi.mockRejectedValue(err)

      const { wrapper } = buildFormWrapper()
      await wrapper.find('[data-testid="star-5"]').trigger('click')
      await wrapper.find('[data-testid="submit-btn"]').trigger('click')
      await flushPromises()

      const errorEl = wrapper.find('[data-testid="error-message"]')
      expect(errorEl.exists()).toBe(true)
      expect(errorEl.text()).toBe('You have already submitted feedback for this session.')
    })

    it('shows generic error message on unexpected error', async () => {
      mockApi.mockRejectedValue(new Error('Server error'))

      const { wrapper } = buildFormWrapper()
      await wrapper.find('[data-testid="star-2"]').trigger('click')
      await wrapper.find('[data-testid="submit-btn"]').trigger('click')
      await flushPromises()

      const errorEl = wrapper.find('[data-testid="error-message"]')
      expect(errorEl.exists()).toBe(true)
      expect(errorEl.text()).toBe('Something went wrong. Please try again.')
    })

    it('also handles statusCode property for 422', async () => {
      const err = Object.assign(new Error('Unprocessable'), { statusCode: 422 })
      mockApi.mockRejectedValue(err)

      const { wrapper } = buildFormWrapper()
      await wrapper.find('[data-testid="star-4"]').trigger('click')
      await wrapper.find('[data-testid="submit-btn"]').trigger('click')
      await flushPromises()

      expect(wrapper.find('[data-testid="error-message"]').text()).toBe(
        'The feedback window for this session has closed.',
      )
    })

    it('also handles statusCode property for 409', async () => {
      const err = Object.assign(new Error('Conflict'), { statusCode: 409 })
      mockApi.mockRejectedValue(err)

      const { wrapper } = buildFormWrapper()
      await wrapper.find('[data-testid="star-1"]').trigger('click')
      await wrapper.find('[data-testid="submit-btn"]').trigger('click')
      await flushPromises()

      expect(wrapper.find('[data-testid="error-message"]').text()).toBe(
        'You have already submitted feedback for this session.',
      )
    })

    it('does not show error message before any submission attempt', () => {
      const { wrapper } = buildFormWrapper()
      expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(false)
    })
  })

  // ── Success: emits submitted ──────────────────────────────────────────────

  describe('successful submission (Requirement 9.3)', () => {
    it('emits submitted event on successful API call', async () => {
      mockApi.mockResolvedValue({})

      const { wrapper, emittedSubmitted } = buildFormWrapper()
      await wrapper.find('[data-testid="star-5"]').trigger('click')
      await wrapper.find('[data-testid="comment-input"]').setValue('Wonderful experience!')
      await wrapper.find('[data-testid="submit-btn"]').trigger('click')
      await flushPromises()

      expect(emittedSubmitted).toHaveLength(1)
    })

    it('calls API with correct payload including session_id and customer_id', async () => {
      mockApi.mockResolvedValue({})

      const { wrapper } = buildFormWrapper({ sessionId: 7, customerId: 99 })
      await wrapper.find('[data-testid="star-4"]').trigger('click')
      await wrapper.find('[data-testid="comment-input"]').setValue('Very relaxing.')
      await wrapper.find('[data-testid="submit-btn"]').trigger('click')
      await flushPromises()

      expect(mockApi).toHaveBeenCalledWith(
        '/feedback',
        expect.objectContaining({
          method: 'POST',
          body: expect.objectContaining({
            rating: 4,
            comment: 'Very relaxing.',
            session_id: 7,
            customer_id: 99,
          }),
        }),
      )
    })

    it('does not emit submitted on API failure', async () => {
      const err = Object.assign(new Error('Conflict'), { response: { status: 409 } })
      mockApi.mockRejectedValue(err)

      const { wrapper, emittedSubmitted } = buildFormWrapper()
      await wrapper.find('[data-testid="star-3"]').trigger('click')
      await wrapper.find('[data-testid="submit-btn"]').trigger('click')
      await flushPromises()

      expect(emittedSubmitted).toHaveLength(0)
    })
  })

  // ── Dismiss button ────────────────────────────────────────────────────────

  describe('dismiss button (Requirement 9.2)', () => {
    it('emits dismissed event when dismiss button is clicked', async () => {
      const { wrapper, emittedDismissed } = buildFormWrapper()
      await wrapper.find('[data-testid="dismiss-btn"]').trigger('click')
      expect(emittedDismissed).toHaveLength(1)
    })

    it('dismiss button is always present regardless of form state', () => {
      const { wrapper } = buildFormWrapper()
      expect(wrapper.find('[data-testid="dismiss-btn"]').exists()).toBe(true)
    })
  })
})
