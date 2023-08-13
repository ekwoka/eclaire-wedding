import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { TypeWriter, TypingMode } from '~/lib/TypeWriter';

export default component$(() => {
  const text = useSignal('');

  useVisibleTask$(() => {
    new TypeWriter(text)
      .withSpeed(200)
      .type('Eric + Claire')
      .wait(1000)
      .withMode(TypingMode.Insert)
      .withSpeed(100)
      .type('EClaire ')
      .wait(1000)
      .withSpeed(500)
      .type('EClaire 2024');
  });

  return (
    <>
      <div class="prose flex flex-col justify-center p-8 min-h-[100dvh]">
        <h1 class="font-poppins text-left text-3xl mx-auto my-auto">
          {text.value}
        </h1>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'EClaire 2024',
};
