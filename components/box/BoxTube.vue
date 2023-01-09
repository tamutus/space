<template>
  <div class="tubey">
    <div class="tubes"></div>
    <div class="content"><slot></slot></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.tubey {
  position: relative;
  margin: 150px 5%;
  padding: 10px;
}
.tubes {
  position: absolute;
  left: 10px;
  top: 10px;
  width: calc(100% - 60px);
  height: calc(100% - 60px);
  border: 20px solid rgb(241, 171, 255);
  border-radius: 15px;
  filter: blur(2.5px);
  pointer-events: none;
}
.content {
  margin: 10px;
  padding: 50px;
  background-color: rgba(240, 203, 255, 0.897);
}
</style>
