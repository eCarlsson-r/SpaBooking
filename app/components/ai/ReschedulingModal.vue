<script setup lang="ts">
/**
 * Modal for proactive rescheduling suggestions.
 * Displays conflict reason and available alternative slots.
 * On slot selection: POST /api/bookings/{id}/reschedule; shows booking confirmation.
 * On dismiss: POST /api/conflicts/{id}/dismiss; emits 'dismissed' to prevent re-display.
 * Requirements: 7.2, 7.3, 7.4
 */
import type { ConflictRecord, AlternativeSlot } from '~~/types/ai'

const props = defineProps<{
  conflict: ConflictRecord
}>()

const emit = defineEmits<{
  dismissed: [conflictId: number]
  rescheduled: [conflictId: number, slot: AlternativeSlot]
}>()

const { t } = useI18n()
const { $api } = useNuxtApp()

const isSubmitting = ref(false)
const isDismissing = ref(false)
const confirmedSlot = ref<AlternativeSlot | null>(null)
const error = ref<string | null>(null)

// ── Derived display values ─────────────────────────────────────────────────

const conflictReasonLabel = computed(() => {
  if (props.conflict.conflictType === 'therapist') {
    return t('ai.therapistDoubleBooking')
  }
  return t('ai.roomDoubleBooking')
})

const conflictDescription = computed(() => {
  const type = props.conflict.conflictType === 'therapist' ? 'therapist' : 'room'
  return `A scheduling conflict was detected for your booking #${props.conflict.bookingId}. The ${type} is also assigned to booking #${props.conflict.conflictingBookingId} at the same time.`
})

// ── Slot helpers ───────────────────────────────────────────────────────────

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

const formatTime = (timeStr: string) => {
  // timeStr may be "HH:mm:ss" or "HH:mm"
  const [h, m] = timeStr.split(':')
  const date = new Date()
  date.setHours(Number(h), Number(m))
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

// ── Actions ────────────────────────────────────────────────────────────────

const selectSlot = async (slot: AlternativeSlot) => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  error.value = null

  try {
    await ($api as any)(`/bookings/${props.conflict.bookingId}/reschedule`, {
      method: 'POST',
      body: {
        date: slot.date,
        start_time: slot.startTime,
        end_time: slot.endTime,
        therapist_id: slot.therapistId,
        room_id: slot.roomId,
      },
    })
    confirmedSlot.value = slot
    emit('rescheduled', props.conflict.id, slot)
  } catch {
    error.value = t('ai.rescheduleError')
  } finally {
    isSubmitting.value = false
  }
}

const dismiss = async () => {
  if (isDismissing.value) return
  isDismissing.value = true
  error.value = null

  try {
    await ($api as any)(`/conflicts/${props.conflict.id}/dismiss`, {
      method: 'POST',
    })
    emit('dismissed', props.conflict.id)
  } catch {
    // Emit dismissed anyway so the UI removes it; the backend may retry
    emit('dismissed', props.conflict.id)
  } finally {
    isDismissing.value = false
  }
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    role="dialog"
    aria-modal="true"
    aria-labelledby="rescheduling-modal-title"
  >
    <div class="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-neutral-700 overflow-hidden">

      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 bg-amber-500 text-white">
        <div class="flex items-center gap-2">
          <UIcon name="i-material-symbols-warning-rounded" class="w-5 h-5 shrink-0" />
          <span id="rescheduling-modal-title" class="font-bold text-sm">
            {{ t('ai.schedulingConflict') }}
          </span>
        </div>
        <button
          class="hover:opacity-75 transition-opacity"
          :aria-label="t('ai.dismissSuggestion')"
          :disabled="isDismissing || isSubmitting"
          @click="dismiss"
        >
          <UIcon name="i-material-symbols-close" class="w-5 h-5" />
        </button>
      </div>

      <!-- Confirmation state -->
      <div v-if="confirmedSlot" class="px-5 py-6 text-center">
        <UIcon name="i-material-symbols-check-circle-rounded" class="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base mb-1">
          {{ t('ai.bookingRescheduled') }}
        </h3>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          {{ t('ai.bookingRescheduledDescription', {
            date: formatDate(confirmedSlot.date),
            startTime: formatTime(confirmedSlot.startTime),
            endTime: formatTime(confirmedSlot.endTime)
          }) }}
        </p>
        <button
          class="mt-4 px-5 py-2 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-colors"
          @click="emit('dismissed', props.conflict.id)"
        >
          {{ t('ai.done') }}
        </button>
      </div>

      <!-- Main content -->
      <div v-else class="px-5 py-4 space-y-4">

        <!-- Conflict reason (Req 7.2) -->
        <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3">
          <p class="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide mb-1">
            {{ conflictReasonLabel }}
          </p>
          <p class="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
            {{ conflictDescription }}
          </p>
        </div>

        <!-- Error message -->
        <div
          v-if="error"
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-3 text-sm text-red-700 dark:text-red-300"
        >
          {{ error }}
        </div>

        <!-- Alternative slots (Req 7.2) -->
        <div>
          <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            {{ t('ai.availableAlternativeSlots') }}
          </p>

          <!-- No slots available -->
          <div
            v-if="conflict.alternativeSlots.length === 0"
            class="text-sm text-slate-500 dark:text-slate-400 text-center py-4"
          >
            {{ t('ai.noAlternativeSlots') }}
          </div>

          <!-- Slot list (Req 7.3) -->
          <div v-else class="space-y-2">
            <button
              v-for="(slot, idx) in conflict.alternativeSlots"
              :key="idx"
              class="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isSubmitting"
              @click="selectSlot(slot)"
            >
              <div>
                <p class="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {{ formatDate(slot.date) }}
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {{ formatTime(slot.startTime) }} – {{ formatTime(slot.endTime) }}
                </p>
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <span>{{ t('ai.room', { id: slot.roomId }) }}</span>
                <UIcon
                  v-if="isSubmitting"
                  name="i-mdi-loading"
                  class="w-4 h-4 animate-spin text-primary-500"
                />
                <UIcon
                  v-else
                  name="i-material-symbols-chevron-right-rounded"
                  class="w-4 h-4"
                />
              </div>
            </button>
          </div>
        </div>

        <!-- Dismiss action (Req 7.4) -->
        <div class="flex justify-end pt-1">
          <button
            class="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="isDismissing || isSubmitting"
            @click="dismiss"
          >
            <span v-if="isDismissing">{{ t('ai.dismissing') }}</span>
            <span v-else>{{ t('ai.dismissSuggestion') }}</span>
          </button>
        </div>

      </div>
    </div>
  </div>
</template>
