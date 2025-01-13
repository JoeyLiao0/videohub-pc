<template>
  <div class="upload-container">
    <UploadChildren v-show="showChild" class="upload-progress"  ref="uploadChildren"
      @child-event="handleChildEvent" />
      <!-- :uploadedFile="fileInput" -->
    <div class="upload-left">
      <div class="video">
        <VideoLeftPlayer class="video-player" :id ="'-1'" :title="videoTitle" :published_at="releaseTime"
          :video_path="cinVideoUrl" :description="videoDesc" />
      </div>
      <div class="video-upload">
        <label class="upload-demo" for="fileVideoInput">
          <p class="el-upload__text">
            <em>点击上传</em>
          </p>
        </label>
        <input id="fileVideoInput" type="file" style="display: none;" @change="handleVideoFileChange" />
      </div>
    </div>
    <div class="upload-right">
      <div class="video-image">
        <h3 class="imageTitle">封面</h3>
        <div class="avatar-uploader">
          <input type="file" id="fileImageInput" accept="image/jpeg/png" @change="handleImageFileChange"
            style="display: none;">
          <label for="fileImageInput" class="avatar-uploader-trigger">
            <img v-if="imageUrl" :src="cinImageUrl" class="avatar">
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </label>
        </div>
      </div>

      <div class="video-title">
        <h3 class="videoTitle">标题</h3>
        <textarea v-model="cinVideoTitle" placeholder="请输入视频标题" />
      </div>
      <div class="video-desc">
        <h3 class="videoDesc">简介</h3>
        <textarea v-model="cinVideoDesc" placeholder="请输入视频简介"></textarea>
      </div>
      <div class="video-upload-btn">
        <el-button class="btn" @click="handlePreviw" >预览</el-button>
        <!-- <el-button class="btn" @click="handlePreviw">预览</el-button> -->
        <el-button class="btn" @click="handleUpload">发布</el-button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, reactive } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import VideoLeftPlayer from "@/components/items/VideoLeftPlayer";
import UploadChildren from '@/components/items/UploadChildren';

const videoTitle = ref('');// 标题
const videoDesc = ref(''); // 简介
const releaseTime = ref(0) // 发布时间

const cinVideoTitle = ref(''); // 设置标题
const cinVideoDesc = ref(''); // 设置简介
const cinVideoUrl = ref(''); // 设置视频
const cinImageUrl = ref(''); // 设置图片
const imageUrl = ref(false); // 是否已经设置封面

const isUploading = ref(false);
const uploadChildren = ref(null);// 创建一个 ref 来引用子组件
const showChild = ref(false);   //  是否创建子组件
const uploadData = reactive({       // 使用 reactive 创建一个响应式对象
  videoFile: null,
  coverImage: null,
  title: '',
  description: ''
});

// 文件选择或拖拽事件处理
function handleVideoFileChange(event) {
  const file = event.target.files[0];
  if (beforeUpload(file)) {
    uploadData.videoFile = file;
    event.target.value = ''; // 清空 input 以允许选择同一文件多次
    // // // console.log('generateChild:'); // 验证 generateChild 是否为 true
  }
}
// 视频加载之前的验证
function beforeUpload(file) {
  const isVideo = file.type.startsWith('video/');
  if (!isVideo) {
    ElMessage.error('请上传一个视频文件!');
    return false;
  }

  const fileExtension = file.name.split('.').pop().toLowerCase();
  if (fileExtension !== 'mp4') {
    ElMessage.error('请上传MP4格式的视频!');
    return false;
  }

  // 4. 创建临时的对象 URL 来预览视频
  const videoUrl = URL.createObjectURL(file); // 临时 URL
  cinVideoUrl.value = videoUrl; // 将其赋值给 `cinVideoUrl`

  return true;
}
// 上传之前的验证
function validateInfo() {
  // 封面出错误
  if (cinImageUrl.value == '') {
    ElMessage.error('请上传封面图片!');
    return false;
  }

  // 视频出错误
  if (cinVideoUrl.value == '') {
    ElMessage.error('请上传MP4格式的视频!');
    return false;
  }

  // 标题出错误
  if (cinVideoTitle.value == '' || cinVideoTitle.value.trim == '') {
    ElMessage.error('请填写视频标题!');
    return false;
  }
  if(cinVideoDesc.value == '' || cinVideoDesc.value.trim == ''){
    ElMessage.error('请填写视频描述!');
    return false;
  }

  return true;
}
// 图片上传
function handleImageFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  const isValidFormat = ['image/jpeg', 'image/png'].includes(file.type);
  if (!isValidFormat) {
    ElMessage.error('请上传jpg或png格式的图片!');
    return;
  }

  const reader = new FileReader();
  // 读取文件并设置为 imageUrl
  reader.onload = (e) => {
    cinImageUrl.value = e.target.result; // 将图片的base64数据赋值给imageUrl
    imageUrl.value = true;
  };
  uploadData.coverImage = file;
  reader.readAsDataURL(file); // 将文件读取为base64格式
}

