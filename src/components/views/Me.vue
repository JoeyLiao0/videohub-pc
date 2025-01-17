<template>
  <div class="grid-container">

    <div class="header-container">
      <div class="avatar" @click="triggerFileInput">
        <!-- <el-avatar :size="80" :src="avatarSrc" :key="avatarSrc" style="border: 1px solid black">
        </el-avatar> -->
        <img :src="avatarSrc" :key="avatarSrc" style="width: 80px; height: 80px; border: 1px solid black; border-radius: 50%;">
        <input type="file" @change="handleFileChange" style="display: none" ref="fileInput">
        <span class="set" >设置</span>
      </div>
      <span class="status">状态:{{ status }}</span>
      <span class="time">注册时间:{{ date }}</span>
    </div>

    <div class="content-container">
      <div class="sidebar-container">
        <el-menu :default-active="activeIdx" class="el-menu" router>
          <!-- <div class="subgrid-container"> -->
          <div class="title">个人中心</div>
          <el-menu-item index="/me/info">
            <span class="router-text">基本信息</span>
          </el-menu-item>
          <el-menu-item index="/me/password">
            <span class="router-text">密码修改</span>
          </el-menu-item>
          <!-- </div> -->
        </el-menu>
      </div>
      <div class="main-content">
        <router-view></router-view>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, ref,watch} from "vue";
import { useStore } from 'vuex';
import { useRouter } from "vue-router";
import { getUsers } from '@/api/userApi';
import {postUsersAvatar} from '@/api/userApi';

const router = useRouter();
// const avatarSrc = require("@/assets/avatar.png");
const activeIdx = computed(() => router.currentRoute.value.path);

const store = useStore();
const userStatus = computed(() => store.state.user.status);
const userRegisterTime = computed(() => store.state.user.registerTime);

const avatarSrc = computed(()=>avatarSrcWithTimestamp(store.state.user.avatar));

// 添加时间戳作为随机参数
function avatarSrcWithTimestamp(a) {
  if (a) {
    const timestamp = Date.now();
    if (a.includes('?')) {
      // 获取URL的路径部分
      const urlWithoutParams = a.split('?')[0];
      return `${urlWithoutParams}?t=${timestamp}`;
    } else {
      return `${a}?t=${timestamp}`;
    }
  } else {
    return a;
  }
}

const date = computed(() => {
  const timestamp = userRegisterTime.value;
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });
});

const status = computed(() => {
  const num = userStatus.value;
  if (num == 0) {
    return '正常';
  } else if (num == 1) {
    return '封禁';
  } else {
    return '注销';
  }
})



// onMounted(()=>{
//   // console.log(store.state.user.avatar);
// })

// 当组件挂载时，获取个人数据
// onMounted(async () => {
//   try {
//     const response = await getUsers();
//     if (response != null && response.data.code === 200) {
//       store.dispatch('user/setMeInfo', response.data.data.user);
//     }
//   } catch (error) {
//     if (error.message === "AUTHENTICATION_FAILED") {
//       // console.log("访问令牌失效，请重新登录");
//       store.dispatch('user/openAuth');
//     }
//   }
// });

// import { ref } from 'vue';

// 创建一个引用来控制文件输入
const fileInput = ref(null);

// 处理文件选择的变化
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadAvatar(file);
  }
};

// 上传头像的方法
const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  try {
    const response = await postUsersAvatar(formData);
    if (response.data.code === 200) {
      // // console.log('头像上传成功');
      //尝试更新个人信息
      try {
        const response2 = await getUsers();
        // console.log(response2.data.data);
        if (response2 != null && response2.data.code === 200) {
          // console.log("aaaa");
          response2.data.data.user.avatar =  avatarSrcWithTimestamp(avatarSrc.value);
          store.dispatch('user/setMeInfo', response2.data.data.user);
          // // console.log(avatarSrc.value);
        }

      } catch (error) {
        if (error.message === "AUTHENTICATION_FAILED") {
          // // console.log("访问令牌失效，请重新登录");
          store.dispatch('user/openAuth');
        }
      }
    } else {
      message.value = response.data.error;
      // // console.log(response.data.error);
    }
  } catch (error) {
    // // console.log(error);
  }
};

// 触发文件输入的方法
const triggerFileInput = () => {
  fileInput.value.click();
};



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* scoped表示这里的css样式不会泄露到其他组件 */
.grid-container {
  width: 100%;
  height: 100%;
  display: grid;
  gap: 20px 0;
  grid-template-rows: 1fr 5fr;
  overflow: hidden;
  background-color: var(--bg);
}

.header-container {
  width: 100%;
  height: 110px;
  grid-row: 1;
  display: grid;
  /* place-items: center; */
  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: 120px 100px 100px;
  border-bottom: 0.5px solid #969696;
  align-items: center;
}

.avatar {
  position: relative;
  grid-row: 1/5;
  grid-column: 1;
  margin-left: 20px;
  margin-top: 10px;
}

.set {
  position: absolute;
  font-size: 20px;
  color: transparent;
  left: 20px;
  top: 25px;
  z-index: 5000;
}

.avatar:hover .set {
  color: var(--background-black1); /* 悬停时显示的文字颜色 */
}

.avatar:hover{
  cursor: pointer;
}

.content-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  /* border: 1px solid rgb(255, 255, 255); */
}

.sidebar-container {
  grid-column: 2/4;
  height: 90%;
  width: 100%;
  /* background-color: var(--grey2); */
  border: none;


}

.el-menu {
  /* background-color: var(--primary-200); */
  background-color: var(--bg);
  border-radius: 8px;
  display: grid;
  grid-template-rows: repeat(8, 1fr);
  gap: 15px;
  place-items: center;
  height: 100%;
  width: 100%;
  border-right: none;
}

.main-content {
  /* border: 1px solid rgb(247, 247, 247); */
  grid-column: 5/11;
  height: 90%;
}

.router-text {
  display: grid;
  place-items: center;
  width: 100%;
  color: var(--text-white2);
  font-size: 16px;
}

.el-menu-item {
  width: 100%;
}

.title {
  border-radius: 4px;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  background-color: var(--bg);

  font-size: 22px;
  font-weight: 500;
  

  color: #ffffff;
}

/* 悬停效果 */
.el-menu-item:hover {
  background-color: var(--primary-250);
}

/* 侧边栏高亮样式 */
.el-menu-item.is-active {
  background-color: var(--primary-250);
}

.status {
  color: var(--text-white2);
  grid-row: 2;
  font-size: 14px;
}

.time {
  color: var(--text-white3);
  grid-row: 3;
  grid-column: 2/4;
  font-size: 12px;
}
</style>