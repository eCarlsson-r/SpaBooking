export const useUIStore = defineStore('ui', {
  state: () => ({
    isLoginModalOpen: false,
  }),
  actions: {
    openLogin() {
      this.isLoginModalOpen = true
    },
    closeLogin() {
      this.isLoginModalOpen = false
    }
  }
})