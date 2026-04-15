<script setup lang="ts">
/**
 * Displays up to 5 AI-recommended treatments for the current customer.
 * Shows fallback (popular treatments) silently when AI is unavailable.
 * Panel is hidden entirely when no customer context is available.
 * Requirements: 1.1, 1.3, 1.5
 */
import type { TreatmentRecommendation } from '~~/types/ai'

const props = defineProps<{
  customerId?: string | number | null
  branchId?: string | number | null
}>()

const customerIdRef = computed(() => props.customerId)
const branchIdRef = computed(() => props.branchId)

const { recommendations, isLoading } = useRecommendations(customerIdRef, branchIdRef)

const formatIDR = (val: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val)

// Only show panel when there's a customer context and data (or loading)
const shouldShow = computed(
  () => !!props.customerId && (isLoading.value || recommendations.value.length > 0),
)
</script>

<template>
  <div v-if="shouldShow" class="my-6">
    <div class="flex items-center gap-2 mb-3">
      <UIcon name="i-mdi-sparkles" class="text-primary-500 w-5 h-5" />
      <h3 class="font-bold text-slate-800 text-sm uppercase tracking-wide">
        Recommended for You
      </h3>
    </div>

    <!-- Loading skeletons -->
    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="i in 3"
        :key="i"
        class="animate-pulse bg-slate-100 rounded-2xl h-28"
      />
    </div>

    <!-- Recommendation items (max 5) -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="rec in recommendations.slice(0, 5)"
        :key="rec.rank"
        class="bg-white border border-primary-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between gap-2 mb-2">
          <h4 class="font-bold text-slate-800 text-sm leading-tight">
            {{ rec.treatment.name }}
          </h4>
          <span class="shrink-0 text-[10px] font-black text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">
            #{{ rec.rank }}
          </span>
        </div>
        <div class="flex items-center gap-3 text-xs text-slate-500 mb-2">
          <span>{{ rec.treatment.duration }} min</span>
          <span class="font-bold text-primary-600">{{ formatIDR(rec.treatment.price) }}</span>
        </div>
        <p class="text-xs text-slate-500 italic leading-relaxed">
          {{ rec.rationale }}
        </p>
      </div>
    </div>
  </div>
</template>
