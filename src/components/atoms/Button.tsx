import { Slot, component$ } from '@builder.io/qwik';
import type { QwikIntrinsicElements } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import type { LinkProps } from '@builder.io/qwik-city';
import { classNames } from '~/utils';

const baseStyles = {
  solid:
    'inline-flex justify-center rounded-md py-2 px-4 text-base font-semibold tracking-tight focus:outline-none shadow-md',
  outline:
    'inline-flex justify-center rounded-md border py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.4)-1px)] text-base font-semibold tracking-tight focus:outline-none hover:shadow-md',
};

const variantStyles = {
  solid: {
    slate:
      'bg-slate-900 text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 active:bg-slate-700 active:text-white/80 disabled:opacity-30 disabled:hover:bg-slate-900',
    blue: 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-700 active:text-white/80 disabled:opacity-30 disabled:hover:bg-blue-600',
    white:
      'bg-white text-blue-600 hover:text-blue-700 focus-visible:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:bg-blue-50 active:text-blue-900/80 disabled:opacity-40 disabled:hover:text-blue-600',
  },
  outline: {
    slate:
      'border-slate-200 text-slate-900 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 active:border-slate-200 active:bg-slate-50 active:text-slate-900/70 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-transparent',
    blue: 'border-blue-300 text-blue-600 hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:text-blue-600/70 disabled:opacity-40 disabled:hover:border-blue-300 disabled:hover:bg-transparent',
  },
};

type variants = keyof typeof baseStyles;
type colors = keyof (typeof variantStyles)[variants];

export const Button = component$<
  { variant?: variants; color?: colors } & QwikIntrinsicElements['button']
>(({ variant = 'solid', color = 'slate', class: className, ...props }) => {
  return (
    <button
      class={classNames(
        baseStyles[variant],
        variantStyles[variant][color],
        className,
      )}
      {...props}>
      <Slot />
    </button>
  );
});

export const ButtonLink = component$<
  {
    variant?: variants;
    color?: colors;
    href: string;
  } & LinkProps
>(
  ({
    variant = 'solid',
    color = 'slate',
    href,
    class: className,
    ...props
  }) => {
    return (
      <Link
        href={href}
        class={classNames(
          baseStyles[variant],
          variantStyles[variant][color],
          className,
        )}
        {...props}>
        <Slot />
      </Link>
    );
  },
);
