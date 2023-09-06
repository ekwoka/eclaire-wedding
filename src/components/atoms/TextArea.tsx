import { component$ } from '@builder.io/qwik';

export const TextArea = component$(
  (props: { name?: string; label: string; placeholder?: string }) => {
    return (
      <label class="flex flex-col gap-4">
        <p>{props.label}</p>
        <textarea
          name={props.name ?? props.label.toLowerCase().replace(/\s/g, '_')}
          placeholder={props.placeholder}
          class="rounded placeholder-shown:rounded-b-none placeholder-shown:bg-transparent bg-white/50 shadow placeholder-shown:shadow-none border-0 border-b-2"
        />
      </label>
    );
  },
);
