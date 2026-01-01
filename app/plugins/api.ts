// plugins/api.ts
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const token = useCookie('auth_token');

  const apiFetcher = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ request, options }) {
      // Add default headers here (e.g., for JSON or Auth)
      if (!options.headers) options.headers = new Headers();
      options.headers.set('Accept', 'application/json');
      if (token.value) {
        options.headers.set('Authorization', `Bearer ${token.value}`)
      }
      console.log(`[API Request] ${request}`);
    },
    onResponseError({ response }) {
      // Global error handling (e.g., logging out if 401)
      console.error(`[API Error] ${response.status}: ${response._data?.message}`);
    }
  });

  return {
    provide: {
      api: apiFetcher
    }
  };
});