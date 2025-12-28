// plugins/api.ts
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const apiFetcher = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ request, options }) {
      // Add default headers here (e.g., for JSON or Auth)
      if (!options.headers) options.headers = new Headers();
      options.headers.set('Accept', 'application/json');
      
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