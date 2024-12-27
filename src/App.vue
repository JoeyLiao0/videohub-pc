<template>
  <div class="app-grid-container">
    <Auth></Auth>
    <sidebar></sidebar>
    <div class="app-main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
// 导入侧边栏组件
import Auth from "./components/items/Auth.vue";
import Sidebar from "./components/items/Sidebar.vue";
</script>

<style>
/* 此处是根属性 */
html,
body,
#app {
  background-color: var(--background-black1);
  height: 100%;
  width: 100%;
  margin: 0;
}

.app-grid-container {
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 11fr;
  grid-template-rows: 1fr;
  width: 100%;
  height: 100%;
  background-color: var(--background-black1);
}

.app-main-content {
  grid-column: 11fr;
  height: 100%;
  width: 100%;
  min-width: 1200px;
  min-height: 600px;

  overflow-y: auto;
  background-color: var(--silver);
}

/* 主题颜色 */
:root {
  --background-black1: #121212;
  --background-black2: #161616;
  --background-black3: #252525;
  --background-black4: #303030;

  --text-white1: rgba(255, 255, 255, 0.87);
  --text-white2: rgba(255, 255, 255, 0.60);
  --text-white3: rgba(255, 255, 255, 0.38);

  --grey1: #1c1c1c;
  --grey2: #363636;
  --grey3: #696969;
  --grey4: #778899;

  --silver: #C0C0C0;

  --red1: #8B0000;

  --on-green: #32CD32;
  --on-green2: #80d380;
  --off-red: #FF4500;
  --off-red2: #faaf93;

  --white: rgba(255, 255, 255, 1);

  --yellow: rgba(235, 188, 122, 1);

  --primary-100: #272f3d;
  --primary-200: #56647b;
  --primary-225: #44659e;
  --primary-250: #779cdb;
  --primary-300: #b4c2dc;
  --accent-100: #FF4D4D;
  --accent-200: #ffecda;
  --text-100: #FFFFFF;
  --text-200: #e0e0e0;
  --bg-100: #1A1F2B;
  --bg-200: #292e3b;
  --bg-300: #414654;

}
</style>
