// 引入js-sha256库
self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.9.0/sha256.min.js');

// 创建文件切片
function createFileChunk(file, chunkSize) {
  return new Promise(async(resolve, reject) => {
    let fileChunkList = [];
    let fileChunkList2 = [];
    let cur = 0;
    while (cur < file.size) {
      fileChunkList.push({ chunkFile: file.slice(cur, cur + chunkSize), chunkId: Math.floor(cur / chunkSize) });
      fileChunkList2.push(file.slice(cur, cur + chunkSize));
      cur += chunkSize;
    }
    // console.log("here1",(await mergeAndHashChunks(fileChunkList2,file)).fileHash);
    // console.log("here2",await calculateFileHash(file));
    //此处没问题，两个hash一致
    resolve(fileChunkList);
  });
}

// 计算单个切片的SHA-256哈希值
async function calculateChunkHash(chunkFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(chunkFile);
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        const hashArray = Array.from(new Uint8Array(arrayBuffer));
        const chunkHash = sha256.array(hashArray).map(b => b.toString(16).padStart(2, '0')).join('');
        console.log("切片hash值:"+chunkHash);
        resolve({ chunkHash, arrayBuffer }); // 返回切片哈希值和二进制数据
      } catch (err) {
        console.log(计算单个切片时发生错误1,err);
        reject(err); // 如果计算错误，则拒绝Promise
      }
    };
    reader.onerror = (err) => {
      console.log(计算单个切片时发生错误2,err);
      reject(err); // 如果读取错误，则拒绝Promise
    };
  });
}

// 并发控制函数：限制并发任务数量
async function processChunksWithConcurrencyLimit(fileChunkList, concurrencyLimit) {
  const results = [];
  const processing = [];

  for (const chunk of fileChunkList) {
    const promise = calculateChunkHash(chunk.chunkFile).then(result => {
      results[chunk.chunkId] = result; // 按照切片ID顺序存储结果
      return result;
    }).catch(error => {
      console.error('处理切片时出错:', error);
      throw error; // 确保错误能够被捕获
    });

    processing.push(promise);

    if (processing.length >= 1) {
      await Promise.race(processing); // 等待最早完成的任务
      processing.splice(0, 1); // 移除已完成的任务
    }
  }

  // 等待所有任务完成
  await Promise.allSettled(processing);

  return results;
}


// 计算整个文件的SHA-256哈希值
async function calculateFileHash(file) {
  // console.log("开始计算最终hash值1");
  // 读取文件内容为ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  // 将ArrayBuffer转换为Uint8Array
  const uint8Array = new Uint8Array(arrayBuffer);
  // 使用js-sha256库计算哈希值
  const hashArray = sha256.array(uint8Array);
  const fileHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  // console.log("最终的hash值: " + fileHash);
  return fileHash;
}
// here
async function mergeAndHashChunks(fileChunkList,file) {

  console.log(fileChunkList.length);
  // 合并切片
  const mergedBlob = new Blob(fileChunkList,{type: file.type});

  // 计算整个文件的 SHA-256 哈希值
  const fileHash = await calculateFileHash(mergedBlob);

  // 返回结果
  return { mergedBlob, fileHash };
}

// 加载并计算文件切片的SHA-256
async function calculateChunksHash(fileChunkList, concurrencyLimit, file) {
  const chunkHashes = [];
  const chunkResults = []; // 用于存储每个切片的哈希值和二进制数据
  let percentage = 0;

  try {
    // 使用并发控制函数处理切片
    const results = await processChunksWithConcurrencyLimit(fileChunkList, concurrencyLimit);

    // 提取哈希值和二进制数据
    results.forEach(result => {
      chunkHashes.push(result.chunkHash);
      console.log(result.chunkHash);
      chunkResults.push(result);
    });

    let fileChunkList2 = [];
    for(const chunk of fileChunkList){
      fileChunkList2.push(chunk.chunkFile);
    }
    // console.log("希望",(await mergeAndHashChunks(fileChunkList2,file)).fileHash);



    // 更新进度为100%
    self.postMessage({ type: 'progress', percentage: 100 });

    // 计算整个文件的SHA-256哈希值
    const fileHash = await calculateFileHash(file);
    self.postMessage({ type: 'complete', fileHash, chunkHashes, fileChunkList }); // 发送最终结果到主线程
    console.log('文件哈希值计算完成:in hash-worker.js');
    self.close(); // 关闭Worker
  } catch (err) {
    self.postMessage({ name: 'error', data: err }); // 发送错误到主线程
    self.close(); // 关闭Worker
  }
}

// 监听消息
self.addEventListener(
  'message',
  async (e) => {
    try {
      const { file, chunkSize, concurrencyLimit = 12 } = e.data;
      const fileChunkList = await createFileChunk(file, chunkSize);
      await calculateChunksHash(fileChunkList, concurrencyLimit, file);
    } catch (err) {
      console.error('worker监听发生错误:', err);
      self.postMessage({ name: 'error', data: err });
      self.close();
    }
  },
  false
);

// 主线程可以监听 Worker 是否发生错误。如果发生错误，Worker 会触发主线程的error事件。
self.addEventListener('error', function (event) {
  console.log('Worker触发主线程的error事件:', event);
  self.close(); // 关闭Worker
});