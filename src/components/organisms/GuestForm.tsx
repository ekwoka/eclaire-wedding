import { Input } from '@/atoms';
import { component$ } from '@builder.io/qwik';

export const GuestForm = component$(
  (props: { isDefault?: boolean; index: number }) => {
    return (
      <div class="w-full p-4 flex flex-col gap-4 mx-auto max-w-max">
        <h3 class="uppercase tracking-wide small-caps text-tuscany-900">
          {props.isDefault
            ? 'Primary Guest'
            : `Additional Guest + ${props.index}`}
        </h3>
        {!props.isDefault && (
          <Input type="text" name={`guest-${props.index}-name`} label="Name" />
        )}
        <Input
          type="text"
          name={`guest-${props.index}-dietary_restrictions`}
          label="Dietary Restrictions"
        />
      </div>
    );
  },
);
