export const useCategories = () => {
  const { $api } = useNuxtApp()
  return useAsyncData('category', () => $api('/category'))
}
