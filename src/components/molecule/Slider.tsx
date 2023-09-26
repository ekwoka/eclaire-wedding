import { component$ } from '@builder.io/qwik';
import images from 'virtual:images';

const sliderHeight = 80 / 4;

export const Slider = component$(() => {
  return (
    <div class="w-full flex flex-row gap-2 overflow-scroll snap-x snap-proximity py-4 scrollbar-hide">
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
          />
        );
      })}
    </div>
  );
});
