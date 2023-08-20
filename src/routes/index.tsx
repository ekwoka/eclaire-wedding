import { Hero } from '@/sections';
import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import MainInfo from '~/content/info.mdx';

export default component$(() => {
  return (
    <>
      <Hero />
      <div class="w-full px-4 py-8 flex flex-col gap-8 mx-auto max-w-prose">
        <div class="prose">
          <MainInfo />
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'EClaire 2024',
};
