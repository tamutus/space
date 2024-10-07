import { type Auth0VueClient } from "@auth0/auth0-vue";

export const useUpdateSelection = async function (
  selectionRef: Ref<any>,
  fetchURL: string,
  auth0?: Auth0VueClient | undefined,
  loadingRef?: Ref<boolean>,
  tokenCallback?: Function,
  errorRef?: Ref<any>
) {
  if (loadingRef) {
    loadingRef.value = true;
  }
  const fetchOptions: any = {
    method: "GET",
  };
  let tokenValue;
  if (auth0 && auth0.isAuthenticated.value) {
    await auth0.getAccessTokenSilently().then((token) => {
      fetchOptions.headers = {
        Authorization: `Bearer ${token}`,
      };
      tokenValue = token;
    });
  }
  let { data: newSelection, error: fetchError } = await useFetch(
    fetchURL,
    fetchOptions
  );
  selectionRef.value = newSelection.value;
  if (loadingRef) {
    loadingRef.value = false;
  }
  if (errorRef) {
    errorRef.value = fetchError.value;
    if (errorRef.value) {
      console.error(errorRef.value);
    }
  }
  if (tokenCallback) {
    tokenCallback(tokenValue);
  }
  if (typeof selectionRef.value === "string") {
    console.warn(
      "When fetching an updated selection from the server, something unexpected was returned:"
    );
    console.warn(selectionRef.value);
  }
};

export const updateAtAuth = function (
  updater: Function,
  auth0: Auth0VueClient
) {
  onMounted(async () => {
    updater();
    watch(auth0.isAuthenticated, () => {
      updater();
    });
  });
};
