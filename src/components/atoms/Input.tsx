import { component$ } from '@builder.io/qwik';

export const Input = component$(
  (props: {
    name?: string;
    type: string;
    label: string;
    placeholder?: string;
  }) => {
    return (
      <label class="flex justify-between items-center gap-4">
        <p>{props.label}</p>
        <input
          type={props.type}
          name={props.name ?? props.label.toLowerCase().replace(/\s/g, '_')}
          placeholder={props.placeholder}
          class="rounded placeholder-shown:rounded-b-none placeholder-shown:bg-transparent bg-white/50 shadow placeholder-shown:shadow-none border-0 border-b-2"
        />
      </label>
    );
  },
);
