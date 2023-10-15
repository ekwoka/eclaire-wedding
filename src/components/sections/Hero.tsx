import {
  $,
  component$,
  useOnWindow,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import { TypeWriter, TypingMode } from '~/lib/TypeWriter';
import { classNames } from '~/utils';

export const Hero = component$(
  (props: { class?: string; style?: 'short' | 'full' }) => {
    const text = useSignal(' ');
    const yearText = useSignal(' ');
    const heroHeight = useSignal<number | undefined>(globalThis.innerHeight);
    const heroElement = useSignal<HTMLElement>();
    const animationDone = useSignal(false);
    useOnWindow(
      'scroll',
      $(() => {
        const height = window.innerHeight / (props.style === 'short' ? 4 : 1);
        const currentScroll = window.scrollY;
        const referenceElement = heroElement.value?.firstElementChild;
        if (!referenceElement) return;
        heroHeight.value = Math.max(
          height - currentScroll,
          referenceElement.clientHeight +
            parseInt(getComputedStyle(referenceElement).paddingTop) +
            parseInt(getComputedStyle(referenceElement).paddingBottom),
        );
        if (
          animationDone.value &&
          heroHeight.value < window.innerHeight * (4 / 5)
        )
          animationDone.value = false;
      }),
    );

    useVisibleTask$(() => {
      new TypeWriter(text)
        .withSpeed(150)
        .type('Eric + Claire')
        .wait(800)
        .withMode(TypingMode.Insert)
        .withSpeed(50)
        .type('EClaire ')
        .wait(200)
        .andThen(
          () =>
            (animationDone.value =
              heroHeight.value !== undefined
                ? heroHeight.value > window.innerHeight * (4 / 5)
                : true),
        )
        .andThen(() =>
          new TypeWriter(yearText).withSpeed(200).type('2024').wait(500),
        );
    });
    return (
      <>
        <div
          ref={heroElement}
          class={classNames(
            'prose max-w-full w-full font-sac flex flex-col justify-center px-8 min-h-max bg-tuscany-200 fixed inset-x-0 top-0 z-10 font-script',
            props.class,
          )}
          style={{
            height: heroHeight.value
              ? heroHeight.value + 'px'
              : props.style === 'short'
              ? '25dvh'
              : '100dvh',
          }}>
          <h1 class="font-sac text-left text-5xl mx-auto my-auto relative pb-2 pt-6">
            <span class="relative z-10">{text.value}</span>
            <span
              class="text-9xl text-white italic absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                opacity:
                  Math.max(0, Math.min(100, (heroHeight.value ?? 1000) - 150)) /
                  100,
              }}>
              {yearText.value}
            </span>
          </h1>
          {props.style !== 'short' && (
            <span
              class={classNames(
                'text-center transition-opacity opacity-0 text-2xl absolute bottom-20 inset-x-0 duration-[2s]',
                animationDone.value ? 'opacity-100' : 'opacity-0',
              )}>
              scroll down
            </span>
          )}
        </div>
      </>
    );
  },
);
