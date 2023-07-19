import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="prose">
      <h1>Hello World</h1>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Hello World',
};
