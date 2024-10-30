<template>
  <div>
    <CarouselMap></CarouselMap>
  </div>

  <div>
    <!-- 展示msg -->
    {{ msg }}
    Home
  </div>

  <Video></Video>
</template>

<script>
import Video from '../items/Video.vue';
import CarouselMap from '../items/CarouselMap.vue';

export default {
  name: 'Home',
  props: {
    msg: String
  },
  components: { CarouselMap, Video }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* scoped表示这里的css样式不会泄露到其他组件 */
</style>