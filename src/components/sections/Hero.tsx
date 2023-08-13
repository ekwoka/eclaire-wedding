import { ButtonLink } from '@/atoms';
import { component$ } from '@builder.io/qwik';
import { inLocaleTime, inRelativeTime } from '~/utils';

export const Hero = component$(() => {
  const time = new Date('April 12 2024 11:30 GMT+9');
  return (
    <header class="bg-blue-100 lg:bg-transparent lg:px-5 pb-10">
      <div class="mx-auto grid max-w-6xl grid-cols-1 grid-rows-[auto_1fr] gap-y-16 pt-16 md:pt-20 lg:grid-cols-12 lg:gap-y-20 lg:px-3 lg:pb-36 lg:pt-20 xl:py-32 items-center">
        <div class="relative flex items-end lg:col-span-5">
          <div class="absolute -bottom-12 -top-20 left-0 right-1/2 z-10 rounded-br-3xl bg-blue-600 text-white/10 md:bottom-8 lg:-inset-y-32 lg:left-[-100vw] lg:right-full lg:-mr-40 overflow-hidden">
            <div class="heropattern-endlessclouds-blue-500 absolute -inset-20"></div>
          </div>
          <div class="relative z-10 mx-auto flex w-64 rounded-xl shadow-xl md:w-80 lg:w-auto overflow-hidden">
            <img
              class="w-full"
              src="https://placekitten.com/600/800"
              alt=""
              width="600"
              height="800"
            />
          </div>
        </div>
        <div class="pt-16 lg:col-span-7 lg:bg-transparent lg:pl-16 lg:pt-0 xl:pl-20">
          <div class="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0 prose">
            <h1 class="font-poppins text-7xl text-left">Eric & Claire</h1>
            <p>Seoul, Korea</p>
            <p>
              <time dateTime={time.toISOString()} class="flex gap-3">
                <span class="font-semibold">{inLocaleTime(time)}</span>
                {inRelativeTime(time)}
              </time>
            </p>
          </div>
          <div class="mt-8 flex gap-4 justify-center">
            <ButtonLink href="#free-chapters" color="blue">
              Get sample chapter
            </ButtonLink>
            <ButtonLink href="#pricing" variant="outline" color="blue">
              Buy book
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
});