const timeoutId = ref(null);
// 处理子组件的事件
function handleChildEvent(data) {

  clearTimeout(timeoutId.value);
  if (data.result) {
    ElMessage.success(data.message);
    clearCinInfo();
  } else {
    ElMessage.error(data.message);
    showChild.value = false;
    isUploading.value = false;
  }

}

// 视频上传
function handleUpload() {
  if (isUploading.value) {
    ElMessage.warning('正在上传中，请勿重复上传');
    return;
  }

  if (!validateInfo()) return;

  // 显示子组件并且设置上传的数据
  isUploading.value = true;
  uploadData.title = cinVideoTitle.value;
  uploadData.description = cinVideoDesc.value;
  showChild.value = true;

  // 设置超时处理
  timeoutId.value = setTimeout(() => {
    if (isUploading.value) {
      ElMessage.error('上传超时，请重新上传');
      isUploading.value = false;
      showChild.value = false;
    }
  }, 60000*3); // 3分钟的超时时间

  // 调用子组件的方法
  if (uploadChildren.value && (typeof uploadChildren.value.hanldeUploadFile === 'function')) {
    uploadChildren.value.hanldeUploadFile(uploadData);
  } else {
    console.error('子组件未正确初始化或方法不存在');
    clearTimeout(timeoutId); // 清除定时器
    isUploading.value = false;
    showChild.value = false;
  }
}

function handlePreviw() {
  if (cinVideoTitle.value) {
    if (cinVideoTitle.value.length < 2) {
      ElMessage.warning('标题字数太少');
      return;
    }

    if (cinVideoTitle.value.length > 50) {
      ElMessage.warning('标题字数太多，最好5-50字');
      return;
    }


    videoTitle.value = cinVideoTitle.value;
    videoDesc.value = cinVideoDesc.value;
    const currentDate = new Date().getTime();
    releaseTime.value = currentDate;
    // // // console.log(releaseTime.value);

  } else {
    ElMessage.warning('请输入标题');
    return;
  }
}

function clearCinInfo() {
  // 清空输入框
  cinVideoUrl.value = '';
  cinImageUrl.value = '';
  videoTitle.value = '';
  videoDesc.value = '';
  releaseTime.value = '';
  imageUrl.value = false;
  showChild.value = false;
  isUploading.value = false;
}

</script>

<style scoped>
/*  整个页面上传 */
.upload-container {
  width: 100%;
  height: 100%;
  display: grid;
  /* background-color: var(--primary-100); */
  background-color: var(--bg);
  grid-template-columns: 5fr 4fr;
}

/* 定义淡入淡出的过渡 */
.upload-progress {
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
  /* 定义过渡效果 */
  display: float;
  left: 14%;
  width: 80%;
  position: absolute;
  background-color: aliceblue;
  z-index: 1000;
}

.upload-container .upload-progress[v-show="false"] {
  opacity: 0;
  /* 可选：如果需要保留空间，可以设置 visibility 而不是 display */
  /* visibility: hidden; */
}

/* 左侧视图 */
.upload-left {
  grid-column: 1;
  /* background-color: var(--background-black2); */
  /* background-color: var(--primary-100); */
  /* background-color: var(--bg); */

  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  /* border-right: 1px solid var(--primary-100); */
}

