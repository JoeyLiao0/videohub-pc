<template>
  <div class="grid-container">
    <Auth></Auth>
    <sidebar></sidebar>
    <div class="main-content">
      <router-view></router-view>


      <!-- <router-view>
      </router-view>        
      <button @click="openAuth">aaa</button>
      <button @click="closeAuth">bbb</button> -->
    </div>
  </div>
</template>

<script setup>
// 导入侧边栏组件
import Auth from "./components/items/Auth.vue";
import Sidebar from "./components/items/Sidebar.vue";

import { useStore } from 'vuex';
import router from "./router";

const store = useStore();

function openAuth() {
  store.dispatch('open');
}

function closeAuth() {
  store.dispatch('close');
}

</script>

<style>
/* 此处是根属性 */
html,
body,
#app {
  height: 100%;
  width: 100%;
  margin: 0;
}

.grid-container {
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 11fr;
  width: 100%;
  height: 100%;
}

.main-content{
  grid-column: 11fr;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  background-color:gray;
}
</style>
