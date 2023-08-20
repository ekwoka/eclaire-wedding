import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { TypeWriter, TypingMode } from '~/lib/TypeWriter';

export const Hero = component$(() => {
  const text = useSignal(' ');
  const yearText = useSignal(' ');

  useVisibleTask$(() => {
    new TypeWriter(text)
      .withSpeed(300)
      .type('Eric + Claire')
      .wait(1000)
      .withMode(TypingMode.Insert)
      .withSpeed(100)
      .type('EClaire ')
      .wait(1000)
      .withSpeed(500)
      .type('EClaire')
      .wait(300)
      .andThen(() => new TypeWriter(yearText).withSpeed(300).type('2024'));
  });
  return (
    <div class="prose max-w-full w-full font-poppins flex flex-col justify-center p-8 min-h-[100dvh] bg-red-200 relative">
      <h1 class="text-left text-5xl mx-auto my-auto">
        <span class="relative z-10">{text.value}</span>
        <span class="text-9xl text-white italic absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {yearText.value}
        </span>
      </h1>
    </div>
  );
});
