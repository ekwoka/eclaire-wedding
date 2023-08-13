import { Signal } from '@builder.io/qwik';

export enum TypingMode {
  FromEnd = 'fromend',
  Insert = 'inline',
}

export class TypeWriter {
  cursor?: Signal<number>;
  text: Signal<string>;
  target: string;
  tail: Promise<void>;
  mode: TypingMode;
  stepTime: number;
  constructor(text: Signal<string>) {
    this.text = text;
    this.target = text.value
    this.mode = TypingMode.FromEnd;
    this.stepTime = 100;
    this.tail = wait(this.stepTime)
  }
  type(newText: string) {
    const operations = createOperations(this.target, newText, { inline: this.mode === TypingMode.Insert });
    this.target = newText
    const time = this.stepTime;
    for (const operation of operations) {
      if (operation.type === 'insert') {
        this.addStep(() => this.insert(operation.index, operation.value));
      } else if (operation.type === 'delete') {
        this.addStep(() => this.delete(operation.index, operation.value));
      }
      this.addStep(() => wait(time))
    }
    return this
  }
  withMode(mode: TypingMode) {
    this.mode = mode;
    return this;
  }
  withSpeed(speed: number) {
    this.stepTime = speed;
    return this;
  }
  wait(ms: number) {
    this.addStep(() => wait(ms));
    return this;
  }
  addStep(step: () => Promise<void> | void) {
    this.tail = this.tail.then(step);
  }
  insert(index: number, value: string) {
    this.text.value = this.text.value.slice(0, index) + value + this.text.value.slice(index);
  }
  delete(index: number, value: string) {
    this.text.value = this.text.value.slice(0, index) + this.text.value.slice(index + value.length);
  }
}

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

type TypeWriterSignal = Signal & {
  type: (newText: string) => void;
  cursor: Signal<number>
}

export const diff = (a: string, b: string): string => {
  const maxSize = Math.max(a.length, b.length);
  const minSize = Math.min(a.length, b.length);
  let diff = 0b0n;
  for (let i = 0; i < minSize; i++)
    if (a[i] !== b[i])
    diff ^= 0b1n << BigInt(maxSize-i-1);
  for (let i = minSize; i < maxSize; i++)
    diff ^= 0b1n << BigInt(maxSize-i-1);
  return diff.toString(2).padStart(maxSize, '0');
}

type CreateOptions = Partial<{
  inline: boolean,
}>
export const createOperations = (current: string, target: string, options: CreateOptions = {}) => {
  if (Object.is(current, target)) return [];
  if(target.startsWith(current)) return createInserts(target.slice(current.length), current.length);
  if(current.startsWith(target)) return createRemovals(current.slice(target.length), current.length-1);
  if (options.inline)
    return createLevenshteinActions(current, target);
  return createModificationsFromEnd(current, target);
}

const createModificationsFromEnd = (current: string, target: string): Action[] => {
  const diffString = diff(current, target);
  if (!diffString.includes('0'))
    return [...createRemovals(current, current.length-1), ...createInserts(target, 0)];
  const firstDiff = diffString.indexOf('1');
  return [...createRemovals(current.slice(firstDiff), current.length-1), ...createInserts(target.slice(firstDiff), firstDiff)]
}

const createInserts = (toAdd: string, index: number): Action[] => toAdd.split('').map((value, i) => ({ type: ActionType.Insertion, index: index+i, value }))

const createRemovals = (toRemove: string, index: number): Action[] => toRemove.split('').reverse().map((value, i) => ({ type: ActionType.Deletion, index: index-i, value }))

export enum ActionType {
  Insertion = 'insert',
  Deletion = 'delete',
  NoAction = 'no-action',
}

type Action = {
  type: ActionType;
  value: string;
  index: number;
};

type Step = {
  i: number;
  j: number;
  distance: number;
  action: Action;
  previous?: Step;
};

export const createLevenshteinActions = (str1: string, str2: string): Action[]=> {
  const m = str1.length;
  const n = str2.length;

  const queue: Step[] = [
    {
      i: 0,
      j: 0,
      distance: 0,
      action: { type: ActionType.NoAction, value: '', index: 0 },
    },
  ];
  const addToQueue = (step: Step) => {
    if(step.i > m || step.j > n) return;
    const key = `${step.i},${step.j}`;
    if (visited.has(key)) return;
    const insertionPoint = queue.findIndex((s) => s.distance >= step.distance && s.action.type !== step.previous?.action.type);
    if (insertionPoint === -1) queue.push(step);
    else queue.splice(insertionPoint, 0, step);
  }
  const visited = new Set<string>();

  while (queue.length) {
    const current = queue.shift()!;
    if (current.i === m && current.j === n) return (reconstructPath(current));
    const key = `${current.i},${current.j}`;
    visited.add(key);

        addToQueue({
          i: current.i,
          j: current.j + 1,
          distance: current.distance + 1,
          action: {
            type: ActionType.Insertion,
            value: str2[current.j],
            index: current.j,
          },
          previous: current,
        });
        addToQueue({
          i: current.i + 1,
          j: current.j,
          distance: current.distance + 1,
          action: {
            type: ActionType.Deletion,
            value: str1[current.i],
            index: current.i,
          },
          previous: current,
        });
      if (str1[current.i] === str2[current.j])
      addToQueue({
        i: current.i + 1,
        j: current.j + 1,
        distance: current.distance,
        action: { type: ActionType.NoAction, value: '', index: current.i },
        previous: current,
      });
  }
  return [];
}

const reconstructPath = (current?: Step): Action[] => {
  const result: Action[] = [];
  while (current) {
    if (current.action.type !== ActionType.NoAction)
      result.unshift(current.action);
    current = current.previous;
  }
  return reverseDeletions(result);
}

const reverseDeletions = (actions: Action[]): Action[] => {
  return actions.sort((a, b) => {
    if (a.type === ActionType.Deletion && b.type === ActionType.Deletion) return b.index - a.index
    if (a.type === ActionType.Insertion && b.type === ActionType.Insertion) return a.index - b.index;
    if (a.type === ActionType.Insertion && b.type === ActionType.Deletion) return 1;
    if (a.type === ActionType.Deletion && b.type === ActionType.Insertion) return -1;

    return a.index - b.index;
  })
}
