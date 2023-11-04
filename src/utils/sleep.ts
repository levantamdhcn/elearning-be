export const sleep = function (seconds?: number) {
  const delay = seconds || parseInt(process.env.REQUEST_DELAY);
  if (delay && delay > 0) {
    console.log('sleep for seconds:', delay);
    //sleepNode.sleep(delay);
    msleep(delay * 1000);
  }
};

const msleep = function (miliseconds: number) {
  //https://www.npmjs.com/package/sleep
  //When using nodejs 9.3 or higher it's better to use Atomics.wait which doesn't require compiling this C++ module.
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, miliseconds);
};
