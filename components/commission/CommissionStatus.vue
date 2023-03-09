<template>
  <BackgroundHologram :delay="comNumber * 2">
    <h3>{{ commission.title }}</h3>

    <template #display>
      <img v-if="commission.image" :src="commission.image" />
      <p>
        Commission Status:
        <BoxAlmond
          :flavor="
            ['Up to date', 'Current'].includes(commission.status)
              ? 'wasabi'
              : 'hot'
          "
        >
          {{ commission.status ?? "Unknown" }}
        </BoxAlmond>
      </p>
    </template>
  </BackgroundHologram>
</template>

<script setup lang="ts">
const props = defineProps({
  commission: {
    type: Object,
    required: true,
  },
  comNumber: {
    type: Number,
    default: 0,
  },
});
</script>

<style scoped>
img {
  max-height: 100%;
  max-width: 100%;
}
</style>
