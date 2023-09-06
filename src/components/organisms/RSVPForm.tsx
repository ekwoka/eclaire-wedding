import { Button, Input, TextArea } from '@/atoms';
import type { QwikSubmitEvent } from '@builder.io/qwik';
import { $, component$, useSignal } from '@builder.io/qwik';
import { array, object, validate } from 'superstruct';
import { guest, rsvp } from '~/types/db';

import { GuestForm } from './GuestForm';

export const RSVPForm = component$(() => {
  const guestCount = useSignal(1);

  const submitRSVP = $(
    async (_e: QwikSubmitEvent<HTMLFormElement>, form: HTMLFormElement) => {
      const formData = new FormData(form);
      const data: {
        rsvp: Record<string, string>;
        guests: Partial<Record<string, string>>[];
      } = {
        rsvp: {},
        guests: [],
      };
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) continue;
        if (key.startsWith('guest-')) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_, index, field] = key.split('-');
          (data.guests[Number(index)] ??= {})[field] = value;
        } else data.rsvp[key] = value;
      }
      data.guests[0].name = data.rsvp.name;
      console.log(data);
      const [err, coercedData] = validate(
        data,
        object({
          rsvp,
          guests: array(guest),
        }),
        { coerce: true },
      );
      console.log(err, coercedData);
      if (err) return console.error(err);
      const response = await fetch('/api/rsvp/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(coercedData),
      });
      console.log(await response.text());
    },
  );

  return (
    <form
      class="w-full px-4 py-8 flex flex-col gap-4 mx-auto max-w-max"
      preventdefault:submit
      onSubmit$={submitRSVP}>
      <h2 class="uppercase tracking-wide small-caps text-red-900">RSVP</h2>
      <Input label="Email" type="email" placeholder="" />
      <Input label="Name" type="text" placeholder="" />
      <label class="flex justify-between items-center gap-4">
        <p>Can attend?</p>
        <select
          name="can_attend"
          class="rounded placeholder-shown:rounded-b-none placeholder-shown:bg-transparent bg-white/50 shadow placeholder-shown:shadow-none border-0 border-b-2">
          <option value="0">Nope</option>
          <option value="1" selected>
            Yup
          </option>
          <option value="2">Not sure</option>
        </select>
      </label>
      <label class="flex justify-between items-center gap-4">
        <p>Party Size</p>
        <select
          onChange$={(e) => (guestCount.value = Number(e.target.value))}
          class="rounded placeholder-shown:rounded-b-none placeholder-shown:bg-transparent bg-white/50 shadow placeholder-shown:shadow-none border-0 border-b-2">
          <option value="1" selected>
            Self
          </option>
          <option value="2">Self + 1</option>
          <option value="3">Self + 2</option>
          <option value="4">Self + 3</option>
        </select>
      </label>
      {Array.from({ length: guestCount.value }).map((_, i) => (
        <GuestForm key={i} isDefault={!i} index={i} />
      ))}
      <TextArea
        label="Other Notes"
        placeholder="Anything else you'd like to tell us?"
      />
      <Button variant="solid">Submit</Button>
    </form>
  );
});
