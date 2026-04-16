<script setup lang="ts">
/**
 * Modal feedback form shown after session completion.
 * Collects a star rating (1–5) and optional free-text comment (max 1000 chars).
 * Submits to POST /api/feedback with rating, comment, session_id, customer_id.
 * Shows specific error messages for 422 (window closed) and 409 (already submitted).
 * Requirements: 9.2, 9.3, 9.5, 9.6, 9.7
 */

const props = defineProps<{
  sessionId: number
  customerId: number
}>()

const emit = defineEmits<{
  submitted: []
  dismissed: []
}>()

const { $api } = useNuxtApp()

// ── Form state ─────────────────────────────────────────────────────────────

const rating = ref<number>(0)
const comment = ref('')
const isSubmitting = ref(false)
const error = ref<string | null>(null)

const commentLength = computed(() => comment.value.length)
const isCommentTooLong = computed(() => commentLength.value > 1000)
const isFormValid = computed(() => rating.value >= 1 && rating.value <= 5 && !isCommentTooLong.value)

// ── Star rating helpers ────────────────────────────────────────────────────

const hoveredStar = ref<number>(0)

const setRating = (value: number) => {
  rating.value = value
}

const starFilled = (index: number) => {
  const active = hoveredStar.value || rating.value
  return index <= active
}

// ── Submit ─────────────────────────────────────────────────────────────────

const submit = async () => {
  if (!isFormValid.value || isSubmitting.value) return

  isSubmitting.value = true
  error.value = null

  try {
    await ($api as any)('/feedback', {
      method: 'POST',
      body: {
        rating: rating.value,
        comment: comment.value,
        session_id: props.sessionId,
        customer_id: props.customerId,
      },
    })
    emit('submitted')
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
  emit('dismissed')
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    role="dialog"
    aria-modal="true"
    aria-labelledby="feedback-form-title"
  >
    <div class="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-neutral-700 overflow-hidden">

      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 bg-primary-600 text-white">
        <div class="flex items-center gap-2">
          <UIcon name="i-material-symbols-star-rounded" class="w-5 h-5 shrink-0" />
          <span id="feedback-form-title" class="font-bold text-sm">
            How was your session?
          </span>
        </div>
        <button
          class="hover:opacity-75 transition-opacity"
          aria-label="Dismiss feedback form"
          :disabled="isSubmitting"
          @click="dismiss"
        >
          <UIcon name="i-material-symbols-close" class="w-5 h-5" />
        </button>
      </div>

      <!-- Body -->
      <div class="px-5 py-5 space-y-5">

        <!-- Star rating (Req 9.2) -->
        <div>
          <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Your Rating <span class="text-red-500">*</span>
          </p>
          <div
            class="flex gap-2"
            role="radiogroup"
            aria-label="Star rating"
          >
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              :aria-label="`${star} star${star > 1 ? 's' : ''}`"
              :aria-pressed="rating === star"
              class="w-10 h-10 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
              :class="starFilled(star)
                ? 'text-amber-400 scale-110'
                : 'text-slate-300 dark:text-neutral-600 hover:text-amber-300'"
              @click="setRating(star)"
              @mouseenter="hoveredStar = star"
              @mouseleave="hoveredStar = 0"
            >
              <UIcon
                :name="starFilled(star) ? 'i-material-symbols-star-rounded' : 'i-material-symbols-star-outline-rounded'"
                class="w-8 h-8"
              />
            </button>
          </div>
          <p v-if="rating > 0" class="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
            {{ ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'][rating] }}
          </p>
        </div>

        <!-- Comment field (Req 9.2) -->
        <div>
          <label
            for="feedback-comment"
            class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2"
          >
            Comments <span class="font-normal normal-case">(optional)</span>
          </label>
          <textarea
            id="feedback-comment"
            v-model="comment"
            rows="4"
            maxlength="1000"
            placeholder="Tell us about your experience…"
            class="w-full resize-none rounded-xl border border-slate-200 dark:border-neutral-600 bg-slate-50 dark:bg-neutral-800 text-slate-800 dark:text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-400 transition-colors"
            :class="{ 'border-red-400 focus:ring-red-400': isCommentTooLong }"
            :disabled="isSubmitting"
          />
          <div class="flex justify-end mt-1">
            <span
              class="text-xs"
              :class="isCommentTooLong ? 'text-red-500 font-bold' : 'text-slate-400 dark:text-slate-500'"
            >
              {{ commentLength }} / 1000
            </span>
          </div>
        </div>

        <!-- Error message (Req 9.5, 9.7) -->
        <div
          v-if="error"
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-3 text-sm text-red-700 dark:text-red-300"
          role="alert"
        >
          {{ error }}
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between pt-1">
          <button
            type="button"
            class="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="isSubmitting"
            @click="dismiss"
          >
            Skip for now
          </button>

          <button
            type="button"
            class="px-5 py-2 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            :disabled="!isFormValid || isSubmitting"
            @click="submit"
          >
            <UIcon
              v-if="isSubmitting"
              name="i-mdi-loading"
              class="w-4 h-4 animate-spin"
            />
            <span>{{ isSubmitting ? 'Submitting…' : 'Submit Feedback' }}</span>
          </button>
        </div>

      </div>
    </div>
  </div>
</template>
