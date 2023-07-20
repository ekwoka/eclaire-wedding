import { Hero } from '@/sections';
import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="">
      <Hero />
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Hello World',
};
