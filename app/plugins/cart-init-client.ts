export default defineNuxtPlugin(async () => {
  const auth = useAuthStore();
  const cart = useCartStore();

  if (auth.isLoggedIn) {
    await cart.fetchCart();
  }
});