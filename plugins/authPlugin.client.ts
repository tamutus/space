import { createAuth0 } from "@auth0/auth0-vue";

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const auth0Domain = runtimeConfig.public.authDomain;
  const auth0ClientID = runtimeConfig.public.authClientId;
  const auth0ApiId = runtimeConfig.public.authApiIdentifier;

  nuxtApp.vueApp.use(
    createAuth0({
      clientId: auth0ClientID,
      domain: auth0Domain,
      authorizationParams: {
        audience: auth0ApiId,
        redirect_uri: window.location.origin,
      },
      cacheLocation: "localstorage",
    })
  );
});
