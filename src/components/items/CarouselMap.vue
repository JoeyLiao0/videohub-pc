<template>
    <div class="carousel-index">
        <div class="carousel-content">
            <div class="carousel-item" v-for="(item, index) in imgaeList" :key="index" >              
                <img :src="item" alt=""></img>
            </div>
        </div>
        <div class="carousel-footer__left">
            <div class="title"><span>{{ title }}</span></div>
            <div class="page">
                <div class="point"
                    v-for="(_, index) in imgaeList" 
                    :key="index" 
                    @click="changePoint(index)"> 
                </div>
            </div>
        </div>
        <div class="carousel-footer__right">
            <el-button class="iconfont icon-left" :icon="ArrowLeft"></el-button>
            <el-button class="iconfont icon-right" :icon="ArrowRight"></el-button>    
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import {ArrowLeft,ArrowRight} from '@element-plus/icons-vue'


let title = "标题，这是文本的标题，需要显示在轮播图下方";

let imgaeList = [
    require('@/assets/images/image1.jpg'),
    require('@/assets/images/image3.jpg'),
    require('@/assets/images/image1.jpg'),
    require('@/assets/images/image3.jpg')
 ]

 let current = ref(0);

function changePoint(index){
    if(index < 0){
        current.value = imgaeList.length - 1;
    }else if(index >= imgaeList.length){
        current.value = 0;
    }else{
        current.value = index;
    }
}

</script>

<style scoped>
.carousel-index {
    position: relative;
    width: 760px;
    height: 420px;
    overflow: hidden;
    transition: transform 0.3s ease;
}

.carousel-index:hover{
    transform: scale(1.005);
}

.carousel-content{
    position: absolute;
    left: 0;
    display: flex;
}

.carousel-item {
    width: 760px;
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

.title{
    color: aliceblue;
    font-size: larger;
    font-family: "Microsoft YaHei", Verdana, Tahoma, sans-serif;
}

.page{
    display: flex;
    align-items: center;
    bottom: 10px;
}

.point {
    display: inline-block;
    position: relative;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    cursor: pointer;
    background-color: whitesmoke;
    margin: 10px;
}

.carousel-footer__right {
    position: absolute;
    right: 15px;
    bottom: 20px;
}

.carousel-footer__right .iconfont {
   margin: 10px;
   width: 10px;
   border-radius: 50%;
   opacity:50%;
}

</style>