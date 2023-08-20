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
      <link rel="manifest" href="/manifest.json" />
      <RouterHead />
      <ServiceWorkerRegister />
    </head>
    <body lang="en" class="flex flex-col min-h-full bg-red-100">
      <RouterOutlet />
    </body>
  </QwikCityProvider>
));
