import { Try } from '@ekwoka/rust-ts';
import type { Handler } from '@netlify/functions';
import { PostgrestClient } from '@supabase/postgrest-js';
import { create } from 'superstruct';
import { rsvpAddRequest } from '~/types/db';
import type { Database, RSVPAddRequest } from '~/types/db';

const postgrest = new PostgrestClient<Database>(
  process.env.SUPABASE_API_URL as string,
  {
    headers: {
      apikey: process.env.SUPABASE_SECRET_KEY as string,
    },
    fetch: (...args) => {
      console.log(args);
      return fetch(...args);
    },
  },
);

export const handler: Handler = async (event, _context) => {
  const { body } = event;
  if (!body) return { statusCode: 400, body: 'No body provided' };
  const data = Try(() => JSON.parse(body)).andThen((rsvpData: RSVPAddRequest) =>
    Try(() => create(rsvpData, rsvpAddRequest, 'Invalid Data')),
  );
  if (data.isErr()) return { statusCode: 400, body: data.unwrapErr().message };
  const { rsvp, guests } = data.expect('Previous check caught errors');
  const createdRSVP = await postgrest.from('rsvp').insert(rsvp).select();
  console.log(createdRSVP);
  if (!createdRSVP.data)
    return { statusCode: 500, body: 'Failed to create RSVP' };
  const createdGuests = await postgrest
    .from('guests')
    .insert(
      guests.map((guest) => ({ ...guest, rsvp_id: createdRSVP.data[0].id })),
    )
    .select();
  console.log(createdGuests);
  if (!createdGuests.data)
    return { statusCode: 500, body: 'Failed to create guests' };

  return {
    statusCode: 200,
    body: JSON.stringify({
      rsvp: createdRSVP.data[0],
      guests: createdGuests.data,
    }),
  };
};
