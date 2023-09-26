import {
  $,
  component$,
  useOnWindow,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import { TypeWriter, TypingMode } from '~/lib/TypeWriter';
import { classNames } from '~/utils';

export const Hero = component$((props: { class?: string }) => {
  const text = useSignal(' ');
  const yearText = useSignal(' ');
  const heroHeight = useSignal(globalThis.innerHeight);
  const heroElement = useSignal<HTMLElement>();
  useOnWindow(
    'scroll',
    $(() => {
      const height = window.innerHeight;
      const currentScroll = window.scrollY;
      heroHeight.value = Math.max(
        height - currentScroll,
        heroElement.value?.firstElementChild?.clientHeight ?? 0,
      );
    }),
  );

  useVisibleTask$(() => {
    new TypeWriter(text)
      .withSpeed(200)
      .type('Eric + Claire')
      .wait(1000)
      .withMode(TypingMode.Insert)
      .withSpeed(80)
      .type('EClaire ')
      .wait(300)
      .andThen(() => new TypeWriter(yearText).withSpeed(300).type('2024'));
  });
  return (
    <div
      ref={heroElement}
      class={classNames(
        'prose max-w-full w-full font-sac flex flex-col justify-center p-8 min-h-max bg-red-200 fixed inset-x-0 top-0 z-10 shadow',
        props.class,
      )}
      style={{
        height: heroHeight.value ? heroHeight.value + 'px' : '100dvh',
      }}>
      <h1 class="font-sac text-left text-5xl mx-auto my-auto relative py-2">
        <span class="relative z-10">{text.value}</span>
        <span
          class="text-9xl text-white italic absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            opacity: Math.max(0, Math.min(100, heroHeight.value - 100)) / 100,
          }}>
          {yearText.value}
        </span>
      </h1>
    </div>
  );
});
