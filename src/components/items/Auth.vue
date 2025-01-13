<!-- src/components/Auth.vue -->
<template>
  <div class="auth" v-show="showAuth">
    <!-- <div class="layer"></div> -->
    <div class="auth-content">
      <!-- <button class="exit" @click="closeAuth">退出</button> -->
      <div class="exit">
        <div class="btnClose" @click="closeAuth"></div>
      </div>
      <div class="content">
        <div class="login-grid-container" v-if="showLogin">
          <span class="title">登录界面</span>
          <span class="messageLogin">{{ messageLogin }}</span>
          <svg class="username-svg" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24">
            <circle cx="12" cy="6" r="4" fill="currentColor" />
            <path fill="currentColor" d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5" />
          </svg>
          <el-input class="username-input" v-model="login_username" placeholder="邮箱号"></el-input>
          <svg class="password-svg" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M6 22q-.825 0-1.412-.587T4 20V10q0-.825.588-1.412T6 8h1V6q0-2.075 1.463-3.537T12 1t3.538 1.463T17 6v2h1q.825 0 1.413.588T20 10v10q0 .825-.587 1.413T18 22zm6-5q.825 0 1.413-.587T14 15t-.587-1.412T12 13t-1.412.588T10 15t.588 1.413T12 17M9 8h6V6q0-1.25-.875-2.125T12 3t-2.125.875T9 6z" />
          </svg>
          <el-input class="password-input" v-model="login_password" type="password" placeholder="密码"></el-input>

          <el-button class="login-button" @click="login">登录</el-button>
          <el-button class="register-button" @click="registerPage">注册</el-button>
        </div>
        <div v-else class="register-grid-container">
          <span class="title">注册界面</span>
          <span class="messageRegister">{{ messageRegister }}</span>
          <svg class="username-svg" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24">
            <circle cx="12" cy="6" r="4" fill="currentColor" />
            <path fill="currentColor" d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5" />
          </svg>
          <el-input class="username-input" v-model="register_username" placeholder="邮箱号"></el-input>
          <svg class="password-svg" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M6 22q-.825 0-1.412-.587T4 20V10q0-.825.588-1.412T6 8h1V6q0-2.075 1.463-3.537T12 1t3.538 1.463T17 6v2h1q.825 0 1.413.588T20 10v10q0 .825-.587 1.413T18 22zm6-5q.825 0 1.413-.587T14 15t-.587-1.412T12 13t-1.412.588T10 15t.588 1.413T12 17M9 8h6V6q0-1.25-.875-2.125T12 3t-2.125.875T9 6z" />
          </svg>
          <el-input class="password-input" v-model="register_password" type="password" placeholder="密码"></el-input>
          <el-input class="password-input2" v-model="register_password2" type="password" placeholder="重复密码"></el-input>
          <svg class="code-svg" xmlns="http://www.w3.org/2000/svg" width="28px" height="28px" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M12 0c-.918 0-1.833.12-2.72.355L4.07 1.748a2.64 2.64 0 0 0-1.96 2.547v9.115a7.91 7.91 0 0 0 3.552 6.606l5.697 3.765a1.32 1.32 0 0 0 1.467-.008l5.572-3.752a7.93 7.93 0 0 0 3.493-6.57V4.295a2.64 2.64 0 0 0-1.961-2.547L14.72.355A10.6 10.6 0 0 0 12 0M7.383 5.4h9.228c.726 0 1.32.594 1.32 1.32c0 .734-.587 1.32-1.32 1.32H7.383c-.727 0-1.32-.593-1.32-1.32c0-.726.593-1.32 1.32-1.32M7.38 9.357h3.299c.727 0 1.32.595 1.32 1.32a1.32 1.32 0 0 1-1.318 1.32H7.38c-.726 0-1.32-.592-1.32-1.32c0-.725.594-1.32 1.32-1.32m0 3.96c.727 0 1.32.593 1.32 1.32s-.586 1.318-1.32 1.318c-.726 0-1.32-.592-1.32-1.318s.594-1.32 1.32-1.32" />
          </svg>
          <el-input class="code-input" v-model="register_code" placeholder="验证码"></el-input>
          <el-button class="code-button" @click="getCode">发送验证码</el-button>

          <el-button class="back-login-button" @click="loginPage">返回登录</el-button>
          <el-button class="comfirm-register-button" @click="register">确认注册</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { computed, onMounted, ref } from 'vue';
import { postUsersEmail, postUsers, postUsersToken, getUsers } from "@/api/userApi";
import { useRouter } from "vue-router";
import { setAccessToken, setRefreshToken } from "@/api/auth";
import CryptoJS from 'crypto-js';
import * as validator from 'validator';


const router = useRouter();


const showLogin = ref(true);
const messageLogin = ref("");
const messageRegister = ref("");
const store = useStore();

const login_username = ref("");
const login_password = ref("");

const register_username = ref("");
const register_password = ref("");
const register_password2 = ref("");

