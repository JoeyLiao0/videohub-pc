<template>
    <div>
      <!-- 展示msg -->
      {{msg}}
      Collection
    </div>
  </template>
  
  <script>
  export default {
    name: 'Collection',
    props: {
      msg: String
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
    /* scoped表示这里的css样式不会泄露到其他组件 */
  </style>