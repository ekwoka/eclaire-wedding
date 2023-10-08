export const nextTick = () => new Promise(res => queueMicrotask(() => setTimeout(res, 0)))
