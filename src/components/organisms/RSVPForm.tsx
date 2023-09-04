import { Input, TextArea } from '@/atoms';
import { component$, useStore } from '@builder.io/qwik';
import type { RSVP } from '~/types/db';
import { Attendance } from '~/types/db';

export const RSVPForm = component$(() => {
  const data = useStore<RSVP>({
    email: '',
    name: '',
    can_attend: Attendance.Yes,
    other_notes: '',
  });

  return (
    <form class="w-full px-4 py-8 flex flex-col gap-4 mx-auto max-w-max">
      <h2 class="uppercase tracking-wide small-caps text-red-900">RSVP</h2>
      <Input
        label="Email"
        type="email"
        placeholder=""
        dataStore={data}
        valueKey="email"
      />
      <Input
        label="Name"
        type="text"
        placeholder=""
        dataStore={data}
        valueKey="name"
      />
      <TextArea
        label="Other Notes"
        placeholder="Anything else you'd like to tell us?"
        dataStore={data}
        valueKey="other_notes"
      />
    </form>
  );
});
