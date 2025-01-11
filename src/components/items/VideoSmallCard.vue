<template>
    <div class="box" ref="playerBox" @click="videoPlayPage">
        <div class="video-container">
            <video ref="video" muted disablePictureInPicture loop>
                <source :src="video_path" type="video/mp4" />
                <p>您的浏览器不支持视频播放。</p> <!-- 提示信息 -->
            </video>

            <!--封面-->
            <div class="cover" :class="{ hidden: !isCover }">
                <img ref="coverImage" alt="封面图片" />
            </div>
        </div>


        <!-- 视频信息 -->
        <div class="info">
            <div class="title">
                <span>{{ title }}</span>
            </div>
            <div class="count">
                <span>播放量 {{ view_count }}</span>
                <span>点赞数 {{ like_count }}</span>
            </div>
            <div class="desc">
                <span id="author">{{ name }}</span>
                <span>·</span>
                <span id="time">{{ date(published_at) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from "vue-router";

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

function date(timestamp) {
    return new Date(timestamp).toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });
};

const store = useStore(); // 直接访问 Vuex store

// 响应式变量
const isCover = ref(true);
const video = ref(null);
const playerBox = ref(null);
const coverImage = ref(null);

function playVideo() {
    if (video.value) {
        // 确保 video.value 不是 undefined
        video.value.play()
            .then(() => {
                isCover.value = false;  // 鼠标移入时隐藏封面
            })
            .catch(error => {
                console.error('播放视频时发生错误:', error);
            });
    } else {
        console.error('video element is undefined');
    }
}

function pauseVideo() {
    if (video.value) {
        // 直接调用 pause()，不使用 then 或 catch
        video.value.pause();
        isCover.value = true;  // 鼠标移出时展示封面
    } else {
        console.error('video element is undefined');
    }
}

// 使用事件委托
function addEventListeners() {
    if (playerBox.value) {
        playerBox.value.addEventListener('mouseenter', playVideo);
        playerBox.value.addEventListener('mouseleave', pauseVideo);
    }
}

function removeEventListeners() {
    if (playerBox.value) {
        playerBox.value.removeEventListener('mouseenter', playVideo);
        playerBox.value.removeEventListener('mouseleave', pauseVideo);
    }
}

// 在组件挂载时添加事件监听器
onMounted(() => {
    addEventListeners();
});

// 在组件卸载时移除事件监听器
onUnmounted(() => {
    removeEventListeners();
});

// 懒加载封面图
onMounted(() => {
    // 确保 coverImage.value 是一个 DOM 元素
    if (coverImage.value) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    coverImage.value.src = props.cover_path;
                    observer.unobserve(coverImage.value);
                }
            });
        });

        observer.observe(coverImage.value);
    } else {
        console.error('coverImage element is undefined');
    }
});

const router = useRouter();

function videoPlayPage() {
    const currentVideoData = constructObjectFromProps();
    store.dispatch('home/setCurrentVideoData', currentVideoData);
    router.push('/videoPlay?'+props.id);
}

</script>

<style scoped>
.box:hover {
  cursor: pointer;
}
.box {
  display: grid;
  /* overflow: hidden; */
  position: relative;
  /* padding-left: 10px; */
  width: auto; /* 根据需要调整宽度 */
  height: 80px; /* 固定高度，与视频高度相同 */
  grid-template-rows: 1fr; /* 只需要一行 */
  grid-template-columns: 120px 1fr; /* 视频宽度自适应，信息占剩余空间 */
  transition: transform 0.3s ease;
  border-radius: 3px;
  /* border: solid var(--grey2) 1px; */
}

.video-container {
  position: relative;
  width: 120px; /* 视频宽度 */
  height: 80px; /* 视频高度 */
}

video {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.cover {
  position: absolute;
  opacity: 1;
  width: 100%;
  height: 100%;
  top:0px;
  left:0px;
  display: flex;
  transition: opacity 0.3s ease;

  border: solid var(--grey2) 1px;
  border-radius: 8px;

}

.cover:hover{
  border-color: rgb(121, 152, 177);
}

.cover.hidden {
  opacity: 0;
}

.cover img {
  /* border: 1px solid white; */
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  color: aliceblue;
}

.info {
  grid-row: 1;
  grid-column: 2;
  /* background-color: var(--primary-100); */
  padding: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 文本超出部分显示省略号 */
  white-space: nowrap; /* 防止文本自动换行 */
}

.title:hover{
    color: aqua;
}

.title {
  font-size: 16px;
  color: var(--text-white1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.count {
  font-size: 10px;
  color: var(--text-white2);
}

.desc {
  font-size: 12px;
  color: var(--text-white2);
}

.desc span,
.count span {
  margin-right: 10px;
}
</style>