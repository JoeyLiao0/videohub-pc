<!-- src/components/Auth.vue -->
<template>
  <div class="auth" v-if="showAuth">
    <div class="auth-overlay"></div>
    <div class="auth-content">
        <button @click="openAuth"> open</button>
        <button @click="closeAuth">close</button>
      </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();

const showAuth = computed(() => store.state.showAuth);

// dsafdfsdfd
// sdfdfdfds
function openAuth() {
  store.dispatch('open');
}

function closeAuth() {
  store.dispatch('close');
}
</script>

<style scoped>
.auth {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 998;
  /* 确保蒙版在最上层 */
  background-color: rgba(69, 21, 146, 0.5);
}

.auth-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(160, 37, 37, 0.5);
  /* 半透明背景 */
  z-index: 999;
  /* 确保背景在内容之下 */
}

.auth-content {
  position: absolute;
  top: 50%; /* 向下移动50%的高度 */
  left: 50%; /* 向右移动50%的宽度 */
  transform: translate(-50%, -50%); /* 将元素移动到容器中心 */
  width: 50%;
  height: 50%;
  z-index: 1000;
  /* 确保内容在最上层 */
  background-color: rgb(9, 35, 79);
  border-radius: 5px;
}
</style>