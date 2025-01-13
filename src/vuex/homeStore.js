// 定义模块对象
const homeStore = {
  namespaced: true, // 启用命名空间
  state() {
    return {
      videoHomeData: [], // 存储视频主页的数据
      like: "",
      videoHomeSearchResultsData: [], // 存储搜索结果的数据
      currentVideoData: null,
    };
  },
  mutations: {
    // 定义你的 mutations
    SET_VIDEO_HOME_DATA(state, payload) {
      state.videoHomeData = payload;
      // console.log("payload");
      // console.log(payload);
    },
    SET_SEARCH_RESULTS_DATA(state, payload) {
      state.videoHomeSearchResultsData = payload;
    },
    SET_LIKE(state, payload) {
      state.like = payload;
    },
    SET_CURRENT_VIDEO_DATA(state, payload) {
      state.currentVideoData = payload;
    },
  },
  actions: {
    setVideoHomeData({ commit }, data) {
      // console.log("data");
      // console.log(data);
      commit("SET_VIDEO_HOME_DATA", data);
    },
    setSearchResultData({ commit }, data) {
      commit("SET_SEARCH_RESULTS_DATA", data);
    },
    setLike({ commit }, data) {
      commit("SET_LIKE", data);
    },
    setCurrentVideoData({ commit }, data) {
      commit("SET_CURRENT_VIDEO_DATA", data);
    },
  },
};

// 默认导出模块对象
export default homeStore;