const register_code = ref("");

const showAuth = computed(() => store.state.user.showAuth);


function closeAuth() {
  setTimeout(() => {
    store.dispatch('user/closeAuth');
    router.push('/home/origin');
    messageLogin.value = "";
    login_username.value = "";
    login_password.value = "";
    messageRegister.value = "";
    register_username.value = "";
    register_password.value = "";
    register_password2.value = "";
  }, 50);
}

function registerPage() {
  messageLogin.value = "";
  login_username.value = "";
  login_password.value = "";
  showLogin.value = false;
}

function loginPage() {
  messageRegister.value = "";
  register_username.value = "";
  register_password.value = "";
  register_password2.value = "";
  showLogin.value = true;
}

onMounted(async () => {
  try {
    const response = await getUsers();
    if (response != null && response.data.code === 200) {
      store.dispatch('user/setMeInfo', response.data.data.user);
    } else {
      store.dispatch('user/openAuth');
    }
  } catch (error) {
    if (error.message === "AUTHENTICATION_FAILED") {
      // console.log("访问令牌失效，请重新登录");
      store.dispatch('user/openAuth');
    }
  }
})

//不需要token，所以不用try-catch来捕捉refresh_token失效的情况
async function getCode() {
  if (!validator.isEmail(register_username.value)) {
    messageRegister.value = '邮箱格式非法';
  } else {
    const email = {
      email: register_username.value,
    };
    const response = await postUsersEmail(email);
    if (response.data.code === 200) {
      messageRegister.value = "验证码发送成功";
      // console.log('验证码发送成功');
    } else {
      messageRegister.value = response.data.error;
      // console.log("验证码发送失败");
    }
  }
}

//不需要token，所以不用try-catch来捕捉refresh_token失效的情况
async function login() {
  if (!validator.isEmail(login_username.value)) {
    messageLogin.value = '邮箱格式非法';
  } else if (login_password.value === "" || login_password.value.trim() === "") {
    messageLogin.value = '密码不能为空';
  } else if (login_password.value.length < 6 || login_password.value.length > 18) {
    messageLogin.value = '密码长度应在6位到18位之间';
  } else {

    const userData = {
      email: login_username.value,
      password: CryptoJS.SHA256(login_password.value).toString(),//这里要加密一遍
    };

    try {

      const response = await postUsersToken(userData);
      if (response.data.code == 200) {
        // console.log(CryptoJS.SHA256(login_password.value).toString());
        messageLogin.value = "登录成功！";
        setAccessToken(response.data.data.access_token);
        setRefreshToken(response.data.data.refresh_token);
        router.push("/home/origin");
        setTimeout(() => {
          store.dispatch('user/closeAuth');
          messageLogin.value = "";
          login_username.value = "";
          login_password.value = "";
          messageRegister.value = "";
          register_username.value = "";
          register_password.value = "";
          register_password2.value = "";
        }, 1000);

        // console.log("登录成功");

        try {
          const response = await getUsers();
          if (response != null && response.data.code === 200) {
            store.dispatch('user/setMeInfo', response.data.data.user);
          }
        } catch (error) {
          if (error.message === "AUTHENTICATION_FAILED") {
            // console.log("访问令牌失效，请重新登录");
            store.dispatch('user/openAuth');
          }
        }
      } else {
        // console.log(response.data.error);
      }
    } catch (error) {
      if (error.message === "AUTHENTICATION_FAILED") {
        // console.log("访问令牌失效，请重新登录");
        store.dispatch('user/openAuth');
      }
    }
  }
}

//不需要token，所以不用try-catch来捕捉refresh_token失效的情况
async function register() {
  if (!validator.isEmail(register_username.value)) {
    messageRegister.value = '邮箱格式非法';
  } else if (register_password.value.length < 6 || register_password.value.length > 18) {
    messageRegister.value = '密码长度应在6位到18位之间';
  } else if (register_password.value !== register_password2.value) {
    messageRegister.value = '两次输入的密码不一致';
  } else if (register_code.value === "" || register_code.value.trim() === "") {
    messageRegister.value = '验证码不能为空';
  } else {
    const userData = {
      email: register_username.value,
      password: CryptoJS.SHA256(register_password.value).toString(),//这里要加密一遍
      code: register_code.value,
    }
    try {
      const response = await postUsers(userData);
      if (response.data.code === 200) {
        messageRegister.value = "注册成功！";
        // console.log('注册成功');
      } else {
        messageRegister.value = response.data.error;
        // console.log('注册失败');
      }
    } catch (error) {
      messageRegister.value = '网络错误,请稍后重试';
    }

  }
} 
</script>

<style scoped>
.auth {
  position: absolute;
  width: 100%;
  height: 100%;
  min-width: 1200px;
  z-index: 1998;
  /* 确保蒙版在最上层 */
  background-color: var(--bg);



}

