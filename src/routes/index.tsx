import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { TypeWriter, TypingMode } from '~/lib/TypeWriter';

export default component$(() => {
  const text = useSignal(' ');
  const yearText = useSignal(' ');

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
      .type('EClaire')
      .wait(500)
      .andThen(() => new TypeWriter(yearText).withSpeed(500).type('2024'));
  });

  return (
    <>
      <div class="prose flex flex-col justify-center p-8 min-h-[100dvh] mx-auto">
        <h1 class="font-poppins text-left text-6xl mx-auto my-auto relative">
          <span class="text-[10rem] text-blue-400 italic absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
            {yearText.value}
          </span>
          <span class="">{text.value}</span>
        </h1>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'EClaire 2024',
};
