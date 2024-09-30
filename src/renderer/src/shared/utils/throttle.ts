export const throttle = (func, delay) => {
  let lastExecuted = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastExecuted >= delay) {
      lastExecuted = now;
      func.apply(null, args);
    }
  };
};
