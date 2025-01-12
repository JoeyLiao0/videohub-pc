<template>
  <div class="VideoPlay-Win" :key="id">
    <div class="VideoPlay"  v-if="video!=null">
      <VideoLeftPlayer class="video" :id="video.id" :title="video.title"
        :description="video.description" :cover_path="video.cover_path" :published_at="video.published_at"
        :view_count="video.view_count" :like_count="video.like_count" :comment_count="video.comment_count"
        :name="video.name" :avatar="video.avatar" :status="video.status" :video_path="video.video_path"
        :is_liked="video.is_liked" :is_collected="video.is_collected"></VideoLeftPlayer>
      <Comment2 :id="video.id"></Comment2>
    </div>
    <div class="VideoList" v-if="video!=null">
      <VideoRightList class="video" :id="video.id" :title="video.title"
        :description="video.description" :cover_path="video.cover_path" :published_at="video.published_at"
        :view_count="video.view_count" :like_count="video.like_count" :comment_count="video.comment_count"
        :name="video.name" :avatar="video.avatar" :status="video.status" :video_path="video.video_path"
        :is_liked="video.is_liked" :is_collected="video.is_collected"></VideoRightList>
    </div>
  </div>
</template>

<script setup>
import VideoLeftPlayer from "../items/VideoLeftPlayer.vue"
import VideoRightList from "../items/VideoRightList.vue"
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import Comment2 from '../items/Comment2.vue';

/* 切换为videoList */
const store = useStore(); // 直接访问 Vuex store
const video = computed(() => store.state.home.currentVideoData); // 从 store 中获取 currentVideoData
const id =ref((video!=null)?video.id:-1);
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* scoped表示这里的css样式不会泄露到其他组件 */
.VideoPlay-Win {
  max-width: 2000px;
  min-width: 1000px;
  width: auto;
  height: 100%;
  grid-gap: 0 50px;
  grid-template-columns: 3fr 1fr;
  margin: 0 auto;
  padding: 30px 20px;
  /* 这里加了50px就应该在min-width-50px */
  display: grid;
  box-sizing: border-box;
  justify-content: center;
  position: relative;
  background-color: var(--bg);
  overflow-y: auto;

}

/* Webkit浏览器滚动条样式 */
.VideoPlay-Win::-webkit-scrollbar {
  width: 5px;
  /* 滚动条宽度 */
}

.VideoPlay-Win::-webkit-scrollbar-track {
  background: var(--background-black1);
  /* 滚动条轨道背景色 */
  border-radius: 3px;
  /* 滚动条轨道圆角 */
}

.VideoPlay-Win::-webkit-scrollbar-thumb {
  background: #888;
  /* 滚动条滑块背景色 */
  border-radius: 6px;
  /* 滚动条滑块圆角 */
}

.VideoPlay-Win::-webkit-scrollbar-thumb:hover {
  background: var(--text-white2);
  /* 滚动条滑块悬停背景色 */
}

.VideoPlay {
  display: grid;
  grid-template-rows: auto 1fr;
  grid-column: 1;
}

.VideoLeftPlayer {
  min-height: 500px;
  max-height: 500px;
}

.VideoList {
  /* position: fixed; */
  grid-column: 2;
  width: 100%;
}




</style>