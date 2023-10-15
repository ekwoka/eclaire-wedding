import { component$ } from '@builder.io/qwik';

import { Nav } from './Nav';

export const Footer = component$(() => {
  return (
    <footer class="w-full px-8 py-16 bg-tuscany-200 text-center">
      <Nav />
    </footer>
  );
});
