import { Ref } from "vue";
import * as jose from "jose";
import { RouterMethod } from "h3";
import { Auth0VueClient } from "@auth0/auth0-vue";

export async function userHasScope(auth0: Auth0VueClient, scope: string) {
  if (auth0 && auth0.isAuthenticated.value) {
    const runtimeConfig = useRuntimeConfig().public;
    return auth0.getAccessTokenSilently().then(async (token) => {
      if (!token) return false;
      const JWKS = jose.createRemoteJWKSet(
        new URL(`https://${runtimeConfig.authDomain}/.well-known/jwks.json`)
      );
      const { payload, protectedHeader } = await jose.jwtVerify(token, JWKS, {
        audience: runtimeConfig.authApiIdentifier,
        issuer: `https://${runtimeConfig.authDomain}/`,
      });
      if (
        typeof payload.scope === "string" &&
        payload.scope.split(/\s/g).includes(scope)
      ) {
        return true;
      }
      return false;
    });
  }
  return false;
}

function checkForLavra(auth0: Auth0VueClient, lavra: Ref<boolean>) {
  userHasScope(auth0, "create:content").then((hasIt) => {
    lavra.value = hasIt;
  });
}
export function useLavra(auth0: Auth0VueClient) {
  const lavra: Ref<boolean> = ref(false);
  if (auth0) {
    checkForLavra(auth0, lavra);
    watch(auth0.isAuthenticated, () => {
      checkForLavra(auth0, lavra);
    });
  }
  return lavra;
}

export async function authFetchWithId<DatabaseObject extends { id: number }>(
  dbObject: Ref<DatabaseObject | null>,
  relativeURL: string,
  auth: Auth0VueClient,
  logicGate: Ref<boolean>,
  method: RouterMethod = "get",
  body?: object
) {
  if (auth) {
    if (logicGate.value && dbObject.value?.id) {
      const id = dbObject.value.id;
      return auth.getAccessTokenSilently().then(async (token) => {
        let maybeBody = {};
        if (body !== undefined) {
          maybeBody = { ...body };
        }
        return useFetch(relativeURL + id, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          ...maybeBody,
        });
      });
    }
  }
  return {
    data: ref(null),
    pending: ref(false),
    error: ref(
      createError({
        statusCode: 404,
        statusMessage:
          "Can't fetch the thing because it doesn't have an id, or you aren't authorized.",
      })
    ),
  };
}
