import type { Signal } from '@builder.io/qwik';
import {
  ActionType,
  TypeWriter,
  createLevenshteinActions,
  createOperations,
} from '~/lib/TypeWriter';

describe('TypeWriter', () => {
  it('progressively types text', async () => {
    const text = { value: '' } as Signal<string>;
    const typewriter = new TypeWriter(text);
    typewriter.type('hello world');
    await sleep(50);
    expect(text.value).toBe('');
    await sleep(100);
    expect(text.value).toBe('h');
    await sleep(100);
    expect(text.value).toBe('he');
    await sleep(600);
    expect(text.value).toBe('hello wo');
  });
  it('can have its speed changed', async () => {
    const text = { value: 'Hello World' } as Signal<string>;
    const typewriter = new TypeWriter(text).withSpeed(20);
    typewriter.type('Hi Mom');
    await sleep(90);
    expect(text.value).toBe('Hello World');
    await sleep(21);
    expect(text.value).toBe('Hello Worl');
    await sleep(21);
    expect(text.value).toBe('Hello Wor');
    await sleep(61);
    expect(text.value).toBe('Hello ');
    await sleep(181);
    expect(text.value).toBe('Hi Mo');
  });
});

describe('createOperations', () => {
  it('creates insert operations to write string', () => {
    const operations = createOperations('hello', 'hello world');
    expect(operations).toEqual([
      { type: 'insert', index: 5, value: ' ' },
      { type: 'insert', index: 6, value: 'w' },
      { type: 'insert', index: 7, value: 'o' },
      { type: 'insert', index: 8, value: 'r' },
      { type: 'insert', index: 9, value: 'l' },
      { type: 'insert', index: 10, value: 'd' },
    ]);
  });
  it('creates removal operations to delete string', () => {
    const operations = createOperations('hello world', 'hello');
    expect(operations).toEqual([
      { type: 'delete', index: 10, value: 'd' },
      { type: 'delete', index: 9, value: 'l' },
      { type: 'delete', index: 8, value: 'r' },
      { type: 'delete', index: 7, value: 'o' },
      { type: 'delete', index: 6, value: 'w' },
      { type: 'delete', index: 5, value: ' ' },
    ]);
  });
  it('can completely remove and rewrite new string', () => {
    const operations = createOperations('hello', 'goodbye');
    expect(operations).toEqual([
      { type: 'delete', index: 4, value: 'o' },
      { type: 'delete', index: 3, value: 'l' },
      { type: 'delete', index: 2, value: 'l' },
      { type: 'delete', index: 1, value: 'e' },
      { type: 'delete', index: 0, value: 'h' },
      { type: 'insert', index: 0, value: 'g' },
      { type: 'insert', index: 1, value: 'o' },
      { type: 'insert', index: 2, value: 'o' },
      { type: 'insert', index: 3, value: 'd' },
      { type: 'insert', index: 4, value: 'b' },
      { type: 'insert', index: 5, value: 'y' },
      { type: 'insert', index: 6, value: 'e' },
    ]);
  });
  it('creates removals and inserts to replace string', () => {
    const operations = createOperations('hello world', 'hello mom');
    expect(operations).toEqual([
      { type: 'delete', index: 10, value: 'd' },
      { type: 'delete', index: 9, value: 'l' },
      { type: 'delete', index: 8, value: 'r' },
      { type: 'delete', index: 7, value: 'o' },
      { type: 'delete', index: 6, value: 'w' },
      { type: 'insert', index: 6, value: 'm' },
      { type: 'insert', index: 7, value: 'o' },
      { type: 'insert', index: 8, value: 'm' },
    ]);
  });
  it('can remove/insert at middle of string', () => {
    const operations = createOperations('eric claire', 'eclaire', {
      inline: true,
    });
    expect(operations).toEqual([
      { type: 'delete', index: 4, value: ' ' },
      { type: 'delete', index: 3, value: 'c' },
      { type: 'delete', index: 2, value: 'i' },
      { type: 'delete', index: 1, value: 'r' },
    ]);
  });
});

describe('levenshtein distance', () => {
  it('calculates distance between two strings', () => {
    const actions = createLevenshteinActions('hello', 'hello world');
    expect(actions).toEqual([
      { type: ActionType.Insertion, index: 5, value: ' ' },
      { type: ActionType.Insertion, index: 6, value: 'w' },
      { type: ActionType.Insertion, index: 7, value: 'o' },
      { type: ActionType.Insertion, index: 8, value: 'r' },
      { type: ActionType.Insertion, index: 9, value: 'l' },
      { type: ActionType.Insertion, index: 10, value: 'd' },
    ]);
  });
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
