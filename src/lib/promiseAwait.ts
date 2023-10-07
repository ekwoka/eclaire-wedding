
  globalThis.Promise.prototype.await = function () {
    return proxyPromise(this);
  }

declare global {
  interface Promise<T> {
    await(): T & Promise<T>;
  }
}

export const proxyPromise = <T>(promise: Promise<T>): T & Promise<T> => {
  return new Proxy(() => {}, {
    get: (_target, prop) => {
      if (prop in promise) {
        const result = promise[prop as keyof Promise<T>];
        return typeof result === 'function' ? result.bind(promise) : result;
      }
      return proxyPromise(
        promise.then((res) => {
          const result = res[prop as keyof T];
          return typeof result === 'function' ? result.bind(res) : result;
        }),
      );
    },
    apply: (_target, _thisArg, args) => {
      return proxyPromise(promise.then((res) =>(res as T extends Function ? T : never)(...args)));
    },
  }) as T & Promise<T>;
};
