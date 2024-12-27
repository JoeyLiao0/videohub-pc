// 引入js-sha256库
self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.9.0/sha256.min.js');

// 创建文件切片
function createFileChunk(file, chunkSize) {
  return new Promise((resolve, reject) => {
    let fileChunkList = [];
    let cur = 0;
    while (cur < file.size) {
      fileChunkList.push({ chunkFile: file.slice(cur, cur + chunkSize), chunkId: Math.floor(cur / chunkSize) });
      cur += chunkSize;
    }
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
        console.log("hreerere  "+chunkHash);
        resolve({ chunkHash, arrayBuffer }); // 返回切片哈希值和二进制数据
      } catch (err) {
        console.log(err);
        reject(err); // 如果计算错误，则拒绝Promise
      }
    };
    reader.onerror = (err) => {
      reject(err); // 如果读取错误，则拒绝Promise
    };
  });
}

// 并发控制函数：限制并发任务数量
// async function processChunksWithConcurrencyLimit(fileChunkList, concurrencyLimit) {
//   const results = [];
//   const processing = [];

//   for (const chunk of fileChunkList) {
//     // 创建一个处理切片的任务
//     const promise = calculateChunkHash(chunk.chunkFile).then(result => {
//       results[chunk.chunkId] = result; // 按照切片ID顺序存储结果
//       return result;
//     }).catch(error => {
//       throw error; // 确保错误能够被捕获
//     });

//     // 将任务添加到正在处理的任务列表中
//     processing.push(promise);

//     // 当任务数量达到并发限制时，等待最早完成的任务
//     if (processing.length >= concurrencyLimit) {
//       await Promise.race(processing); // 等待最早完成的任务
//       processing.splice(processing.indexOf(Promise.resolve()), 1); // 移除已完成的任务
//     }
//   }

//   // 等待所有任务完成
//   await Promise.all(processing);

//   return results;
// }

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

    if (processing.length >= concurrencyLimit) {
      await Promise.race(processing); // 等待最早完成的任务
      processing.splice(0, 1); // 移除已完成的任务
    }
  }

  // 等待所有任务完成
  await Promise.allSettled(processing);

  return results;
}

// 计算整个文件的SHA-256哈希值
async function calculateFileHash(chunkResults) {
  // 合并所有切片的ArrayBuffer
  let totalLength = chunkResults.reduce((acc, { arrayBuffer }) => acc + arrayBuffer.byteLength, 0);
  const mergedBuffer = new Uint8Array(totalLength);
  let offset = 0;
  for (const { arrayBuffer } of chunkResults) {
    mergedBuffer.set(new Uint8Array(arrayBuffer), offset);
    offset += arrayBuffer.byteLength;
  }

  // 计算整个文件的哈希值
  const hashArray = Array.from(mergedBuffer);
  const fileHash = sha256.array(hashArray).map(b => b.toString(16).padStart(2, '0')).join('');

  return fileHash;
}

// 加载并计算文件切片的SHA-256
async function calculateChunksHash(fileChunkList, concurrencyLimit) {
  const chunkHashes = [];
  const chunkResults = []; // 用于存储每个切片的哈希值和二进制数据
  let percentage = 0;

  try {
    // 使用并发控制函数处理切片
    const results = await processChunksWithConcurrencyLimit(fileChunkList, concurrencyLimit);

    // 提取哈希值和二进制数据
    results.forEach(result => {
      chunkHashes.push(result.chunkHash);
      chunkResults.push(result);
    });

    // 更新进度为100%
    self.postMessage({ type: 'progress', percentage: 100 });

    // 计算整个文件的SHA-256哈希值
    const fileHash = await calculateFileHash(results);
    self.postMessage({ type: 'complete', fileHash, chunkHashes, fileChunkList }); // 发送最终结果到主线程
    console.log('文件哈希值计算完成：in hash-worker.js');
    self.close(); // 关闭Worker
  } catch (err) {
    self.postMessage({ name: 'error', data: err }); // 发送错误到主线程
    self.close(); // 关闭Worker
  }
}

// 监听消息
// self.addEventListener(
//   'message',
//   async (e) => {
//     try {
//       const { file, chunkSize, concurrencyLimit = 3 } = e.data; // 默认并发数为3
//       const fileChunkList = await createFileChunk(file, chunkSize); // 创建文件切片
//       await calculateChunksHash(fileChunkList, concurrencyLimit); // 等待计算完成
//     } catch (err) {
//       console.error('worker监听发生错误:', err);
//       self.close();
//     }
//   },
//   false
// );

// 监听消息
self.addEventListener(
  'message',
  async (e) => {
    try {
      const { file, chunkSize, concurrencyLimit = 6 } = e.data;
      const fileChunkList = await createFileChunk(file, chunkSize);
      await calculateChunksHash(fileChunkList, concurrencyLimit);
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
  console.log('Worker触发主线程的error事件：', event);
  self.close(); // 关闭Worker
});