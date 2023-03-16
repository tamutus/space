import { Ref } from "vue";
import { Auth0VueClient } from "@auth0/auth0-vue";

export const useUpdateSelection = async function (
  selectionRef: Ref<any>,
  fetchURL: string,
  auth0?: Auth0VueClient | undefined,
  loadingRef?: Ref<boolean>,
  tokenCallback?: Function
) {
  if (loadingRef) {
    loadingRef.value = true;
  }
  if (auth0 && auth0.isAuthenticated.value) {
    auth0.getAccessTokenSilently().then(async (token) => {
      let { data: newSelection } = await useFetch(fetchURL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      selectionRef.value = newSelection.value;
      if (loadingRef) {
        loadingRef.value = false;
      }
      if (tokenCallback) {
        tokenCallback(token);
      }
    });
  } else {
    let { data: newSelection } = await useFetch(fetchURL, {
      method: "GET",
    });
    selectionRef.value = newSelection.value;
    if (loadingRef) {
      loadingRef.value = false;
    }
    if (tokenCallback) {
      tokenCallback();
    }
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
