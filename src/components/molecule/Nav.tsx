import { component$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { classNames } from '~/utils';

export const Nav = component$(() => {
  const location = useLocation();
  return (
    <header class="w-full z-50 sticky top-20 bg-red-200 py-2">
      <nav class="flex justify-around ">
        <Link prefetch href="/#rsvp-form" class="px-4 py-2 rounded-full">
          RSVP
        </Link>
        <Link
          prefetch
          href="/where-to-stay"
          class={classNames(
            'px-4 py-2 rounded-full',
            location.url.pathname === '/where-to-stay/' &&
              'pointer-events-none font-semibold',
          )}>
          Where to Stay
        </Link>
      </nav>
    </header>
  );
});
