<template>
  <div>
    <BackgroundTexture texture="wood">
      <section>
        <NavHeader>
          <span v-if="isLoading">Loading desk...</span>
          <span v-else-if="isAuthenticated && user?.name"
            >The Desk of {{ user.name }}</span
          >
          <span v-else>My Desk</span>
        </NavHeader>
        <BoxFocus>
          <h2>Work in Progress</h2>
          <BackgroundHologram>
            <template #display>
              This will be your portal for commissioning Lavra.
            </template>
          </BackgroundHologram>
        </BoxFocus>
      </section>
    </BackgroundTexture>
    <!-- <BackgroundTexture texture="wood">
      <section class="padded">
        <h2>My Commissions</h2>
        <TableSubtle>
          <template
            v-for="(commission, comNumber) of shownCommissions"
            #[comNumber]
          >
            <CommissionStatus :commission="commission" :comNumber="comNumber" />
          </template>
        </TableSubtle>
      </section>
    </BackgroundTexture> -->
  </div>
</template>

<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";

useHead({
  title: "Desk at Lavra's space",
});

const auth0 = useAuth0();
const user = auth0?.user;
const isAuthenticated = auth0?.isAuthenticated;
const isLoading = auth0?.isLoading;

const myCommissions = await useFetch("/api/commissions");
const shownCommissions = ref(Array.isArray(myCommissions) ? myCommissions : []);
</script>

<style scoped>
h2 {
  font-family: "Odibee Sans", sans-serif;
  border: 5px solid transparent;
  border-bottom: 12px solid rgb(122, 21, 80);
  border-radius: 50px;
  margin: 0 10vw;
  padding-bottom: 15px;
  /* Cabin: {
    wght: [400, 700],
    ital: [400, 700],
  },
  "Cinzel+Decorative": [700],
  Comfortaa: {
    wght: [300 + ".." + 700],
  },
  "Odibee+Sans": [400],
  Ubuntu: {
    wght: [300, 400, 500, 700],
    ital: [300, 400, 500, 700],
  }, */
}
</style>
