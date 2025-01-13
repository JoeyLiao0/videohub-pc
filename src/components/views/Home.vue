<template>
  <div class="grid-container">

    <div class="search-container">
          <Search class="search" :searchType="'home'"></Search>
    </div>
    <div class="content-container">
      <router-view></router-view>
    </div>

  </div>
</template>

<script setup>
import Search from "../items/Search.vue";
</script>
<style scoped>
/* scoped表示这里的css样式不会泄露到其他组件 */
.grid-container {
  width: 100%;
  height: 100%;
  display: grid;
  padding: 0;
  grid-template-rows: 80px 1fr;
  overflow: hidden;
}
.search-container{
  width: 100%;
  height: 100%;
  grid-row: 1;
}
.content-container{
  background-color: var(--bg);
  width: 100%;
  height: 100%;
  grid-row: 2;
}
</style>
