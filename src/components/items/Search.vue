<template>
  <div class="search-box">
    <div class ="search-container">
      <el-input class="search" v-model="searchValue" placeholder="搜索视频"></el-input>
      <div class="search-icon" @click="search">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32px"
          height="32px"
          viewBox="0 0 24 24"
        >
          <g fill="none" fill-rule="evenodd">
            <path
              d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
            />
            <path
              fill="currentColor"
              d="M10.5 2a8.5 8.5 0 1 0 5.262 15.176l3.652 3.652a1 1 0 0 0 1.414-1.414l-3.652-3.652A8.5 8.5 0 0 0 10.5 2M4 10.5a6.5 6.5 0 1 1 13 0a6.5 6.5 0 0 1-13 0"
            />
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from 'vuex';

const props = defineProps(['searchType']);

const store = useStore(); // 直接访问 Vuex store
const searchValue = ref("");
const router = useRouter();
function search() {
  switch(props.searchType){
    case 'home':
      if(searchValue.value){
        store.dispatch('home/setLike',searchValue.value);
        router.push("/home/search");
      }else{
        // console.log("搜索参数不能为空");
      }
      break;
    case 'collection':
      store.dispatch('user/setCollectionLike',searchValue.value);
  }
}
</script>

<style scoped>
.search-box {
  width: 100%;
  height: 100%;
  display: grid;
  /* background-image: url("/public/img7.png"); */
  /* background: linear-gradient(0deg, var(--primary-100), var(--primary-225)); */
  
  background-color: var(--bg);
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: 2fr 2fr 3fr;

  position: relative;
  place-items: center;
  /* border-bottom: 0.5px solid #969696; */

}

.search-container {
    width: 100%;
    height: 100%;
    margin-bottom:2px;
    margin-top:2px;

    position: relative;
    grid-column: 4/8;
    grid-row: 2;


    display: grid;
    grid-template-columns: 0.3fr repeat(10, 1fr);
    place-items: center;

    z-index: 1000;
    /* background-color:var(--primary-100); */
    border-radius: 4px;
}

.search{
    grid-column:2/11;
}

.search-icon{
  color: rgb(184, 184, 184);
}
.search-icon:hover{
  color: rgb(255, 255, 255);

  cursor: pointer;
}
::v-deep .el-input__wrapper {
  /* background-color:var(--primary-300); */
  background-color: rgba(255, 255, 255, 0.5);

  box-shadow: none !important;
}

::v-deep .el-input__inner {
  color: var(--text-100); /* 设置输入文字颜色 */
}

::v-deep .el-input__inner::placeholder {
  color: var(--text-200);
}
.search-icon {
    grid-column: 11;
}
</style>
