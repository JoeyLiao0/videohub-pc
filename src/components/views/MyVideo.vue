<template>
  <div class="container">
    <br>
    <span class="title">审核通过</span>
    <hr class="line">
    <div class="sub-grid-container">
      <!-- 使用 v-for 渲染审核通过的视频组件列表 -->
      <Video class="video" v-for="video in approvedVideos" :key="video.title" :id="video.id" :title="video.title"
      :description="video.description" :cover_path="video.cover_path" :published_at="video.published_at"
      :view_count="video.view_count" :like_count="video.like_count" :comment_count="video.comment_count"
      :name="video.name" :avatar="video.avatar" :status="video.status" :video_path="video.video_path"
      :is_liked="video.is_liked" :is_collected="video.is_collected"></Video>
      </div>
    <br>

    <span class="title">待审核</span>
    <hr class="line">
    <div class="sub-grid-container">
      <!-- 使用 v-for 渲染待审核的视频组件列表 -->
      <Video class="video" v-for="video in pendingVideos" :key="video.title" :id="video.id" :title="video.title"
      :description="video.description" :cover_path="video.cover_path" :published_at="video.published_at"
      :view_count="video.view_count" :like_count="video.like_count" :comment_count="video.comment_count"
      :name="video.name" :avatar="video.avatar" :status="video.status" :video_path="video.video_path"
      :is_liked="video.is_liked" :is_collected="video.is_collected"></Video>
    </div>
    <br>

    <span class="title">审核未通过</span>
    <hr class="line">
    <div class="sub-grid-container">
      <!-- 使用 v-for 渲染审核未通过的视频组件列表 -->
      <Video class="video" v-for="video in rejectedVideos" :key="video.title" :id="video.id" :title="video.title"
      :description="video.description" :cover_path="video.cover_path" :published_at="video.published_at"
      :view_count="video.view_count" :like_count="video.like_count" :comment_count="video.comment_count"
      :name="video.name" :avatar="video.avatar" :status="video.status" :video_path="video.video_path"
      :is_liked="video.is_liked" :is_collected="video.is_collected"></Video>
    </div>
    <br>

    <span class="title">被封禁</span>
    <hr class="line">
    <div class="sub-grid-container">
      <!-- 使用 v-for 渲染被封禁的视频组件列表 -->
      <Video class="video" v-for="video in bannedVideos" :key="video.title" :id="video.id" :title="video.title"
      :description="video.description" :cover_path="video.cover_path" :published_at="video.published_at"
      :view_count="video.view_count" :like_count="video.like_count" :comment_count="video.comment_count"
      :name="video.name" :avatar="video.avatar" :status="video.status" :video_path="video.video_path"
      :is_liked="video.is_liked" :is_collected="video.is_collected"></Video>
    </div>
  </div>
</template>

<script setup>
import { computed,onMounted } from 'vue';
import { useStore } from 'vuex';
import Video from '../items/Video.vue';
import { getUsersVideos } from "@/api/userApi";
import { ElMessage } from 'element-plus';
const store = useStore(); // 直接访问 Vuex store
const videos = computed(()=>store.state.user.myVideoData); // 从 store 中获取 myVideoData 数组

// 创建计算属性来分离不同状态的视频
const approvedVideos = (videos.value != null) ? computed(() => videos.value.filter(video => video.status === 0)) : null;
const pendingVideos = (videos.value != null) ?computed(() => videos.value.filter(video => video.status === 1)):null;
const rejectedVideos = (videos.value != null) ?computed(() => videos.value.filter(video => video.status === 2)):null;
const bannedVideos = (videos.value != null) ?computed(() => videos.value.filter(video => video.status === 3)):null;

onMounted(async() => {
  try {
    const response = await getUsersVideos();
    if (response.data.code === 200) {
      store.dispatch('user/setMyVideo', response.data.data.videos);
      // // console.log(response.data.data.videos); 
    } else {
      // // console.log('我的发布视频获取失败');
    }
  } catch (error) {      
    if (error.message === 'AUTHENTICATION_FAILED') {
      store.dispatch('user/openAuth');
    }else{
      ElMessage.error("网络问题，请稍后再试");
    }
    // // console.log("here",error.message);
  }  
});
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* scoped表示这里的css样式不会泄露到其他组件 */
.container{
  scrollbar-width: thin; /* 设置滚动条宽度 */
  width: 100%;
  height: 100%;
  overflow-y:auto;
  /* background-color: var(--primary-100); */
  background-color: var(--bg);
}

/* Webkit浏览器滚动条样式 */
.container::-webkit-scrollbar {
  width: 5px; /* 滚动条宽度 */
}

.container::-webkit-scrollbar-track {
  background: var(--background-black1);/* 滚动条轨道背景色 */
  border-radius: 3px; /* 滚动条轨道圆角 */
}

.container::-webkit-scrollbar-thumb {
  background: #888; /* 滚动条滑块背景色 */
  border-radius: 6px; /* 滚动条滑块圆角 */
}

.container::-webkit-scrollbar-thumb:hover {
  background: var(--text-white2); /* 滚动条滑块悬停背景色 */
}

.sub-grid-container {
  margin-left: 5%;
  width: 90%;
  /* min-height: 250px; */
  /* 或者设置为一个固定的高度 */
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 250px;
  /* 定义五列 */
  gap: 20px 10px;
  box-sizing: border-box;
  overflow-y: hidden;
  /* background-color: var(--primary-300); */
  border-radius: 6px;
}

.title {
  font-size: 40px;
  font-style:initial;
  margin-left: 5.5%;
  color:var(--text-100);
}

.line{
  width: 90%;
  margin-left:5%;
  border:none;
  height: 0.5px;
  /* background-color:var(--primary-200); */
  background-color: #919191;
}


</style>