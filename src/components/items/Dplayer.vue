<template>
    <div class="box" @click="handleClick">
        <div id="dplayer">
        </div>
        <div class="info">
            <div class="title">
                <span>标题: dsadfsd</span>    
            </div>
            <div class="desc">
                <span>描述,asdfsadfsdfsdfds</span> 
            </div>
        </div>
    </div>

</template>
 
<script setup name="Dplayer">
import DPlayer from 'dplayer';
import Hls from 'hls.js';
import { onMounted, onBeforeUnmount } from 'vue';

let player;

const handleClick = (e) => {
    e.preventDefault();
    console.log('点击了播放器');
};

onMounted(() => {
  player = new DPlayer({
    container: document.getElementById('dplayer'), // 容器元素
    theme: '#FADFA3', // 主题颜色
    loop: true, // 循环播放
    lang: 'zh-cn', // 语言
    volume: 1, // 默认音量
    autoplay: false,
    mutex: true, // 互斥，默认同时只能有一个播放
    controls: false, // 不显示播放器控件
    video: {
      url: 'https://api.dogecloud.com/player/get.m3u8?vcode=5ac682e6f8231991&userId=17&ext=.m3u8',
      type: 'customHls',
      pic: require('@/assets/images/image1.jpg'), // 封面图片
      customType: {
        customHls: function (video, player) {
          const hls = new Hls();
          hls.loadSource(video.src);
          hls.attachMedia(video);
        }
      }
    }
  });
});

onBeforeUnmount(() => {
  if (player && player.destroy) {
    player.destroy();
  }
});

</script>
 
<style scoped>
.box {
    width: 240px; /* 调整为 100% 或者你希望的宽度 */
    height: 185px; /* 调整为 100% 或者你希望的高度 */
    position: relative; /* 确保子元素可以相对于此容器定位 */
    overflow: hidden;
    border: #726c6c solid 2px;
    transition: transform 0.3s ease;
    border-radius: 5px;
}
.box:hover {
    border-color: #726c6c; /* 悬停时改变边框颜色 */
    background-color: #f8f9fa; /* 悬停时改变背景颜色 */
    transform: scale(1.03);
}

#dplayer {
    width: 100%;
    height: 73%;
    position: absolute; /* 确保视频铺满整个容器 */
    top: 0;
    left: 0;
    pointer-events: none;
}

#dplayer .dp-control {
    display: none !important; 
}



.info {
    position: absolute;
    width: 100%;
    top: 73%;
    left: 0;
    background-color: rgba(135, 127, 127, 0.5); /* 背景半透明 */
    color: #797878;
    text-align: left;
}

.title {
    font-size: 20px;
    margin-bottom: 3px;
    color: aliceblue;
}

.desc {
    font-size: 16px;
}
/* 隐藏底部操作栏 */
::v-deep .dplayer-controller {
    display: none;
}


</style>