<template>
    <div class="page-container">
        <div class="content">
            <ListItem :uploadFileList="uploadFileList" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { defineExpose, defineEmits } from 'vue';
import { uploadFile, mergeChunk } from '@/api/index.js';
import { v4 as uuidv4 } from 'uuid';
import ListItem from "@/components/items/ListItem.vue";


const chunkSize = 10 * 1024 * 1024;//10 MB
// 上传文件列表
const uploadFileList = ref([]);
// 请求最大并发数
const maxRequest = ref(12);

// 输入框change事件
const hanldeUploadFile = async (uploadSrcFile) => {
    // console.log("进入函数内部: 1");
    const file = uploadSrcFile.videoFile;
    const fileId = `${uuidv4()}`;
    // console.log(`fileId:${fileId}`);
    // 设置整个文件的格式
    let inTaskArrItem = reactive({
        id: fileId, //
        state: 0, // 0是什么都不做,1文件处理中,2是上传中,3是暂停,4是上传完成,5上传中断，6是上传失败
        fileHash: '',
        fileName: file.name,
        fileSize: file.size,
        chunk_end_id: 0,
        allChunkList: [], // 所有请求的数据
        whileRequests: [], // 正在请求中的请求个数,目前是要永远都保存请求个数为6
        finishNumber: 0, //请求完成的个数
        errNumber: 0, // 报错的个数,默认是0个,超多3个就是直接上传中断
        percentage: 0, // 单个文件上传进度条
        cancel: null, // 用于取消切片上传接口
        videoTitle: uploadSrcFile.title,
        videoDescription: uploadSrcFile.description,
        videoImage: uploadSrcFile.coverImage
    })
    if (uploadFileList.value.length >= 1) {
        uploadFileList.value.length = 0;
    }
    uploadFileList.value.push(inTaskArrItem)
    // 开始处理解析文件
    inTaskArrItem.state = 1;
    if (file.size === 0) {
        // 文件大小为0直接上传失败
        inTaskArrItem.state = 6
        // 上传中断
        pauseUpload(inTaskArrItem, false)
    }
    // console.log('开始计算hash：2');
    // 计算文件hash
    const { fileHash, fileChunkList, chunkHashes } = await useWorker(file);

    //到此处都没有问题，成功计算总hash
    //这里尝试合并一下计算hash/////////////////////////////////////////
    // let fileChunkList2 = [];
    // for(const chunk of fileChunkList){
    //     // console.log("chunk",chunk);
    //   fileChunkList2.push(chunk.chunkFile);
    // }
    // async () => {
      // 合并分片文件数组
    //   const mergedBlob = new Blob(fileChunkList2, { type: file.type });

    //   // 计算合并后的 Blob 的 SHA-256 哈希值
    //   const arrayBuffer = await mergedBlob.arrayBuffer();
    //   const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    //   const hashArray = Array.from(new Uint8Array(hashBuffer));
    //   const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    //   console.log("希望2",hashHex);
    // };



    ///////////////////////////////////////////////////////////////////////////////////

    // console.log(`hash计算完毕 3:  fileChunkList.length:${fileChunkList.length}, chunkHashes.length:${chunkHashes.length}`);
    // 设置文件hash并且更改状态为上传中
    inTaskArrItem.fileHash = `${fileHash}`;
    inTaskArrItem.state = 2;
    try {
        // 设置每个切片的格式
        inTaskArrItem.allChunkList = fileChunkList.map((item, index) => {
            return {
                // 总文件hash
                upload_id: `${fileId}`,
                // 切片文件本身
                chunk_data: item.chunkFile,
                // 分片编号
                chunk_id: index,
                // 切片文件大小
                chunkSize: item.chunkFile.size,
                // 切片是否已经完成
                finish: false,
                // 总共切片数量
                chunkNumber: fileChunkList.length,
                // 切片hash值
                chunkHash: chunkHashes[index]
            }
        })
        // console.log("上传单个文件: 5");
        inTaskArrItem.chunk_end_id = fileChunkList.length - 1;
        // 逐步对单个文件进行切片上传
        uploadSignleFile(inTaskArrItem);
    } catch (err) { return false }
}
// 单个文件上传
const uploadSignleFile = (taskArrItem) => {
    // 如果没有需要上传的切片 / 正在上传的切片还没传完，就不做处理
    if (
        taskArrItem.allChunkList.length === 0 ||
        taskArrItem.whileRequests.length > 0
    ) {
        return false
    }
    // 找到文件处于处理中/上传中的 文件列表（是文件而不是切片）
    const isTaskArrIng = uploadFileList.value.filter(
        (itemB) => itemB.state === 1 || itemB.state === 2
    )

    // 例如如果有3个文件同时上传/处理中，则每个文件切片接口最多调 6 / 3 == 2个相同的接口
    maxRequest.value = Math.ceil(6 / isTaskArrIng.length)

    // 从数组的末尾开始提取 maxRequest 个元素。
    let whileRequest = taskArrItem.allChunkList.slice(-maxRequest.value)

    // 设置正在请求中的个数
    taskArrItem.whileRequests.push(...whileRequest)
    //  如果总请求数大于并发数
    if (taskArrItem.allChunkList.length > maxRequest.value) {
        // 则减去并发数
        taskArrItem.allChunkList.splice(-maxRequest.value)
    } else {
        // 否则总请求数置空,说明已经把没请求的全部放进请求列表了，不需要做过多请求
        taskArrItem.allChunkList = []
    }

    // 单个分片请求
    const uploadChunk = async (needObj) => {
        const fd = new FormData()
        const {
            // 总文件hash
            upload_id,
            // 切片文件本身
            chunk_data,
            // 分片编号
            chunk_id,
            // 切片文件大小
            chunkSize,
            // 总的切片数量
            chunkNumber,
            // 切片hash值
            chunkHash

        } = needObj
        fd.append('upload_id', upload_id);
        fd.append('chunk_data', chunk_data);
        fd.append('chunk_id', chunk_id+1);
        fd.append('chunk_size', chunkSize);
        fd.append('chunk_hash', chunkHash);

        // console.log("chunk_hash"+chunkHash);
        // 上传切片
        const res = await uploadFile(fd, (onCancelFunc) => {
            // 在调用接口的同时，相当于同时调用了传入的这个函数，又能同时拿到返回的取消方法去赋值
            needObj.cancel = onCancelFunc
        }).catch((err) => {
            alert("错误信息：" + err);
            return false;
        });

        // 先判断是不是处于暂停还是取消状态
        if (taskArrItem.state === 3 || taskArrItem.state === 5) {
            return false
        }

        // console.log(`返回信息6:${chunk_id}`);
        // 请求异常,或者请求成功服务端返回报错都按单片上传失败逻辑处理
        if (!res || !res.data || res.data.code !== 200) {
            // console.log(`返回响应，${JSON.stringify(res)}`);
            taskArrItem.errNumber++
            // 超过3次之后直接上传中断W
            if (taskArrItem.errNumber > 3) {
                // console.log(`切片上传失败超过三次了,${chunk_id}`);
                pauseUpload(taskArrItem, false) // 上传中断
                emit('child-event', { message: "上传失败超过三次", result: false });
            } else {
                // console.log('切片上传失败还没超过3次');
                uploadChunk(needObj) // 失败了一片,继续当前分片请求
            }
        } else if (res.data.code === 200) {
            // console.log('切片上传成功', chunk_id);
            // 单个文件上传失败次数大于0则要减少一个
            taskArrItem.errNumber > 0 ? taskArrItem.errNumber-- : 0
            taskArrItem.finishNumber++
            // 单个切片上传完成
            needObj.finish = true
            signleFileProgress(needObj, taskArrItem) // 更新进度条
            // 上传成功了就删掉请求中数组中的那一片请求
            taskArrItem.whileRequests = taskArrItem.whileRequests.filter(
                (item) => item.chunkFile !== needObj.chunkFile
            )

            // 如果单个文件最终成功数等于切片个数
            if (taskArrItem.finishNumber === chunkNumber) {
                // 全部上传完切片后就开始合并切片
                handleMerge(taskArrItem)
            } else {
                // 如果还没完全上传完，则继续上传
                uploadSignleFile(taskArrItem)
            }
        }
    }
    // 开始单个上传
    for (const item of whileRequest) {
        uploadChunk(item)
    }
}
// 生成文件的 hash，把文件切片，然后返回切片列表即hash值
const useWorker = (file) => {
    return new Promise((resolve) => {
        const worker = new Worker('./hash-worker.js');
        worker.postMessage({ file, chunkSize: chunkSize });
        worker.onmessage = (e) => {
            const { fileHash, fileChunkList, chunkHashes } = e.data
            if (fileHash) {
                resolve({
                    fileHash,
                    fileChunkList,
                    chunkHashes
                })
            }
        };
    })
}
// 调取合并接口处理所有切片
const handleMerge = async (taskArrItem) => {
    // console.log('开始合并切片');
    const { id, fileHash, chunk_end_id, videoTitle, videoDescription, videoImage } = taskArrItem
    const fd = new FormData()
    fd.append('upload_id', id);
    fd.append('chunk_end_id', chunk_end_id+1);
    fd.append('title', videoTitle);
    fd.append('description', videoDescription);
    fd.append('cover', videoImage);
    fd.append('video_hash', fileHash);

    // console.log("上传数据：", fd);
    const res = await mergeChunk(fd).catch((err) => {
        alert("上传图片错误", err);
    })

    // console.log('合并接口返回', res);
    //  如果合并成功则标识该文件已经上传完成
    if (res && res.data && res.data.code === 200) {
        // 设置文件上传状态
        finishTask(taskArrItem)
        // console.log('文件合并成功！');
        emit('child-event', { message: "上传成功", result: true });
    } else {
        // 否则暂停上传该文件
        pauseUpload(taskArrItem, true);
        // console.log('文件合并失败！');
        emit('child-event', { message: "文件合并时发生错误", result: false });
    }
    // 最后赋值文件切片上传完成个数为0
    taskArrItem.finishNumber = 0;
}

