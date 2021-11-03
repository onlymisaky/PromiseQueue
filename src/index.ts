import { Options, PromiseFunc } from './typings';

export default class PromiseQueue {

  private limit: number = 2;
  private concurrent: number = 0;
  private queue: PromiseFunc[] = [];

  constructor(options?: Options) {
    if (options?.limit) {
      this.limit = options.limit;
    }
  }

  add(promiseFunc: PromiseFunc) {
    this.queue.push(promiseFunc);
    this.next();
    return this;
  }

  private next() {
    if (this.queue.length === 0 || this.limit === this.concurrent) {
      return this;
    }

    this.concurrent++;
    const fn = this.queue.shift() as PromiseFunc;
    const promise = fn();
    promise.
      then(() => {
        this.run();
      })
      .catch(() => {
        this.run();
      });
  }


  private run() {
    this.concurrent--;
    this.next();
  }

}
