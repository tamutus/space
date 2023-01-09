<template>
  <div>
    <BackgroundImage imageFileName="assets/photos/misty.jpg">
      <NavHeader> Reconcilography </NavHeader>
      <div class="padded">
        <ImageFocused
          image-file-name="assets/photos/Transparent Wreck.png"
          alt-text="Goat person in jeans and "
          alignment="right"
        >
          <BoxWaterfall>
            <template #1> Look! </template>
            <template #5> I'm a </template>
            <template #7> goat! </template>
          </BoxWaterfall>
        </ImageFocused>
      </div>
    </BackgroundImage>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
