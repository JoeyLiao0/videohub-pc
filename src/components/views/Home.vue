<template>
    <div>
      <!-- 展示msg -->
    </div>
    <CarouselMap/>  
    <Dplayer/>
  </template>
  
  <script setup>
    import CarouselMap from '../items/CarouselMap.vue';
    import Dplayer from '@/components/items/Dplayer.vue';
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
    /* scoped表示这里的css样式不会泄露到其他组件 */
    div{
        color: red;
        width: auto;
        height: 150px;
        background-color: black;
    }
  </style>
  