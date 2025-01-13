<template>
    <div class="comment">
        <div class="my-reply">
            <el-avatar class="my-avatar" :size="35" :src="myAvatar"></el-avatar>
            <div class="my-input">
                <el-input class="reply-input" type="textarea" v-model="input_comment0" :autosize=true :maxlength="200"
                    size="default" placeholder="输入评论..."></el-input>
                <el-button class="reply-btn" @click="sendComment0" type="primary">发表评论</el-button>
            </div>
        </div>
        <div class="comment-container">
            <div v-for="(item, i) in comments" :key="i" class="comment-father">
                <!-- 父评论 -->
                <div class="author-info">
                    <el-avatar class="auther-avatar" :size="35" :src="item.comments.avatar"></el-avatar>
                    <span class="author-name">{{ item.comments.name }}</span>
                </div>
                <div class="content-container">
                    <div class="comment-content">
                        <span>{{ item.comments.comment }}</span>
                    </div>
                    <div class="comment-info">
                        <span class="text-info">{{ date(item.comments.created_at) }}</span>
                        <div class="comment-like" title="点赞" :class="{ 'clicked_like': item.is_liked }"
                            @click="clicked_like(item)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                    d="M4 21h1V8H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2M20 8h-7l1.122-3.368A2 2 0 0 0 12.225 2H12L7 7.438V21h11l3.912-8.596L22 12v-2a2 2 0 0 0-2-2" />
                            </svg>
                        </div>
                        <span class="text-info">{{ item.comments.likes_count }}</span>
                        <button class="reply-button"
                            @click="chooseCommentToReply(item.comments.comment_id, i, item.comments.name)">回复</button>
                    </div>
                </div>
                <div class="comment-sub-container">
                    <div v-for="(reply, j) in item.reply" :key="j" class="comment-son">
                        <div class="author-info">
                            <el-avatar class="auther-avatar" :size="35" :src="reply.comments.avatar"></el-avatar>
                            <span class="author-name">{{ reply.comments.name }} 回复 {{ reply.reply_to }}:</span>
                        </div>
                        <div class="content-container">
                            <div class="comment-content">
                                <span>{{ reply.comments.comment }}</span>
                            </div>
                            <div class="comment-info">
                                <span class="text-info">{{ date(reply.comments.created_at) }}</span>
                                <div class="comment-like" title="点赞" :class="{ 'clicked_like': reply.is_liked }"
                                    @click="clicked_like(reply)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em"
                                        viewBox="0 0 24 24">
                                        <path fill="currentColor"
                                            d="M4 21h1V8H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2M20 8h-7l1.122-3.368A2 2 0 0 0 12.225 2H12L7 7.438V21h11l3.912-8.596L22 12v-2a2 2 0 0 0-2-2" />
                                    </svg>
                                </div>
                                <span class="text-info">{{ reply.comments.likes_count }}</span>

                                <button class="reply-button"
                                    @click="chooseCommentToReply(reply.comments.comment_id, i, reply.comments.name)"> 回复
                                </button>
                            </div>
                        </div>
                    </div>
                    <div div class=" my-reply" v-show="showIdx == i">
                        <el-avatar class="my-avatar" :size="35" :src="myAvatar"></el-avatar>
                        <div class="my-input">
                            <el-input class="reply-input" type="textarea" v-model="input_comment" :autosize=true
                                :maxlength="200" size="default" :placeholder="targetCommentAuthorName"></el-input>
                            <el-button class="reply-btn" @click="sendComment(reply, i)" type="primary">发表评论</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { getVideosComments, postVideosComments, postVideosCommentsLike, deleteVideosCommentsLike } from '@/api/userApi';
const props = defineProps({
    id: String
});

const store = useStore();
const input_comment0 = ref("");
const input_comment = ref("");
const myAvatar = computed(() => store.state.user.avatar);
//0是第一个父评论的子评论
const showIdx = ref(-1);
const targetCommentId = ref(-1);
const targetCommentAuthorName = ref("");


function date(time) {
    const timestamp = time;
    return new Date(timestamp).toLocaleString('zh-CN');
}

const comments = ref(null);

