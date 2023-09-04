import { component$ } from '@builder.io/qwik';

export const Input = component$(
  <T extends object>(props: {
    name?: string;
    type: string;
    label: string;
    placeholder?: string;
    dataStore: T;
    valueKey: keyof T;
  }) => {
    return (
      <label class="flex justify-between items-center gap-4">
        <p>{props.label}</p>
        <input
          type={props.type}
          name={props.name ?? props.label.toLowerCase().replace(/\s/g, '_')}
          placeholder={props.placeholder}
          value={String(props.dataStore[props.valueKey])}
          onChange$={(e) =>
            (props.dataStore[props.valueKey] = e.target.value as any)
          }
          class="rounded placeholder-shown:rounded-b-none placeholder-shown:bg-transparent bg-white/50 shadow placeholder-shown:shadow-none border-0 border-b-2"
        />
      </label>
    );
  },
);
