<template>
  <div class="box" id="playerBox">
    <video id="player" style="width: 100%; height: 135px; object-fit: fill" disablePictureInPicture loop>
      <source :src="videoUrl" type="video/mp4" />
      <p>您的浏览器不支持 视频播放。</p> <!-- 提示信息 -->
    </video>

    <!--封面-->>
    <div class="cover" :class="{ hidden: !isCover }">
      <img :src="coverUrl" alt="" />
    </div>

    <!-- 视频信息 -->
    <div class="info">
      <div class="title">
        <span>{{ title }}</span>
      </div>
      <div class="desc">
        <span id="author">{{ author }}</span>
        <span>·</span>
        <span id="time">{{ release_time }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';

let title = "鲑鱼盛宴";
let author = "阿嚏";
let release_time = "2023-11-13";

const isCover = ref(true);
const videoUrl = require("@/assets/movie.mp4");
const coverUrl = require('@/assets/images/img3.png');
function playVideo() {
  const video = document.getElementById("player");
  video.play();
  isCover.value = false;  // 鼠标移入时隐藏封面
}
function pauseVideo() {
  const video = document.getElementById("player");
  video.pause();
  isCover.value = true;   // 鼠标移出时显示封面
}

function debounce(fn, delay) {  // 防抖函数
  let timer = null;
  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
}
const debouncedPlayVideo = debounce(playVideo, 100);
const debouncedPauseVideo = debounce(pauseVideo, 100);

onMounted(() => {
  const box = ref(document.getElementById("playerBox"));
  if (box.value) {
    box.value.addEventListener('mouseenter', debouncedPlayVideo);
    box.value.addEventListener('mouseleave', debouncedPauseVideo);
  }
});

</script>

<style scoped>
.box {
  width: 240px;
  height: 185px;
  position: relative;
  /* 确保子元素可以相对于此容器定位 */
  overflow: hidden;
  transition: transform 0.3s ease;
  border-radius: 5px;
}

.box:hover {
  border-color: #726c6c;
  /* 悬停时改变边框颜色 */
  transform: scale(1.03);
  cursor: pointer;
}

.cover {
  top: 0;
  left: 0;
  opacity: 1;
  width: 100%;
  height: 135px;
  position: absolute;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
  /* 添加过渡效果 */
}

.cover.hidden {
  opacity: 0;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 保持封面图的宽高比 */
}

.info {
  position: absolute;
  width: 100%;
  top: 135px;
  left: 0;
  background-color: rgba(20, 19, 19, 0.5);
  /* 背景半透明 */
  text-align: left;
  border-top: #f8e9e9 solid 1px;
}

.title {
  font-size: 20px;
  margin-bottom: 3px;
  color: aliceblue;
}

.desc {
  font-size: 16px;
  color: rgb(192, 198, 198);
}

.desc span {
  margin-right: 10px;
}
</style>