onMounted(async () => {
    const videoData = {
        vid: props.id
    }
    try {
        const response = await getVideosComments(videoData);
        if (response.data.code === 200) {
            comments.value = response.data.data.comments;
        } else {
            // console.log('评论获取请求失败');
        }
    } catch (error) {
        // console.log('评论获取请求失败');
    }
})

// const comments = ref([
//     {
//         comments: {
//             comment_id: 11,
//             name: 'Lana Del Rey',
//             avatar: '',
//             comment: '我发布一张新专辑Norman Fucking Rockwell,大家快来听啊',
//             created_at: 123123245534,
//             user_id: 123,
//             likes_count: 12
//         },
//         is_liked: false,
//         reply: [
//             {
//                 comments: {
//                     comment_id: 12,
//                     user_id: 12,
//                     name: 'LanRey',
//                     avatar: '',
//                     comment: '太好了',
//                     created_at: 123123245550,
//                     likes_count: 15,
//                 },
//                 is_liked: true,
//                 reply_to: 'Lana Del Rey'
//             }
//         ]
//     },
//     {
//         comments: {
//             comment_id: 13,
//             name: 'Lana Del Rey2',
//             avatar: '',
//             comment: '我发布一张l,大家快来听啊',
//             created_at: 123124245534,
//             user_id: 1323,
//             likes_count: 123
//         },
//         is_liked: true,
//         reply: [
//             {
//                 comments: {
//                     comment_id: 15,
//                     user_id: 12,
//                     name: 'LanRey',
//                     avatar: '',
//                     comment: '太好了',
//                     created_at: 123123245550,
//                     likes_count: 15,
//                 },
//                 is_liked: true,
//                 reply_to: 'Lana Del Rey2'
//             }
//         ]
//     },
// ])

function chooseCommentToReply(comment_id, father_id, name) {
    targetCommentId.value = comment_id;
    showIdx.value = father_id;
    targetCommentAuthorName.value = "回复" + name;
    input_comment0.value = "";
    input_comment.value = "";
}

async function sendComment0() {
    if (input_comment0.value == '' || input_comment0.value.trim == '') {
        alert('评论内容不能为空');
    } else {
        const commentData = {
            // user_id: -1,
            comment: input_comment0.value,
            father_comment_id: -1,
            vid: props.id
        }
        try {
            const response = await postVideosComments(commentData);
            if (response.data.code === 200) {
                // console.log('评论发送成功');

                const videoData = {
                    vid: props.id
                }
                try {
                    const response = await getVideosComments(videoData);
                    if (response.data.code === 200) {
                        comments.value = response.data.data.comments;
                    } else {
                        // console.log('评论获取请求失败');
                    }
                } catch (error) {
                    // console.log('评论获取请求失败');
                }

            } else {
                // console.log('评论发送失败');
            }
        } catch (error) {
            // console.log('评论发送请求失败');
        }
        input_comment0.value = "";
        input_comment.value = "";
    }

}

async function sendComment(reply, i) {

    if (input_comment.value == '' || input_comment.value.trim == '') {
        alert('评论内容不能为空');
    } else {
        const commentData = {
            // user_id: -1,
            comment: input_comment.value,
            father_comment_id: targetCommentId.value,
            vid: props.id
        }
        try {
            const response = await postVideosComments(commentData);
            if (response.data.code === 200) {
                // console.log('评论发送成功');

                const videoData = {
                    vid: props.id
                }
                try {
                    const response = await getVideosComments(videoData);
                    if (response.data.code === 200) {
                        comments.value = response.data.data.comments;
                    } else {
                        // console.log('评论获取请求失败');
                    }
                } catch (error) {
                    // console.log('评论获取请求失败');
                }

            } else {
                // console.log('评论发送失败');
            }
        } catch (error) {
            // console.log('评论发送请求失败');
        }
        input_comment0.value = "";
        input_comment.value = "";
        showIdx.value = -1;
        targetCommentId.value= -1;
        targetCommentAuthorName.value = "";
    }

}

