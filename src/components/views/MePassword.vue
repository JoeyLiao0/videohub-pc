<template>
    <div class="grid-container">
        <span class="message">{{ message }}</span>
        <div class="subgrid-container1">
            <span class="text">原密码：</span>
            <el-input class="input" v-model="input_old_pwd" show-password></el-input>
        </div>

        <div class="subgrid-container2">
            <span class="text">新密码：</span>
            <el-input class="input" v-model="input_new_pwd" show-password></el-input>
        </div>

        <div class="subgrid-container3">
            <span class="text">确认密码：</span>
            <el-input class="input" v-model="input_repeat_pwd" show-password></el-input>
        </div>

        <div class="subgrid-container4">
            <span class="text">验证码：</span>
            <el-input class="input" v-model="input_code"></el-input>
        </div>

        <div class="button-container">
            <el-button class="change-button" @click="changePwd">确认修改</el-button>
            <el-button class="code-button" @click="getCode">获取验证码</el-button>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from 'vuex';
import * as validator from 'validator';
import { postUsersEmail, putUsersPassword } from "@/api/userApi";
import CryptoJS from 'crypto-js';
const input_old_pwd = ref("");
const input_new_pwd = ref("");
const input_repeat_pwd = ref("");
const input_code = ref("");
const message = ref("");

const store = useStore();
// CryptoJS.SHA256(register_password.value).toString()
const stored_email = computed(() => store.state.user.email);

async function changePwd() {
    if (input_old_pwd.value === "" || input_old_pwd.value.trim() === "") {
        message.value = "原密码不能为空";
    } else if (input_new_pwd.value.length < 6 || input_new_pwd.value.length > 18) {
        message.value = '新密码长度应在6位到18位之间';
    } else if (input_new_pwd.value !== input_repeat_pwd.value) {
        message.value = '重复密码和新密码应保持一致';
    } else if (input_new_pwd.value === input_old_pwd.value) {
        message.value = '新密码不能和旧密码一致'
    } else if (input_code.value === "" || input_code.value.trim() === "") {
        message.value = '验证码不能为空';
    } else {
        const passwordData = {
            password: CryptoJS.SHA256(input_old_pwd.value).toString(),
            new_password: CryptoJS.SHA256(input_new_pwd.value).toString(),
            code: input_code.value
        }
        try {
            const response = await putUsersPassword(passwordData);
            if (response.data.code === 200) {
                message.value = '密码修改成功,请重新登录';
                setTimeout(() => {
                    store.dispatch('user/openAuth');
                }, 1000);
                // console.log('密码修改成功');
            } else {
                message.value = response.data.error;
                // console.log('密码修改失败');
            }
        } catch (error) {
            // console.log(error);
        }

    }
}

async function getCode() {
    if (!validator.isEmail(stored_email.value)) {
        stored_email.value = '邮箱格式非法';
    } else {
        const email = {
            email: stored_email.value,
        };
        try{
            const response = await postUsersEmail(email);
            if (response.data.code === 200) {
                message.value = "验证码发送成功";
                // console.log('验证码发送成功');
            } else {
                message.value = response.data.error;
                // console.log("验证码发送失败");
            }
        }catch(error){
            // console.log(error);
        }
    }
}


</script>

<style scoped>
.grid-container {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    grid-template-rows: 5px repeat(6, 1fr) 30px;
    grid-template-columns: 1fr 3fr 1fr;
    background-color: var(--bg);
    border: 6px;

}

.text {
    display: grid;
    place-content: center;
    color: var(--text-100);
    font-size: 18px;
    width: 100%;
    height: 100%;
}

.subgrid-container1 {
    width: 400px;

    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: 1;
    grid-column: 2;
    grid-row: 3;
    place-content: center;
}

.subgrid-container2 {
    width: 400px;

    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: 1;
    grid-column: 2;
    grid-row: 4;

    place-content: center;
}

.subgrid-container3 {
    width: 400px;

    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: 1;
    grid-column: 2;
    grid-row: 5;

    place-content: center;
}

.subgrid-container4 {
    width: 400px;

    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: 1;
    grid-column: 2;
    grid-row: 6;
    place-content: center;
}

.input {
    height: 40px;
}

::v-deep .el-input__wrapper {
    background-color: var(--text-200);
    box-shadow: none !important;
}

::v-deep .el-input__inner {
    color: var(--primary-200);
    /* 设置输入文字颜色 */
}

.button-container {
    grid-row: 7;
    grid-column: 2;
    width: 100%;
    height: 100%;

    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr;
    place-items: center;
}

.change-button {
    grid-row: 1;
    grid-column: 1;
    width: 100px;
}

.code-button {
    grid-row: 1;
    grid-column: 2;
    width: 100px;
}

.el-button {
    font-size: medium;
    color: var(--background-black2);
    background-color: var(--text-white2);
    border: none;
}

.message {
    grid-row: 2;
    grid-column: 2;
    font-size: larger;
    /* width: 1px; */
    color: var(--red1);
}
</style>