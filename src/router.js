import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/views/Home.vue";
import MyCollection from "@/components/views/MyCollection.vue";
import Me from "@/components/views/Me.vue";
import MyVideo from "@/components/views/MyVideo.vue";
import Upload from "@/components/views/Upload.vue";
import VideoPlay from "@/components/views/VideoPlay.vue";
import MeInfo from "./components/views/MeInfo.vue";
import MePassword from "./components/views/MePassword.vue";
import HomeOrigin from "./components/views/HomeOrigin.vue";
import HomeSearchResult from "./components/views/HomeSearchResult.vue";

// 定义路由配置
const routes = [
  {
    path: "/home",
    name: "Home",
    component: Home,
    children: [
      {
        path: "origin",
        component: HomeOrigin,
      },
      {
        path: "search",
        component: HomeSearchResult,
      },
    ],
  },
  {
    path: "/me",
    name: "Me",
    component: Me,
    children: [
      {
        path: "info",
        component: MeInfo,
      },
      {
        path: "password",
        component: MePassword,
      },
    ],
  },
  {
    path: "/myCollection",
    name: "MyCollection",
    component: MyCollection,
  },
  {
    path: "/myVideo",
    name: "MyVideo",
    component: MyVideo,
  },
  {
    path: "/upload",
    name: "Upload",
    component: Upload,
  },
  {
    path: "/videoPlay",
    name: "VideoPlay",
    component: VideoPlay,
  }
  // ...其他路由配置
];

// 创建 router 实例
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