// 暂停上传（是暂停剩下未上传的）
const pauseUpload = (taskArrItem, elsePause = true) => {
    // elsePause为true就是主动暂停，为false就是请求中断
    // 4是成功 6是失败  如果不是成功或者失败状态，
    if (![4, 6].includes(taskArrItem.state)) {
        // 3是暂停，5是中断
        if (elsePause) {
            taskArrItem.state = 3
        } else {
            taskArrItem.state = 5
        }
    }
    taskArrItem.errNumber = 0

    // 取消还在请求中的所有接口
    if (taskArrItem.whileRequests.length > 0) {
        for (const itemB of taskArrItem.whileRequests) {
            itemB.cancel ? itemB.cancel() : ''
        }
    }
}

// 更新单个文件进度条
const signleFileProgress = (needObj, taskArrItem) => {
    // 即使是超时请求也是会频繁的返回上传进度的,所以只能写成完成一片就添加它所占百分之多少,否则会造成误会
    taskArrItem.percentage = Number(
        ((taskArrItem.finishNumber / needObj.chunkNumber) * 100).toFixed(2)
    )
}
// 设置单个文件上传已完成
const finishTask = (item) => {
    item.percentage = 100
    // 4是上传完成
    item.state = 4
}

// 将方法暴露给父组件
defineExpose({
    hanldeUploadFile
});

// 定义可以触发的事件
const emit = defineEmits(['child-event']);


</script>

<style scoped>
.page-container {
    width: 600px;
    height: 120px;
    margin: auto;
    display: float;
    border: 3px solid rgba(0, 0, 0, 0.1);
    flex-direction: column;
}
</style>
