export const useBranches = () => {
  const { $api } = useNuxtApp()
  return useAsyncData('branches', () => $api('/branch'))
}
