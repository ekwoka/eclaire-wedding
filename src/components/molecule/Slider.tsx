import { component$ } from '@builder.io/qwik';
import images from 'virtual:images';

export const Slider = component$(() => {
  return (
    <div class="w-full flex flex-row gap-2 overflow-scroll snap-x snap-proximity py-4">
      {images.map((image) => {
        return (
          <img
            src={image.src}
            loading="lazy"
            class="h-80 w-auto snap-center shadow-lg"
            width={image.width}
            height={image.height}
            key={image.src}
          />
        );
      })}
    </div>
  );
});
