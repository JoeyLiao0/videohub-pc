<template>
  <div class="carousel-container" @mouseenter="stopAutoplay" @mouseleave="startAutoplay">
    <!-- 轮播图  -->
    <div class="carousel-content">
      <div class="carousel-item" v-for="(item, index) in imageList" :key="index">
        <img :src="item.url" alt="" />
      </div>
      <div class="carousel-item">
        <img :src="imageList[0].url" alt="" /> 
      </div>
    </div>

    <!--左下角标题和圆点-->>
    <div class="carousel-footer__left">
      <div class="title">
        <span>{{ title }}</span>
        <el-icon><ArrowRight/></el-icon>
      </div>
      <div class="page">
        <div class="point" v-for="(_, index) in imageList" :key="index" :class="{ 'is-active': index === current }"
          @click="changePoint(index)"></div>
      </div>
    </div>
    
    <!--右下角按钮-->>
    <div class="carousel-footer__right">
      <button class="iconfont" @click="preChange"><</button>
      <button class="iconfont" @click="nextChange">></button>
    </div>
  </div>
</template>

<script>
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

export default {
  data() {
    return {
      title: "标题，这是文本的标题，需要显示在轮播图下方",
      imageList: [
        { url: require('@/assets/images/img1.png'), title: "轮播图标题1" },
        { url: require('@/assets/images/img2.png'), title: "轮播图标题2" },
        { url: require('@/assets/images/img3.png'), title: "轮播图标题3" }
      ],
      current: 0,
      autoplay: null,
      lock: true,
      components: { ArrowLeft, ArrowRight },
    }
  },
  
  methods: {
    // 切换标题和圆点
    changePoint(index) {
      this.title = this.imageList[index].title;
      if(this.current===index) return;
      
      this.current = index;
      // 获取所有图片
      let content = document.querySelector(".carousel-content");
      content.style.left = -1 * (this.current * 760) + "px";
    },
    preChange() {
      if(!this.lock) return;
      // 切换到上一张图片
      this.current--;
      // 获取所有图片
      let content = document.querySelector(".carousel-content");

      if(this.current === -1){
        // 左移位置
        let len = this.imageList.length;
        content.style.left = -1 * (len * 760) + "px";
        content.style.transition = "none";
        
        // 切换成最后一张图片，而不是假图
        this.current = len-1;
        setTimeout(() => {
          content.style.left = -1 * (this.current * 760) + "px";
          content.style.transition = "0.5s ease";
        }, 0);
      }else{
        content.style.left = -1 * (this.current * 760) + "px";
      }
      
      
      this.changePoint(this.current); // 切换标题和圆点
      this.lock = false;// 上锁

      
      setTimeout(()=>{ // 解锁
        this.lock = true;
      }, 500);
    },
    nextChange() {
      if(!this.lock) return;
      // 切换到下一张图片
      this.current++;
      // 获取所有图片
      let content = document.querySelector(".carousel-content");
      content.style.left = -1 * (this.current * 760) + "px";
      // 设置过渡效果
      content.style.transition = "0.5s ease";
      
      // 如果是最后一张，现在在展示假图片
      if (this.current === this.imageList.length) {
        this.current = 0;
        setTimeout(() => {
          content.style.left = 0;
          content.style.transition = "none";
        }, 500);
      }

      this.changePoint(this.current);  // 切换标题和圆点
      this.lock = false;  // 上锁

      // 解锁
      setTimeout(()=>{
        this.lock = true;
      }, 500);
    },

    
    startAutoplay() {
      this.autoplay = setInterval(this.nextChange, 3000); // 每3秒自动切换
    },
    stopAutoplay() {
      clearInterval(this.autoplay);
    },
  },
  mounted() {
    this.startAutoplay();
    this.title = this.imageList[0].title;
  },
  beforeDestroy() {
    clearInterval(this.autoplay);
  },
}
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 760px;
  height: 420px;
  overflow: hidden;
  border: solid 1px #ccc;
}

.carousel-content {
  position: relative;
  left: 0;
  display: flex;
  transition: all 0.5s ease;
}

.carousel-item {
  min-width: 100%;
  height: 420px;
}

.carousel-item img {
  width: 100%;
  height: 100%;
}

.carousel-footer__left {
  position: absolute;
  bottom: 20px;
  left: 15px;
}

.title {
  color: aliceblue;
  font-size: larger;
  font-family: "Microsoft YaHei", Verdana, Tahoma, sans-serif;
}

.page {
  display: flex;
  align-items: center;
  bottom: 10px;
}

.point {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  cursor: pointer;
  background-color: whitesmoke;
  margin: 10px;
}

.is-active {
  background-color: orange;
}

.carousel-footer__right {
  position: absolute;
  right: 15px;
  bottom: 20px;
}

.iconfont {
  width: 30px;
  height: 30px;
  margin: 10px;
  opacity: 0.5;
  border-radius: 50%;
  cursor: pointer;
}

.iconfont:hover {
  background-color: #ccc;
  opacity: 1;
}
</style>