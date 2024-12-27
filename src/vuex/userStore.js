// 定义模块对象
const userStore = {
  namespaced: true, // 启用命名空间
  state() {
    return {
      showAuth: true,
      status: null,
      registerTime: null,
      name: null,
      email: null,
      text: "个性签名可以写在这里",
      avatar: null,
      myVideoData: [],
      myCollectionData: [],
      collectionLike: "",
    };
  },
  mutations: {
    OPEN_AUTH(state) {
      state.showAuth = true;
    },
    CLOSE_AUTH(state) {
      state.showAuth = false;
    },
    SET_MY_VIDEO(state, payload) {
      state.myVideoData = payload;
    },
    SET_MY_COLLECTION(state, payload) {
      state.myCollectionData = payload;
    },
    SET_COLLECTION_LIKE(state, payload) {
      state.collectionLike = payload;
    },
    SET_ME_INFO(state, payload) {
      state.status = payload.status;
      state.registerTime = payload.time;
      state.email = payload.email;
      state.avatar = payload.avatar;
      state.name = payload.name;
      state.avatar = payload.avatar;
    }
  },
  actions: {
    openAuth({ commit }) {
      commit("OPEN_AUTH");
    },
    closeAuth({ commit }) {
      commit("CLOSE_AUTH");
    },
    setMyVideo({commit},data){
      commit("SET_MY_VIDEO",data);
    },
    setMyCollection({commit},data){
      commit("SET_MY_COLLECTION",data);  
    },
    setCollectionLike({ commit }, data) {
      commit("SET_COLLECTION_LIKE", data);
    },
    setMeInfo({commit},data){
      commit("SET_ME_INFO", data);
    },

    // async fetchMyVideoData({ commit }) {
    //   try {
    //     const response = await getUsersVideos();
    //     commit("SET_MY_VIDEO", response.data.videos);
    //     // console.log(response.data.videos);
    //     return response.data;
    //   } catch (error) {
    //     console.error("获取我的视频失败");
    //     throw error;
    //   }
    // },
    // async fetchMyCollectionVideoData({ commit }) {
    //   try {
    //     const response = await getUsersFavorites();
    //     if(response!=null){
    //       commit("SET_MY_COLLECTION", response.data.favorites);     
    //       return response.data;
    //     }
    //   } catch (error) {
    //     console.error("获取我的收藏视频失败");
    //     throw error;
    //   }
    // },

    // async fetchMeInfo({ commit }) {
    //   try {
    //     const response = await getUsers();
    //     if(response!=null){
    //       commit("SET_ME_INFO", response.data.data.user);
    //       console.log(response.data.data.user);
    //       return response.data.data;
    //     }

    //   } catch (error) {
    //     console.error("获取个人信息失败");
    //     throw error;
    //   }
    // },


    
    // async login({ commit }, userData) {
    //   try {
    //     const response = await postUsersToken(userData);
    //     // 假设 response 中包含两个 JWT 令牌：access_token 和 refresh_token
    //     const accessToken = response.data.access_token;
    //     const refreshToken = response.data.refresh_token;
    //     // 存储令牌到 Vuex Store
    //     commit("SET_ACCESS_TOKEN", accessToken);
    //     commit("SET_REFRESH_TOKEN", refreshToken);
    //     // 存储令牌到 LocalStorage
    //     localStorage.setItem("access_token", accessToken);
    //     localStorage.setItem("refresh_token", refreshToken);
    //     console.log("登录成功");
    //     return response.data;
    //   } catch (error) {
    //     console.error("登录失败");
    //     throw error;
    //   }
    // },
  },
};

// 默认导出模块对象
export default userStore;
