<template>
  <div id="shiny-generator">
    <h3>Get a shiny Pokémon</h3>
    <img :src="shinyURL || ''" />
    <div class="buttons">
      <button id="xhr" @click="newXHR()">XHR</button>
      <button id="fetch" @click="newFetch()">Fetch</button>
      <!-- <button id="jquery" @click="newjQuery">jQuery</button>
  <button id="axios" @click="newAxios">Axios</button> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref } from "vue";

let pokemon: Ref<number> = ref(1);
const baseUrl = "https://pokeapi.co/api/v2/pokemon/";

const shinyURL = ref(null);

function newShiny(data: any) {
  shinyURL.value = data.sprites.front_shiny;
}

function newFetch() {
  randomize();
  fetch(`${baseUrl}${pokemon.value}`)
    .then(handleErrors)
    .then(parseJSON)
    .then(newShiny)
    .catch(console.error);
}

function newXHR() {
  randomize();
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200)
      newShiny(JSON.parse(xhr.responseText));
  };
  xhr.open("GET", `${baseUrl}${pokemon.value}`);
  xhr.send();
}

function parseJSON(res: any) {
  if (!(res.json instanceof Function)) {
    throw Error("No JSON method on the response");
  } else {
    return res.json();
  }
}
function handleErrors(res: any) {
  if (!res.ok) {
    throw Error(res.status);
  }
  return res;
}
// function newjQuery(){
//   randomize();
//   $.getJSON(baseUrl + pokemon)
//   .done(data => newShiny(data))
//   .fail((error) => {
//     console.log(error);
//   });
// }

// function newAxios() {
//   randomize();
//   axios
//     .get(baseUrl + pokemon)
//     .then((res) => newShiny(res.data))
//     .catch((err) => console.log(err));
// }

function randomize() {
  pokemon.value = Math.ceil(Math.random() * 1008);
}
</script>

<style scoped>
#shiny-generator {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
}
h3 {
  margin: 20px auto;
  padding: 20px;
  height: 100px;
  line-height: 100px;
  color: skyblue;
  background-color: black;
  text-align: center;
  border-radius: 10px;
}
img {
  display: block;
  height: 200px;
  margin: 50px auto;
}
.buttons {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
}
button {
  width: 200px;
  padding: 10px;
  font-size: 1.5em;
  color: violet;
  background-color: black;
  border-radius: 20px;
  border: 2px solid violet;
  display: block;
  margin: 20px auto;
  transition: all 0.5s;
}
button:hover {
  color: black;
  border-color: black;
  background-color: violet;
}
button:active {
  color: grey;
  background-color: pink;
  transition: color 0s, background-color 0s !important;
}
button:focus {
  outline: none;
}
</style>