async function clicked_like(item) {
    item.is_liked = !item.is_liked;
    if (item.is_liked == true) {
        item.comments.likes_count++;
    } else {
        item.comments.likes_count--;
    }
    const commentData = {
        vid: props.id,
        cid: item.comments.comment_id
    }
    if (item.is_liked == true) {
        try {
            const response = await postVideosCommentsLike(commentData);
            if (response.data.code === 200) {
                // console.log('评论点赞成功');
            } else {
                // console.log('评论点赞失败');
            }
        } catch (error) {
            // console.log('评论点赞请求有误');
        }
    } else {
        try {
            const response = await deleteVideosCommentsLike(commentData);
            if (response.data.code === 200) {
                // console.log('取消评论点赞成功');
            } else {
                // console.log('取消评论点赞失败');
            }
        } catch (error) {
            // console.log('评论点赞请求有误');
        }
    }
}

</script>

<style scoped>
.comment {
    
    /* background-color: var(--primary-100); */
    background-color: rgba(0, 0, 0, 0.8);
    height: auto;
    margin-bottom: 20px;
}

.my-reply {
    /* background-color:var(--primary-100); */
    background-color: rgba(0, 0, 0, 0.8);
    position: relative;
    display: grid;
    grid-template-rows: auto;
    /* 允许行根据内容自适应高度 */
    grid-template-columns: 40px 1fr;
    min-height: 80px;
    padding: 5px;
    border-bottom: 1px solid black;
    /* 给容器添加内边距 */
}

.my-input {
    display: grid;
    grid-template-rows: auto 1fr;
    /* 定义两行，一行用于输入框，一行用于按钮 */
}

.reply-input {
    background-color: aliceblue;
    width: 100%;
}

.my-avatar {
    grid-row: 1;
    grid-column: 1;
}

.reply-btn {
    grid-row: 2;
    grid-column: 1;
    justify-self: end;
    /* 将按钮向右对齐 */
    margin-top: 5px;
    /* 给按钮顶部添加外边距 */
}

.reply-btn:hover {
    cursor: pointer;
}

.comment-container {
    width: 100%;
    height: auto;
    margin-bottom: 10px;
}

.comment-father {
    margin: 10px;
    position: relative;
    display: grid;
    grid-template-rows: 40px 1fr;
}

.author-info {
    color: var(--text-200);
    /* background-color: var(--text-white2); */
    position: relative;
    display: grid;
    grid-template-columns: 40px 1fr;
    padding: 5px;
    /* 给容器添加内边距 */
    /* border: 1px solid black; */
}

.auther-avatar {
    grid-row: 1;
    grid-column: 1;
}

.author-name {
    grid-row: 1;
    grid-column: 2;
    align-self: center;
}

.content-container {
    color: var(--text-200);
    display: grid;
    grid-template-rows: 1fr 20px;
    width: 90%;
    justify-self: center;
    /* border: 1px solid red; */
}

.comment-info {
    /* color: var(--text-200); */
    display: grid;
    position: relative;
    grid-template-rows: 1fr;
    grid-template-columns: 180px 30px 80px 50px;
    margin-top: 5px;
    /* 给容器添加内边距 */
    font-size: 12px;
    align-items: center;
}

.text-info {
    color: var(--text-200);
    font-size: 16px;
}

.comment-son {
    margin: 10px;
    position: relative;
    display: grid;
    grid-template-rows: 40px 1fr;
}

.comment-sub-container {
    color: var(--text-200);
    margin-left: 40px;
    height: auto;
    margin-bottom: 10px;
}

.reply-button {
    font-size: 12px;
    border: none;
    border-radius: 4px;
    background-color: rgb(71, 112, 226);
    color:aliceblue;
}

.reply-button:hover {
    cursor: pointer;
    background-color: rgb(110, 140, 224);

}

.comment-like {
    color: rgb(255, 255, 255);
    animation: fireworks 0.5s forwards;
    transition: transform 0.5s ease-in-out;
}

.comment-like:hover{
    color: rgb(75, 125, 201);
    animation: fireworks 0.5s forwards;
    transition: transform 0.5s ease-in-out;
}

.clicked_like {
    color: rgb(75, 125, 201);
    animation: fireworks 0.5s forwards;
    transition: transform 0.5s ease-in-out;
}

.comment-like:hover {
    cursor: pointer;
}


</style>
