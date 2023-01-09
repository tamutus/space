<template>
  <h1>
    <slot></slot>
  </h1>
</template>

<script setup lang="ts"></script>

<style scoped>
h1 {
  position: sticky;
  display: inline-block;
  top: 0px;
  left: 0;
  max-width: calc(100vw - 8rem - 27px);
  box-sizing: border-box;
  margin: 15vh 0 0 0;
  padding: 15px 20px 13px 5vw;
  z-index: 10;
  transition: margin-left 1.5s, background-color 1.5s;
  background-color: rgba(61, 4, 87, 0.651);
  color: rgb(228, 195, 255);
  border-radius: 0 15px 15px 0;
  overflow-wrap: break-word;
}
@media screen and (max-width: 990px) {
  h1 {
    font-size: 2rem;
  }
}
@media screen and (max-width: 500px) {
  h1 {
    margin-right: auto;
    font-size: 1.5rem;
  }
}
</style>
