<template>
  <div class="grid-container">

    <div class="search-container">
      <Search class="search" :searchType="'collection'"></Search>
    </div>

    <div class="content-container">
      <br>
      <span class="title">默认收藏夹</span>
      <hr class="line">
      <div class="sub-grid-container">
        <Video class="video" v-for="video in videos" :key="video.title" :id="video.id" :title="video.title"
      :description="video.description" :cover_path="video.cover_path" :published_at="video.published_at"
      :view_count="video.view_count" :like_count="video.like_count" :comment_count="video.comment_count"
      :name="video.name" :avatar="video.avatar" :status="video.status" :video_path="video.video_path"
      :is_liked="video.is_liked" :is_collected="video.is_collected"></Video>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted, computed, watch } from 'vue';
import { useStore } from 'vuex';
import Video from '../items/Video.vue';
import Search from '../items/Search.vue';
import { getUsersFavorites } from "@/api/userApi";

const store = useStore(); // 直接访问 Vuex store
const originalVideos = computed(() => store.state.user.myCollectionData);
const collectionLike = computed(() => store.state.user.collectionLike);

const videos = computed(() => {
  return originalVideos.value.filter(
    video => video.title.toLowerCase().includes(collectionLike.value.toLowerCase()) ||
      video.description.toLowerCase().includes(collectionLike.value.toLowerCase())
  );
});

onMounted(async() => {
  try {
    const response = await getUsersFavorites();
    if (response.data.code === 200) {
      store.dispatch('user/setMyCollection', response.data.data.videos);
      // console.log('收藏获取成功');
      // console.log(response.data.data.videos); 
    } else {
      // console.log('收藏获取失败');
    }
  } catch (error) {
    if (error.message === 'AUTHENTICATION_FAILED') {
      store.dispatch('user/openAuth');
    }
    // console.log(error.message);
  }  
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* scoped表示这里的css样式不会泄露到其他组件 */
.grid-container {
  width: 100%;
  height: 100%;
  display: grid;
  padding: 0;
  grid-template-rows: 120px 1fr;
  overflow: auto;
  
  
}

.search-container {
  width: 100%;
  height: 100%;
  grid-row: 1;
}

.content-container {
  /* background-color: var(--primary-100); */
  background-color: var(--bg);
  width: 100%;
  height: 100%;
  grid-row: 2;
}

.sub-grid-container {
  /* 或者设置为一个固定的高度 */
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  /* 定义五列 */
  grid-auto-rows: 250px;
  gap: 20px 10px;
  box-sizing: border-box;
  padding: 10px;
  overflow-y: auto;
}

/* Webkit浏览器滚动条样式 */
.grid-container::-webkit-scrollbar {
  width: 5px;
  /* 滚动条宽度 */
}

.grid-container::-webkit-scrollbar-track {
  background: var(--background-black1);
  /* 滚动条轨道背景色 */
  border-radius: 3px;
  /* 滚动条轨道圆角 */
}

.grid-container::-webkit-scrollbar-thumb {
  background: #888;
  /* 滚动条滑块背景色 */
  border-radius: 6px;
  /* 滚动条滑块圆角 */
}

.grid-container::-webkit-scrollbar-thumb:hover {
  background: var(--text-white2);
  /* 滚动条滑块悬停背景色 */
}

.title {
  font-size: 40px;
  font-style: initial;
  margin-left: 2%;
  color: var(--text-100);
}

.line {
  width: 98%;
  margin-left: 1%;
  border: none;
  height: 0.5px;
  background-color: #919191;
}
</style>
