import { Button, Input, Prose, TextArea } from '@/atoms';
import type { QwikSubmitEvent } from '@builder.io/qwik';
import { $, component$, useSignal } from '@builder.io/qwik';
import { TryAsync } from '@ekwoka/rust-ts';
import { array, object } from 'superstruct';
import { proxyPromise } from '~/lib/promiseAwait';
import { tryValidate } from '~/lib/tryValidate';
import { guest, rsvp } from '~/types/db';

import { GuestForm } from './GuestForm';

export const RSVPForm = component$(() => {
  const guestCount = useSignal(1);
  const status = useSignal<{
    sending: boolean;
    error: null | string;
    success: boolean;
  }>({ sending: false, error: null, success: false });

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
      tryValidate(
        data,
        object({
          rsvp,
          guests: array(guest),
        }),
        { coerce: true },
      )
        .andThen((coercedData) =>
          proxyPromise(
            TryAsync(() =>
              fetch('/api/rsvp/add', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(coercedData),
              }),
            ),
          ),
        )
        .andThen((response) =>
          proxyPromise(
            TryAsync(
              async () =>
                await submissionStatus[
                  response.status as keyof typeof submissionStatus
                ](response),
            ),
          ),
        )
        .mapErr(() => submissionStatus[500]())
        .andThen((updatedStatus) => {
          status.value = updatedStatus;
        });
    },
  );

  return status.value.success ? (
    <Prose>
      <h3 class="text-center">You've now RSVP'd! See you in April!</h3>
      <p>
        If you are still looking for a place to do or things to do, we have some
        extra info to help you plan your trip!
      </p>
      <ul>
        <li>
          <a href="/where-to-stay">Where to stay</a>
        </li>
        <li>What to do in Seoul (coming soon)</li>
      </ul>
    </Prose>
  ) : (
    <form
      id="rsvp-form"
      class="w-full px-4 py-8 flex flex-col gap-4 mx-auto max-w-max"
      preventdefault:submit
      onSubmit$={submitRSVP}>
      <h2 class="uppercase tracking-wide small-caps text-tuscany-900">RSVP</h2>
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
      {status.value.error && (
        <div class="bg-tuscany-500 text-white p-4 rounded">
          {status.value.error}
        </div>
      )}
      <Button variant="solid">
        {status.value.sending ? 'Sending...' : 'Submit'}
      </Button>
    </form>
  );
});

const submissionStatus = {
  200: () => ({
    sending: false,
    error: null,
    success: true,
  }),
  400: async (response: Response) => {
    const message = await response.text();
    console.error(message);
    return {
      sending: false,
      error: 'Oh no! Looks like you have already RSVPed with that email.',
      success: false,
    };
  },
  500: () => ({
    sending: false,
    error:
      'Something terrible has happened. Please try again, or email your RSVP to us at eric@thekwoka.net',
    success: false,
  }),
};