/* 视频展示框 */
.video {
  margin: 14px 10px;
  border-radius: 3px;
  /* border: 1px solid var(--primary-100); */
  background-color: rgba(1, 1, 1, 0.8);
  height: 600px;
}

.video .video-player {
  width: 100%;
  height: 100%;
}

/* 上传按钮框 */
.video-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  margin-top: 10px;
  margin-bottom: 15px;
  margin-left: 10px;
  margin-right: 10px;
  border: 1px solid rgb(123, 121, 121);
  background-color: var(--text-white2);
}

.upload-demo {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  /* 添加边框 */
  cursor: pointer;
  transition: border-color 0.3s, background-color 0.3s;
}

.upload-demo:hover {
  /* border-color: #409eff; */
  /* 鼠标悬停时改变边框颜色 */
  background-color: var(--primary-200);
  color: var(--text-100);
  /* 鼠标悬停时改变背景颜色 */
}

/* 右侧视图 */
.upload-right {
  /* border: 1px solid black; */
  grid-column: 2;
  height: 100%;
  width: 100%;
  color: var(--text-white2);
  display: grid;
  align-items: center;

  /* background-color: var(--bg); */
}

/* 封面 */
.video-image {
  height: 182px;
  width: 100%;
  margin-top: 14px;
  display: grid;
  grid-template-columns: 90px auto;
  grid-template-rows: 1fr;
  align-items: center;
}

/* 封面标签 */
.video-image .imageTitle {
  grid-column: 1;
  margin-left: 30px;
}

/* 封面上传框 */
.video-image .avatar-uploader {
  grid-column: 2;
  width: 300px;
  height: 182px;
  box-sizing: border-box;
  object-fit: cover;
}

/* 封面上传框样式 */
.video-image .avatar-uploader-trigger {
  background-color: var(--text-white1);
  border: 1px solid var(--text-white3);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 182px;
  transition: border-color 0.3s;
}

.video-image .avatar-uploader-trigger:hover{
  /* background-color: #003b8f; */
  background-color: rgb(117, 117, 117)
}

.video-image .avatar-uploader-trigger img {
  width: 100%;
  height: 100%;
  display: block;
}

.avatar-uploader-trigger .avatar-uploader-icon {
  font-size: 28px;
  color: #000000;
}

/* 标题 */
.video-title {
  height: 50px;
  width: 100%;
  margin-top: 76px;
  border-radius: 6px;
  display: grid;
  grid-template-columns: 90px 4fr 1fr;
  grid-template-rows: 1fr;
  align-items: center;
}

.video-title .videoTitle {
  grid-column: 1;
  margin-left: 30px;
}

.video-title textarea {
  resize: none;
  grid-column: 2;
  padding-top:5px;
  padding-left: 10px;
  /* margin: auto; */
  height: 30px;
  border: none;
  border-radius: 4px;
  font-size: 18px;
}

/* 简介 */
.video-desc {
  height: 200px;
  margin-top: 80px;
  border-radius: 6px;
  display: grid;
  grid-template-columns: 90px 4fr 1fr;
  grid-template-rows: 1fr;
  align-items: center;
}

.video-desc .videoDesc {
  margin-left: 30px;
}

.video-desc textarea {
  /* color: var(--text-white1); */
  /* background-color: var(--background-black3); */
  border: none;
  grid-column: 2;
  height: 200px;
  resize: none;
  border-radius: 4px;
  font-size: 18px;
}

/* 按钮 */
.video-upload-btn {
  width: 100%;
  height: 50px;
  margin-top: 80px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 100px;
  box-sizing: border-box;
}

/* .video-upload-btn:hover{
  background-color: var(--primary-200);
  color:white;
} */

.video-upload-btn button {
  width: 100px;
  height: 50px;
  border-radius: 10px;
  cursor: pointer;
  box-sizing: border-box;
  color: var(--background-black2);
}

/* el-button {
  color: var(--background-black2);
  background-color: var(--text-100);
  border: none;
} */

.btn{
  margin-bottom: 30px;
  color: #ffffff;
}

.btn:hover {
  background-color: var(--primary-225);
  color:var(--text-100);
}
</style>