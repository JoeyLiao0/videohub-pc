<template>
    <div class="right-container">
        <!-- up信息 -->
        <div class="right-up-info">
            <div class="up-panel-container">
                <div class="up-image">
                    <img :src="avatar" />
                </div>
                <div class="up-name">
                    <span> {{ name }} </span>
                </div>            
                <el-button class="return_button" type="primary" @click="lastPage">返回上一页</el-button>
            </div>

        </div>
        <!-- 推荐列表 -->
        <div class="video-list">
            <VideoSmallCard class="video" v-for="video in videos" :key="video.title" :id="video.id" :title="video.title"
                :description="video.description" :cover_path="video.cover_path" :published_at="video.published_at"
                :view_count="video.view_count" :like_count="video.like_count" :comment_count="video.comment_count"
                :name="video.name" :avatar="video.avatar" :status="video.status" :video_path="video.video_path"
                :is_liked="video.is_liked" :is_collected="video.is_collected"></VideoSmallCard>
        </div>
    </div>
</template>

<script setup>
import VideoSmallCard from "./VideoSmallCard.vue";
import { useStore } from "vuex";
import { computed } from "vue";

/* 切换为videoList */
const store = useStore(); // 直接访问 Vuex store
//TODO:加上网络逻辑
const videos = computed(() => store.state.home.videoHomeData); // 从 store 中获取 videoHomeData 数组
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
    id: String,
    title: String,
    description: String,
    cover_path: String,
    published_at: Number,
    view_count: Number,
    like_count: Number,
    comment_count: Number,
    name: String,
    avatar: String,
    status: Number,
    video_path: String,
    is_liked: Boolean,
    is_collected: Boolean,
});

function lastPage() {
    router.go(-1);
}
</script>


<style scoped>
/* 右侧容器 */
.right-container {
    display: grid;
    position: relative;
    /* grid-template-columns: 250px; */
    background-color: rgba(1, 1, 1, 0.8);

    justify-content: center;
    width: 100%;
    border-radius: 8px;
}

.right-up-info {
    width: 100%;
    height: 84px;
    grid-row: 1;
    grid-column: 1;
}

/* 作者信息储备容器 */
.up-panel-container {
    display: flex;
    align-items: center;
    background-color: rgba(1, 1, 1, 0.8);

    border-bottom: 1px solid black;
    /* border-radius: 20px; */
    padding: 10px;
    /* 添加一些内边距，使得布局更美观 */
    gap: 10px;
    /* 在项目之间添加间距 */
}

/* 作者头像 */
.up-image {
    height: 70px;
    width: 70px;
    border-radius: 100%;
    /* overflow: hidden; */
}

.up-image img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
    object-fit: cover;
}

.up-name {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-white2);
    white-space: nowrap;
    /* 防止文字换行 */
    margin-top: -15px;
}

/* .up-name span:hover {
    cursor: pointer;
    color: var(--text-white1);
    transition: color 0.3s ease;
} */

/* 视频列表 */
.video-list {
    padding-top: 20px;
    padding-bottom: 20px;
    grid-column: 1;
    width: 100%;
    height: 520px;
    display: grid;
    grid-auto-rows: 80px;
    gap: 10px;
    /* 网格项之间的间隔 */
    /* background-color: var(--background-black2); */
    margin-top:10px;
    /* margin-left:5%; */
    overflow: auto;
    /* position:fixed; */
}
/* Webkit浏览器滚动条样式 */
.video-list::-webkit-scrollbar {
  width: 0.5px;
  /* 滚动条宽度 */
}

.video-list::-webkit-scrollbar-track {
  background: var(--background-black1);
  /* 滚动条轨道背景色 */
  border-radius: 3px;
  /* 滚动条轨道圆角 */
}

.video-list::-webkit-scrollbar-thumb {
  background: #888;
  /* 滚动条滑块背景色 */
  border-radius: 6px;
  /* 滚动条滑块圆角 */
}

.video-list::-webkit-scrollbar-thumb:hover {
  background: var(--text-white2);
  /* 滚动条滑块悬停背景色 */
}


/* 视频小框 */
.video-card {
    margin: 0;
    padding: 0;
    margin-bottom: 12px;
}

.return_button{
    position: relative;
    left: 0px;
    top:-10px;
}


</style>