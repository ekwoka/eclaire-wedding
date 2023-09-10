import { Apple, GoogCalendar, GoogMaps } from '@/icons';
import { Card, Footer } from '@/molecule';
import { RSVPForm } from '@/organisms';
import { Hero } from '@/sections';
import { component$ } from '@builder.io/qwik';
import { type DocumentHead, Link } from '@builder.io/qwik-city';
import Lodging from '~/content/lodging.mdx';
import ThingToDo from '~/content/thingstodo.mdx';

export default component$(() => {
  return (
    <>
      <div class="min-h-[100dvh] w-full bg-red-200">
        <Hero />
      </div>
      <div class="w-full px-4 py-8 flex flex-col gap-8 mx-auto max-w-prose">
        <div class="flex flex-col 2xs:flex-row gap-4 flex-wrap">
          <Card class="grow relative basis-0 min-w-max">
            <h2 class="uppercase tracking-wide small-caps text-red-900">
              When
            </h2>
            <p class="text-xl text-right">
              <time
                dateTime={new Date('April 12 2024 11:30 GMT+9').toISOString()}>
                April 12th
              </time>
            </p>
            <p class="text-right text-sm">2024</p>
            <div class="flex flex-row gap-2 ml-auto max-w-max mt-4 -mb-2">
              <Link
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20240412T023000Z%2F20240412T053000Z&location=%20Smith%20Hanok%2022-7%20Samcheong-ro%2C%20Jongno-gu%2C%20Seoul%2C%20South%20Korea&text=EClaire%20Wedding"
                target="_blank"
                class="p-1 block">
                <GoogCalendar />
              </Link>
              <Link
                href={`webcal://${
                  import.meta.env.PUBLIC_HOST ?? window.location.host
                }/eclaire-wedding.ics`}
                class="p-1 block">
                <Apple />
              </Link>
            </div>
          </Card>
          <Card class="grow relative basis-0 min-w-max">
            <h2 class="uppercase tracking-wide small-caps text-red-900">
              Where
            </h2>
            <p class="text-right text-xl">Smith Hanok</p>
            <p class="text-sm text-right">Seoul, Korea</p>
            <Link
              class="p-1 block ml-auto max-w-max mt-4 -mb-2"
              href="https://goo.gl/maps/jueppkxY3FdjdCFu7"
              target="_blank">
              <span class="sr-only">Open in Google Maps</span>
              <GoogMaps />
            </Link>
          </Card>
        </div>
      </div>
      <RSVPForm />
      <div class="prose mx-auto px-8 py-16">
        <Lodging />
        <ThingToDo />
      </div>
      <Footer />
    </>
  );
});

export const head: DocumentHead = {
  title: 'EClaire 2024',
};
