function createQueue(){
  const queue: any[] = [];
  let isProcessing = false;

  return {
    push: (item: any) => {
      queue.push(item);
      if (!isProcessing) {
        processQueue();
      }
    },
  };

  async function processQueue() {
    isProcessing = true;
    while (queue.length) {
      const item = queue.shift();
      await item();
    }
    isProcessing = false;
  }
};