.auth-content {
  position: absolute;
  top: 49%;
  /* 向下移动50%的高度 */
  left: 50%;
  /* 向右移动50%的宽度 */
  transform: translate(-50%, -50%);
  /* 将元素移动到容器中心 */
  width: 500px;
  height: 600px;
  z-index: 2000;
  /* 确保内容在最上层 */
  /* background-color: var(--bg-200); */
  background: rgba(0, 0, 0, 1);
  /* background-color: var(--bg); */

  border-radius: 8px;
  /* box-shadow: 2px 2px 1px rgba(255, 255, 255, 0.5); */
  border: 1px solid #272727;
}

.layer {
  position: absolute;
  top: 50.5%;
  /* 向下移动50%的高度 */
  left: 51%;
  /* 向右移动50%的宽度 */
  transform: translate(-50%, -50%);
  /* 将元素移动到容器中心 */
  width: 500px;
  height: 600px;
  z-index: 1999;
  /* 确保内容在最上层 */
  /* background-color: var(--background-black4); */
  border-radius: 5px;
}

.exit {
  position: absolute;
  top: 5px;
  right: 5px;
  /* width: 50px;
  height: 30px;
  border-radius: 4px;
  border: 0.5px solid;
  background-color: var(--primary-300); */
}

.exit:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

.exit:active {
  transform: scale(0.9);
  transition: transform 0.2s ease;
}

.content {
  position: absolute;
  width: 95%;
  height: 500px;
  top: 50px;
  left: 2.5%;
  /* border: 1px solid black; */
}

.login-grid-container {
  display: grid;
  grid-auto-rows: 60px;
  grid-template-columns: repeat(4, 1fr);
  place-items: center;
  row-gap: 20px;
}

.register-grid-container {
  display: grid;
  grid-auto-rows: 60px;
  grid-template-columns: repeat(4, 1fr);
  place-items: center;
  row-gap: 10px;
}

.title {
  font-size: 45px;
  grid-row: 1;
  grid-column: 2/4;
  color: var(--text-200);
}

.messageLogin {
  font-size: 18px;
  grid-row: 2;
  grid-column: 2/4;
  color: var(--accent-100);
}

.messageRegister {
  font-size: 18px;
  grid-row: 2;
  grid-column: 2/4;
  color: var(--accent-100);
}

.username-svg {
  grid-row: 3;
  grid-column: 1;
  margin-left: 20px;
  color: var(--text-200);
}

.password-svg {
  grid-row: 4;
  grid-column: 1;
  margin-left: 20px;
  color: var(--text-200);
}

.code-svg {
  grid-row: 6;
  grid-column: 1;
  margin-left: 20px;
  color: var(--text-200);
}

.username-input {
  grid-row: 3;
  grid-column: 2/4;
  width: 320px;
  height: 40px;
  left: 20px;
}

.password-input {
  grid-row: 4;
  grid-column: 2/4;
  width: 320px;
  height: 40px;
  left: 20px;
}

.password-input2 {
  grid-row: 5;
  grid-column: 2/4;
  width: 320px;
  height: 40px;
  left: 20px;
}

.code-input {
  grid-row: 6;
  grid-column: 2/4;
  width: 210px;
  height: 40px;
  left: -35px;
}

.code-button {
  grid-row: 6;
  grid-column: 3/5;
  width: 100px;
  height: 40px;
  margin-left: 20px;
}

.login-button {
  position: relative;
  width: 100px;
  height: 40px;
  grid-row: 6;
  grid-column: 1/3;
  left: 40px;
}

.back-login-button {
  position: relative;
  width: 100px;
  height: 40px;
  grid-row: 7;
  grid-column: 1/3;
  top: 20px;
  left: 45px;
}

.register-button {
  position: relative;
  width: 100px;
  height: 40px;
  grid-row: 6;
  grid-column: 3/5;
  right: 30px;
}

.comfirm-register-button {
  position: relative;
  width: 100px;
  height: 40px;
  grid-row: 7;
  grid-column: 3/5;
  top: 20px;
  right: 20px;
}

.btnClose {
  /* 自定义配置 */
  --btn-size: 20px;
  /* 按钮的宽高 */
  --btn-x-size: 4px;
  /* X号线条粗细 */
  --color: #ffffff;
  /* 颜色 */
  /* 配置 END */

  position: relative;
  width: var(--btn-size);
  height: var(--btn-size);

  /* X线条旋转后会有偏移，使用 flex 进行居中对齐修正 */
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

/* 绘制X线条 */
.btnClose::after,
.btnClose::before {
  content: "";
  position: absolute;
  width: var(--btn-x-size);
  height: var(--btn-size);
  background-color: var(--color);
  border-radius: calc(var(--btn-x-size) / 2);
}

/* 两条线条各向左右分别旋转 45 度*/
.btnClose::after {
  transform: rotate(45deg);
}

.btnClose::before {
  transform: rotate(-45deg);
}

.btnClose:hover {
  cursor: pointer;

}
</style>