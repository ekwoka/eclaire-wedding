import { component$ } from '@builder.io/qwik';
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from '@builder.io/qwik-city';

import { RouterHead } from './components/router-head/router-head';

export default component$(() => (
  <QwikCityProvider>
    <head>
      <meta charSet="utf-8" />
      <meta
        name="description"
        content="Eric & Claire are getting married April 12th, 2024 in Seoul! You should come! Here's how you can RSVP!"></meta>
      <link rel="manifest" href="/manifest.json" />
      <RouterHead />
      <ServiceWorkerRegister />
    </head>
    <body lang="en" class="flex flex-col min-h-full bg-tuscany-100">
      <RouterOutlet />
    </body>
  </QwikCityProvider>
));
