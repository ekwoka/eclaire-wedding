import { Slot, component$ } from '@builder.io/qwik';

export const Prose = component$(() => (
  <div class="prose mx-auto px-8 py-16 prose-headings:font-script prose-h4:text-lg prose-hr:border-neutral-900">
    <Slot />
  </div>
));
