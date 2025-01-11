<template>
    <el-menu :default-active="activeIdx" class="el-menu" router>
        <div class="grid-container">
            <div class="sub-grid-container">
                <div class="logo-img">
                    <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M6 16q-.825 0-1.412-.588Q4 14.825 4 14v-4q0-.825.588-1.413Q5.175 8 6 8t1.412.587Q8 9.175 8 10v4q0 .825-.588 1.412Q6.825 16 6 16Zm12 0q-.825 0-1.413-.588Q16 14.825 16 14v-4q0-.825.587-1.413Q17.175 8 18 8q.825 0 1.413.587Q20 9.175 20 10v4q0 .825-.587 1.412Q18.825 16 18 16Zm-6 4q-.825 0-1.412-.587Q10 18.825 10 18V6q0-.825.588-1.412Q11.175 4 12 4t1.413.588Q14 5.175 14 6v12q0 .825-.587 1.413Q12.825 20 12 20Z" />
                    </svg>
                </div>
                <div class="logo-text">
                    VideoHub
                </div>
            </div>

            <el-menu-item index="/home/origin">
                <div>
                    <el-icon>
                        <svg class="router-icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                            viewBox="0 0 24 24">
                            <path fill="currentColor"
                                d="M17.525 10.625q.35-.225.35-.625t-.35-.625L12.65 6.25q-.375-.25-.763-.038t-.387.663v6.25q0 .45.388.663t.762-.038zM8 18q-.825 0-1.412-.587T6 16V4q0-.825.588-1.412T8 2h12q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18zm-4 4q-.825 0-1.412-.587T2 20V7q0-.425.288-.712T3 6t.713.288T4 7v13h13q.425 0 .713.288T18 21t-.288.713T17 22z" />
                        </svg>
                    </el-icon>
                    <span class="router-text">我的主页</span>
                </div>
            </el-menu-item>
            <el-menu-item index="/myVideo">
                <div>
                    <el-icon>
                        <svg class="router-icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                            viewBox="0 0 24 24">
                            <path fill="currentColor"
                                d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm0-5h16V6H4z" />
                        </svg>
                    </el-icon>
                    <span class="router-text">我的视频</span>
                </div>
            </el-menu-item>
            <el-menu-item index="/myCollection">
                <div>
                    <el-icon>
                        <svg class="router-icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                            viewBox="0 0 16 16">
                            <g fill="currentColor">
                                <path
                                    d="M2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3m2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1m2.765 5.576A.5.5 0 0 0 6 7v5a.5.5 0 0 0 .765.424l4-2.5a.5.5 0 0 0 0-.848z" />
                                <path
                                    d="M1.5 14.5A1.5 1.5 0 0 1 0 13V6a1.5 1.5 0 0 1 1.5-1.5h13A1.5 1.5 0 0 1 16 6v7a1.5 1.5 0 0 1-1.5 1.5zm13-1a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5h-13A.5.5 0 0 0 1 6v7a.5.5 0 0 0 .5.5z" />
                            </g>
                        </svg>
                    </el-icon>
                    <span class="router-text">我的收藏</span>
                </div>

            </el-menu-item>
            <el-menu-item index="/upload" class="upload">
                <div>
                    <el-icon>
                        <svg class="router-icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                            viewBox="0 0 24 24">
                            <path fill="currentColor"
                                d="M4 22v-2h16v2zm5-4v-7H5l7-9l7 9h-4v7zm2-2h2V9h1.9L12 5.25L9.1 9H11zm1-7" />
                        </svg>
                    </el-icon>
                    <span class="router-text">上传</span>
                </div>
            </el-menu-item>

            <div class="avatar">
                <el-avatar @click="handleAvatarClick" :size="80" :src="avatarSrc" >
                </el-avatar>
                <!-- <div class="status-dot"></div> -->
            </div>


        </div>
    </el-menu>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from 'vuex';
const router = useRouter();

const store = useStore();
const avatarSrc = computed(() => store.state.user.avatar);

const handleAvatarClick = () => {
    router.push("/me/info");
};
const activeIdx = computed(() => router.currentRoute.value.path);
</script>

<style scoped>
.grid-container {
    /* padding: 10px; */
    height: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(12, 1fr);
    place-items: center;
    overflow: hidden;
    border: none;
}

.sub-grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr 3fr 1fr;
    grid-template-rows: 1fr;
    grid-column: 1;
    grid-row: 1/3;
    place-items: center;
}

.upload {
    display: grid;
    place-items: center;
    grid-column: 1;
    grid-row: 10;
}

.avatar {
    position: relative;
    display: grid;
    place-items: center;
    grid-column: 1/2;
    grid-row: 11/13;
    cursor: pointer;
    /* 添加手型指针样式 */
    transition: transform 0.3s ease;
    /* 平滑变换效果 */

    /* border: none; */
}

.avatar:hover {
    transform: scale(1.1);
    /* 鼠标悬停时放大 */
}

.avatar:active {
    transform: scale(0.9);
    /* 点击时缩小，创建按下的效果 */
}

/* 悬停效果 */
.el-menu-item:hover {
    background-color: rgba(255, 255, 255,0.3);
    transform: scale(1.05);
    /* border-radius: 8px; */
    /* 点击时的缩放效果 */
}

/* 点击效果 */
.el-menu-item:active {
    transform: scale(0.9);
    /* 点击时的缩放效果 */
}

/* 侧边栏高亮样式 */
.el-menu-item.is-active {
    /* background-color: var(--primary-250); */
    background-color: rgba(255, 255, 255,0.3);

    /* color: var(--text-100); */
    /* 高亮字体颜色 */
}

.el-menu-item {
    width: 100%;
    display: grid;
    place-items: center;
    transition: transform 0.3s ease;
}

.el-menu {

    border-radius: 8px;
    height: 100%;
    border: none;

    background-color: var(--bg);
}

.logo-img {
    color: rgb(255, 255, 255);
    grid-column: 2;
}

.logo-text {

    font-family: 'Roboto', sans-serif;
    /* 使用 Roboto 字体，如果 Roboto 不可用则回退到系统默认的无衬线字体 */
    font-weight: 100;
    /* 加粗，根据需要调整 */
    color: #eeeeee;
    /* 字体颜色，根据需要调整 */
    grid-column: 3;
}

.status-dot {
    position: absolute;
    bottom: 2px;
    right: 3px;
    width: 15px;
    height: 15px;
    background-color: var(--off-red);
    border: 5px solid var(--off-red2);
    border-radius: 50%;
}

.router-text {
    color: var(--text-100);
}

.router-icon {
    color: var(--text-100);
}
</style>
