import { Slot, component$ } from '@builder.io/qwik';
import type { QwikIntrinsicElements } from '@builder.io/qwik';
import { classNames } from '~/utils';

export const Card = component$((props: QwikIntrinsicElements['div']) => {
  return (
    <div
      {...props}
      class={classNames(
        'bg-white/60 shadow-inner shadow-white rounded-md p-4',
        props.class,
      )}>
      <Slot />
    </div>
  );
});
