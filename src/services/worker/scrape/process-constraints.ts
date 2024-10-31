import os from 'node:os';

function determineBatchSize1() {
  const defaultBatchSize = 10;
  // Optionally, adjust based on system info
  return defaultBatchSize;
}

function determineBatchSize2() {
  const cores = navigator.hardwareConcurrency || 4; // Default to 4 if not available
  return Math.max(10, cores * 2); // Adjust multiplier as needed
}

// todo limit the memory allocated to chroma server in order to test whether memory is the bottleneck
// todo if memory isnt the bottleneck, then we spawn workers in order to increase the number of requests that can be handled
export function determineBatchSize3() {
  // const estimatedMemoryPerItem = 0.5; // MB

  const cores = os.cpus().length;

  const estimatedMemoryPerItemKB = 30; // As calculated above
  const estimatedMemoryPerItemMB = estimatedMemoryPerItemKB / 1024; // Convert KB to MB

  const freeMemoryMB = os.freemem() / (1024 * 1024);
  console.log('os.freemem(): ', os.freemem());
  console.log('os info: ', {freeMemoryMB, cores});
  const batchSize = Math.max(10, Math.floor(freeMemoryMB / estimatedMemoryPerItem));
  return [batchSize, cores];
}

export function determineBatchSize() {
  const estimatedMemoryPerItemKB = 30; // As calculated above
  const estimatedMemoryPerItemMB = estimatedMemoryPerItemKB / 1024; // Convert KB to MB

  const freeMemoryMB = os.freemem() / (1024 * 1024);
  const safetyMargin = 0.5; // Use only 50% of free memory
  const usableMemoryMB = freeMemoryMB * safetyMargin;

  const cores = os.cpus().length;

  console.log('os.freemem(): ', os.freemem());
  console.log('os info: ', {freeMemoryMB, cores});
  
  const batchSize = Math.max(
    10, // Minimum batch size
    Math.floor(usableMemoryMB / estimatedMemoryPerItemMB)
  );

  // Set an upper limit to prevent extremely large batches
  const maxBatchSize = 1000;
  return Math.min(batchSize, maxBatchSize);
}

export function chunkArray(array, size) {
  const result: any[] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
