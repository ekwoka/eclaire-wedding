import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import images from 'virtual:images';
import { registerDragScroll } from '~/lib/registerDragScroll';

const sliderHeight = 80 / 4;

export const Slider = component$(() => {
  const sliderEl = useSignal<HTMLElement>();
  useVisibleTask$(() => sliderEl.value && registerDragScroll(sliderEl.value));
  return (
    <div
      ref={sliderEl}
      class="w-full flex flex-row gap-2 overflow-scroll snap-x snap-proximity py-4 scroll-smooth">
      {images.map((image) => {
        const height = image.height ?? 1;
        const width = image.width ?? 1;

        return (
          <img
            src={image.src}
            loading="lazy"
            class="snap-center shadow-lg"
            style={{
              height: sliderHeight + 'rem',
              minWidth: ((width / height) * sliderHeight).toFixed(2) + 'rem',
              width: ((width / height) * sliderHeight).toFixed(2) + 'rem',
            }}
            width={image.width}
            height={image.height}
            key={image.src}
            alt=""
          />
        );
      })}
    </div>
  );
});
