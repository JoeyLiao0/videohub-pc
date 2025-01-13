<template>
    <div class="left-container scroll-sticky">
        <!-- 视频标题，发布时间，返回按钮 -->
        <div class="viewbox_info">
            <div class="viewbox_report">
                <div class="video-title">
                    <span>{{ title }}</span>
                </div>
            </div>
            <div class="video-meta">
                <span>{{ date(published_at) }}</span>
            </div>
        </div>
        <br>
        <!-- 视频播放器 -->
        <div class="video-wrap">
            <video id="videoPlayer" style="width: 100%; height:100%; object-fit: fill;" controls :src="video_path">
                <source :src="video_path" type="video/mp4" />
                <p>视频加载失败</p>
            </video>
        </div>
        <!-- 底部工具栏 -->
        <div class="video-toolbar-container">
            <div class="video-like" title="点赞" :class="{ 'clicked_like': temp.is_liked }" @click="clicked_like">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M4 21h1V8H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2M20 8h-7l1.122-3.368A2 2 0 0 0 12.225 2H12L7 7.438V21h11l3.912-8.596L22 12v-2a2 2 0 0 0-2-2" />
                </svg>
            </div>
            <div class="video-collect" title="收藏" :class="{ 'clicked_collect': temp.is_collected }"
                @click="clicked_collect">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 36 36">
                    <path fill="currentColor"
                        d="M34 16.78a2.22 2.22 0 0 0-1.29-4l-9-.34a.23.23 0 0 1-.2-.15l-3.11-8.4a2.22 2.22 0 0 0-4.17 0l-3.1 8.43a.23.23 0 0 1-.2.15l-9 .34a2.22 2.22 0 0 0-1.29 4l7.06 5.55a.23.23 0 0 1 .08.24l-2.43 8.61a2.22 2.22 0 0 0 3.38 2.45l7.46-5a.22.22 0 0 1 .25 0l7.46 5a2.2 2.2 0 0 0 2.55 0a2.2 2.2 0 0 0 .83-2.4l-2.45-8.64a.22.22 0 0 1 .08-.24Z"
                        class="clr-i-solid clr-i-solid-path-1" />
                    <path fill="none" d="M0 0h36v36H0z" />
                </svg>
            </div>
        </div>
        <!-- 视频简介 -->
        <div class="video-desc-container">
            <div class="video-desc-info" ref="desc_info">
                <p ref="desc_text">
                    {{ description }}
                </p>
            </div>
            <!-- <button v-if="showOk" ref="toggleButton" class="toggle-button" @click="handlerClick">更多</button> -->
        </div>

    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex';
import { postVideosLike, deleteVideosLike, postUsersFavorites, deleteUsersFavorites } from '@/api/userApi';

/* 切换为videoList */
const store = useStore(); // 直接访问 Vuex store

// 定义接收的props
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
    is_collected: Boolean
});

function constructObjectFromProps() {
    return {
        id: props.id,
        title: props.title,
        description: props.description,
        cover_path: props.cover_path,
        published_at: props.published_at,
        view_count: props.view_count,
        like_count: props.like_count,
        comment_count: props.comment_count,
        name: props.name,
        avatar: props.avatar,
        status: props.status,
        video_path: props.video_path,
        is_liked: props.is_liked,
        is_collected: props.is_collected
    };
}

const temp = ref(constructObjectFromProps());

function date(timestamp) {
    return new Date(timestamp).toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });
};

/* 控制 视频简介相关的展开/关闭按钮  */
const showOk = ref(false);
const desc_info = ref(null);
const toggleButton = ref(null);
const desc_text = ref(null);

// 判断是否需要显示展开/关闭按钮
function checkDesc() {
    if (desc_text.value) {
        const textHeight = desc_text.value.scrollHeight;
        if (textHeight > 80) {
            showOk.value = true;
        }
    }
}

async function clicked_like() {
    temp.value.is_liked = !temp.value.is_liked;
    if (props.id != "-1") {
        const videoData = {
            vid: props.id
        }
        if (temp.value.is_liked == true) {
            try {
                const response = await postVideosLike(videoData);
                if (response.data.code === 200) {
                    // // console.log('点赞成功');
                } else {
                    // // console.log('点赞失败');
                }
            } catch (error) {
                // // console.log('点赞请求有误');
            }
        } else {
            try {
                const response = await deleteVideosLike(videoData);
                if (response.data.code === 200) {
                    // // console.log('取消点赞成功');
                } else {
                    // // console.log('取消点赞失败');
                }
            } catch (error) {
                // // console.log('点赞请求有误');
            }
        }
    }
}
async function clicked_collect() {        
    temp.value.is_collected = !temp.value.is_collected;
    if (props.id != "-1") {

        const videoData = {
            vid: props.id
        }
        if (temp.value.is_collected == true) {
            try {
                const response = await postUsersFavorites(videoData);
                if (response.data.code === 200) {
                    // console.log('收藏成功');
                } else {
                    // console.log('收藏失败');
                }
            } catch (error) {
                // console.log('收藏请求有误');
            }
        } else {
            try {
                const response = await deleteUsersFavorites(videoData);
                if (response.data.code === 200) {
                    // console.log('取消收藏成功');
                } else {
                    // console.log('取消收藏失败');
                }
            } catch (error) {
                // console.log('收藏请求有误');
            }
        }
    }
}

