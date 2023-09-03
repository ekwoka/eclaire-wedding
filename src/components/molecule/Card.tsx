import { Slot, component$ } from '@builder.io/qwik';
import { classNames } from '~/utils';

export const Card = component$((props: { class?: string }) => {
  return (
    <div
      class={classNames(
        'bg-white/60 shadow-inner shadow-white rounded-md p-4',
        props.class,
      )}>
      <Slot />
    </div>
  );
});
