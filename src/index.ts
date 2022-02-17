export type PromiseFunc = () => Promise<any>;

export interface Options {
  limit?: number;
  onAllFinish: (result: PromiseSettledResult<any>[]) => void;
}

export default class PromiseQueue {

  private limit: number = 2;
  private current: number = 0;
  private queue: PromiseFunc[] = [];
  private runningQueue: PromiseFunc[] = [];
  private finishQueue: PromiseFunc[] = [];
  private results: any[] = [];
  private timer: undefined | number;

  private onAllFinish?: (result: PromiseSettledResult<any>[]) => void;

  get total() {
    return this.queue.length;
  }

  get concurrent() {
    return this.runningQueue.length;
  }

  get finishedCount() {
    return this.finishQueue.length;
  }

  constructor(options?: Options) {
    if (options?.limit) {
      this.limit = options.limit;
    }
    if (options?.onAllFinish) {
      this.onAllFinish = options.onAllFinish.bind(this);
    }
  }

  add(promiseFunc: PromiseFunc) {
    this.queue.push(promiseFunc);
    this.next();
    return this;
  }

  private next() {
    if (this.finishedCount === this.total || this.limit === this.concurrent || this.current === this.total) {
      return this;
    }

    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = undefined;
    }

    const fn = this.queue[this.current];
    this.current++;
    this.runningQueue.push(fn);
    const promise = Promise.allSettled([fn()]);
    promise.then((res) => {
      this.resolveNext(fn, res[0]);
    });
  }

  private resolveNext = (fn: PromiseFunc, result: PromiseSettledResult<any>) => {
    this.finishQueue.push(fn);
    const runningIndex = this.runningQueue.indexOf(fn);
    this.runningQueue.splice(runningIndex, 1);
    const queueIndex = this.queue.indexOf(fn);
    this.results[queueIndex] = result;

    this.timer = setTimeout(() => {
      if (this.finishedCount === this.total && typeof this.onAllFinish === 'function') {
        this.onAllFinish(this.results);
      }
    }, 0);

    this.next();
  }

}