// 删除视频源
function removeVideoSrc() {
    const videoPlayer = document.getElementById("videoPlayer");
    videoPlayer.removeAttribute('src');
    while (videoPlayer.firstChild) {
        videoPlayer.removeChild(videoPlayer.firstChild);
    }
}

// 添加视频源
function addVideoSrc(newValue) {
    const videoPlayer = document.getElementById("videoPlayer");
    if (videoPlayer) {
        // 设置新的视频源
        videoPlayer.setAttribute('src', newValue);
        // 重新加载视频以应用新的源
        videoPlayer.load();
    } else {
        console.error('Video player element not found');
    }
}

watch(() => props.video_path, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        // 如果新值与旧值不同，则更新视频源
        addVideoSrc(newValue);
    }
})

onMounted(() => {
    // 检查描述信息
    checkDesc();
    // 移除视频源（如果有的话）
    removeVideoSrc();
    // 如果有初始视频 URL，则添加之
    if (props.video_path) {
        addVideoSrc(props.video_path);
    }
});



</script>

<style scoped>
/* 烟花粒子 */
@keyframes fireworks {
    0% {
        transform: translateY(0) scale(1);
    }

    25% {
        transform: translateY(-10px) scale(1.5);
    }

    75% {
        transform: translateY(-5px) scale(2);
    }

    100% {
        transform: translateY(0) scale(1);
    }
}

/* 视频播放整体 */
.left-container {
    width: 100%;
    margin: 0px;
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: rgba(1, 1, 1, 0.8);
    border-radius: 8px;
}

/* 视频播放上部标题 */
.viewbox_info {
    position: relative;
    height: 80px;
    left: 10px;
    box-sizing: border-box;
    /* padding-top: 22px; */
}

/*  视频播放标题，日期 */
.viewbox_report {
    width: 100%;
    height: 60%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* 垂直居中对齐子元素 */
}

/* 标题文字 */
.viewbox_info .video-title {
    color: var(--text-white1);
    font-size: 20px;
    cursor: pointer;
}

/* 发布时间 */
.video-meta span {
    color: var(--text-white3);
}

/* 视频播放器 */
.video-wrap {
    width: 100%;
    height: 60%;
    background-color: var(--primary-100);
    border-radius: 2px;
}

/* 点赞收藏 */
.video-toolbar-container {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background-color: var(--background-black4);
    border-bottom: solid 1px var(--background-black2);
    color: rgb(169, 171, 173);
}

.video-like,
.video-collect {
    margin-left: 20px;
    /* 在两个图标之间添加10px的间隔 */
}

.video-toolbar-container .video-like:hover {
    transform: scale(1.1);
    cursor: pointer;
    transition: transform 0.3s ease;
    transition: color 0.3s ease;
}

.video-toolbar-container .video-collect:hover {
    transform: scale(1.1);
    cursor: pointer;
    transition: transform 0.3s ease;
    transition: color 0.3s ease;
}

.video-like.clicked_like,
.video-collect.clicked_collect {
    color: rgb(59, 107, 170);
    /* animation: fireworks 0.5s forwards; */
    /* transition: transform 0.5s ease-in-out; */
}

/* 视频播放简介 */
.video-desc-container {
    width: 100%;
    /* background-color: var(--background-black4); */
    display: flex;
    flex-direction: column;
}

.video-desc-info {
    margin-left: 10px;
    min-height: 60px;
    max-height: 200px;
    margin-bottom: 20px;
    font: 13px;
    color: var(--text-white2);
    overflow: hidden;
    /* 超出部分隐藏 */
    transition: max-height 0.5s ease-in-out;
}

.toggle-button {
    width: 60px;
    font-size: 13px;
    background-color: var(--background-black4);
    border: snow 1px rgb(7, 7, 7, 0.5);
    color: var(--text-white2);
    cursor: pointer;
    transition: color 0.5s ease-in-out;
}

.toggle-button:hover {
    background-color: #111111;
}
</style>