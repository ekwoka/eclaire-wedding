import { Prose } from '@/atoms';
import { Footer, Nav } from '@/molecule';
import { Hero } from '@/sections';
import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import Lodging from '~/content/lodging.mdx';

export default component$(() => {
  return (
    <>
      <div class="min-h-[25dvh] w-full bg-tuscany-200 flex flex-col justify-end">
        <Hero style="short" />
      </div>
      <Nav />
      <Prose>
        <Lodging />
      </Prose>
      <Footer />
    </>
  );
});

export const head: DocumentHead = {
  title: 'EClaire 2024 - Where to Stay',
};
