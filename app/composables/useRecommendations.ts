// app/composables/useRecommendations.ts
// Requirements: 1.1, 1.4, 1.5
import type { TreatmentRecommendation } from '~~/types/ai'

/**
 * Fetches AI treatment recommendations for a customer.
 * Falls back silently on error — no error is surfaced to the user.
 * Requirements: 1.1, 1.4, 1.5
 */
export const useRecommendations = (
  customerId: Ref<string | number | null | undefined> | string | number | null | undefined,
  branchId: Ref<string | number | null | undefined> | string | number | null | undefined,
) => {
  const { $api } = useNuxtApp()

  const recommendations = ref<TreatmentRecommendation[]>([])
  const isLoading = ref(false)

  const customerIdValue = computed(() =>
    isRef(customerId) ? customerId.value : customerId,
  )
  const branchIdValue = computed(() =>
    isRef(branchId) ? branchId.value : branchId,
  )

  const fetchRecommendations = async () => {
    if (!customerIdValue.value || !branchIdValue.value) return

    isLoading.value = true
    try {
      const data = await $api<TreatmentRecommendation[]>('/ai/recommendations', {
        params: {
          customerId: customerIdValue.value,
          branchId: branchIdValue.value,
        },
      })
      recommendations.value = data ?? []
    } catch {
      // Fail silently — hide panel, no error shown to customer (Req 1.5)
      recommendations.value = []
    } finally {
      isLoading.value = false
    }
  }

  // Fetch when customer or branch changes
  watch([customerIdValue, branchIdValue], () => {
    fetchRecommendations()
  }, { immediate: true })

  return { recommendations, isLoading }
}
