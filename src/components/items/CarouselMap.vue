<template>
  <div class="carousel-box">
    <el-carousel
      class="carousel"
      :interval="5000"
      :autoplay="true"
      :height="carouselHeight"
    >
      <el-carousel-item v-for="(item, index) in images" :key="index">
        <el-image class="carousel-image" :src="item.idView"></el-image>
        <div class="carousel-font">{{ item.desc }}</div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue';


// 图片数据
const images = ref([
  { id: 0, idView: require("@/assets/images/img1.png"),desc:"总之岁月漫长，然而值得等待。 ——村上春树" },
  { id: 1, idView: require("@/assets/images/img2.png"),desc:"假如你下午四点钟来，那么从三点钟起我就开始感到高兴。 ——《小王子》"},
  { id: 2, idView: require("@/assets/images/img3.png"),desc:"你记得也好，最好你忘掉。 ——徐志摩《偶然》"},
]);

// 轮播图高度
const carouselHeight = ref('520px');

</script>

<style scoped>
.carousel-box {
  width: 99.9%; /* 设置轮播图的宽度 */
  height: 100%;
  margin: auto; /* 水平居中 */
  /* border:solid var(--primary-100) 1px; */
  border-radius: 8px;
}

.carousel-image {
  /* margin-left:0.5%; */
  width: 100%; /* 图片宽度填满容器 */
  height: 100%; /* 图片高度自适应 */
  display: block; /* 去除图片下方的空白间隙 */
  object-fit: cover; /* 保证图片按比例填充容器 */
  background-size: conver;
  border-radius: 8px;
}

.carousel-font{
    position: absolute;
    left:10px;
    bottom: 20px;
    font-size: 20px;
    z-index: 1003;
    color: var(--text-100);
}
</style>