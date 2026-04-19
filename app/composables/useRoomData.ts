export const useRoomData = () => {
  const { $api } = useNuxtApp()
  return useAsyncData('room', () => $api('/room'))
}
