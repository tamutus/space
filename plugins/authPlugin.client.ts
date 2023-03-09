import { createAuth0 } from "@auth0/auth0-vue";

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const auth0Domain = runtimeConfig.authDomain;
  const auth0ClientID = runtimeConfig.authClientId;
  const auth0ApiId = runtimeConfig.authApiIdentifier;

  nuxtApp.vueApp.use(
    createAuth0({
      client_id: auth0ClientID,
      domain: auth0Domain,
      responseType: "token id_token",
      scope: "openid profile",
      audience: auth0ApiId,
      redirect_uri: window.location.origin,
    })
  );
});
